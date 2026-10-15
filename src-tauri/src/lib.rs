use std::sync::{Arc, Mutex, atomic::{AtomicBool, Ordering}};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::time::{Duration, Instant};
use tauri::Manager;

#[derive(Default)]
struct EngineState { busy: AtomicBool, cancelled: AtomicBool, job: Mutex<Option<ProcessJob>> }

#[cfg(windows)]
struct ProcessJob(usize);
#[cfg(windows)]
impl ProcessJob {
    fn attach(child:&std::process::Child)->Result<Self,String> {
        use std::os::windows::io::AsRawHandle;
        use windows_sys::Win32::System::JobObjects::*;
        unsafe {
            let handle=CreateJobObjectW(std::ptr::null(),std::ptr::null());
            if handle.is_null(){return Err(format!("Création du Job Object : {}",std::io::Error::last_os_error()));}
            let job=Self(handle as usize);
            let mut limits:JOBOBJECT_EXTENDED_LIMIT_INFORMATION=std::mem::zeroed();
            limits.BasicLimitInformation.LimitFlags=JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE;
            if SetInformationJobObject(handle,JobObjectExtendedLimitInformation,&limits as *const _ as *const _,std::mem::size_of_val(&limits) as u32)==0{return Err(format!("Configuration du Job Object : {}",std::io::Error::last_os_error()));}
            if AssignProcessToJobObject(handle,child.as_raw_handle())==0{return Err(format!("Affectation du processus : {}",std::io::Error::last_os_error()));}
            Ok(job)
        }
    }
    fn terminate(&self) -> Result<(),String> { if unsafe { windows_sys::Win32::System::JobObjects::TerminateJobObject(self.0 as _,1) } == 0 { Err(format!("Arrêt Windows impossible : {}",std::io::Error::last_os_error())) } else { Ok(()) } }
}
#[cfg(windows)]
impl Drop for ProcessJob { fn drop(&mut self){unsafe{windows_sys::Win32::Foundation::CloseHandle(self.0 as _);}} }
#[cfg(not(windows))]
struct ProcessJob;
#[cfg(not(windows))]
impl ProcessJob { fn attach(_: &std::process::Child)->Result<Self,String>{Err("Ce prototype de contrôle des processus est réservé à Windows.".into())} fn terminate(&self)->Result<(),String>{Err("Contrôle des processus réservé à Windows".into())} }

impl EngineState { fn stop(&self)->Result<(),String>{self.cancelled.store(true,Ordering::SeqCst);let job=self.job.lock().map_err(|_|"État du moteur indisponible".to_string())?;if let Some(job)=job.as_ref(){job.terminate()?;}Ok(())} }
struct RunGuard(Arc<EngineState>);
impl Drop for RunGuard { fn drop(&mut self){if let Ok(mut job)=self.0.job.lock(){*job=None;}self.0.busy.store(false,Ordering::SeqCst);} }

fn approved_example(source:&str)->Result<&str,String>{match source{"tokens"|"neuron"|"error"=>Ok(source),_=>Err("Seuls les trois exemples pédagogiques fixes sont exécutables dans ce prototype.".into())}}
fn find_python(resource_dir:&Path)->Result<PathBuf,String>{
    let packaged=resource_dir.join("python").join("python.exe");if packaged.is_file(){return Ok(packaged);}
    let config=Path::new(env!("CARGO_MANIFEST_DIR")).join("../.local/python-path.txt");
    let path=std::fs::read_to_string(config).map_err(|_|"Python local non configuré. Consultez scripts/configure-python.ps1 ; aucun téléchargement automatique n’est effectué.".to_string())?;
    let path=PathBuf::from(path.trim().trim_start_matches('\u{feff}'));
    if !path.is_absolute()||!path.is_file()||path.extension().and_then(|s|s.to_str())!=Some("exe"){return Err("Chemin du moteur Python invalide.".into());}Ok(path)
}
fn drain<R:Read>(mut reader:R)->std::io::Result<Vec<u8>>{let mut saved=Vec::new();let mut block=[0u8;8192];loop{let count=reader.read(&mut block)?;if count==0{break;}let remaining=1048576usize.saturating_sub(saved.len());saved.extend_from_slice(&block[..count.min(remaining)]);}Ok(saved)}
fn execute(state:Arc<EngineState>,resource_dir:PathBuf,source:String)->Result<serde_json::Value,String>{
    approved_example(&source)?;
    if state.busy.compare_exchange(false,true,Ordering::SeqCst,Ordering::SeqCst).is_err(){return Err("Un exemple est déjà en cours.".into());}
    let _guard=RunGuard(state.clone());state.cancelled.store(false,Ordering::SeqCst);
    let python=find_python(&resource_dir)?;
    let bundled=resource_dir.join("engine/runner.py");let runner=if bundled.is_file(){bundled}else{Path::new(env!("CARGO_MANIFEST_DIR")).join("../engine/runner.py")};
    if !runner.is_file(){return Err("Moteur pédagogique introuvable.".into());}
    let mut command=Command::new(python);command.args(["-I","-B"]).arg(&runner).current_dir(runner.parent().ok_or("Dossier moteur invalide")?).stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped());
    #[cfg(windows)]{use std::os::windows::process::CommandExt;command.creation_flags(0x08000000);}
    let mut child=command.spawn().map_err(|e|format!("Démarrage Python impossible : {e}"))?;
    // Le runner attend sa requête stdin : aucun exemple ne démarre avant son affectation au Job Object.
    let job=match ProcessJob::attach(&child){Ok(job)=>job,Err(e)=>{let _=child.kill();let _=child.wait();return Err(e);}};
    match state.job.lock(){Ok(mut slot)=>*slot=Some(job),Err(_)=>{drop(job);let _=child.kill();let _=child.wait();return Err("État du moteur indisponible".into());}}
    let out=child.stdout.take().ok_or("Console standard absente")?;let err=child.stderr.take().ok_or("Console erreur absente")?;
    let stdout=std::thread::spawn(move||drain(out));let stderr=std::thread::spawn(move||drain(err));
    let input=serde_json::json!({"example":source,"timeoutSeconds":10,"maxOutputBytes":65536}).to_string();
    if let Some(mut stdin)=child.stdin.take(){if let Err(e)=stdin.write_all(input.as_bytes()){let _=state.stop();let _=child.wait();let _=stdout.join();let _=stderr.join();return Err(format!("Requête Python impossible : {e}"));}}
    let start=Instant::now();let mut forced=false;
    let status=loop{match child.try_wait(){Ok(Some(status))=>break Ok(status),Ok(None)=>{},Err(e)=>break Err(e)}if state.cancelled.load(Ordering::SeqCst)||start.elapsed()>Duration::from_secs(15){forced=true;let _=state.stop();let _=child.kill();break child.wait();}std::thread::sleep(Duration::from_millis(20));};
    if let Ok(job)=state.job.lock(){if let Some(job)=job.as_ref(){let _=job.terminate();}}
    let out=stdout.join().map_err(|_|"Lecture console interrompue")?.map_err(|e|e.to_string())?;let err=stderr.join().map_err(|_|"Lecture erreur interrompue")?.map_err(|e|e.to_string())?;
    if state.cancelled.load(Ordering::SeqCst){forced=true;}
    if forced{return Err("Exécution interrompue ; aucun code libre n’a été exécuté.".into());}
    let status=status.map_err(|e|e.to_string())?;
    if !status.success(){return Err(format!("Moteur Python en erreur : {}",String::from_utf8_lossy(&err)));}
    let result:serde_json::Value=serde_json::from_slice(&out).map_err(|e|format!("Réponse Python invalide : {e}"))?;Ok(result)
}
#[tauri::command]
async fn run_python_demo(app:tauri::AppHandle,state:tauri::State<'_,Arc<EngineState>>,source:String)->Result<serde_json::Value,String>{
    approved_example(&source)?;let state=state.inner().clone();let resource_dir=app.path().resource_dir().map_err(|e|e.to_string())?;
    tauri::async_runtime::spawn_blocking(move||execute(state,resource_dir,source)).await.map_err(|e|e.to_string())?
}
#[tauri::command]
fn stop_python_demo(state:tauri::State<'_,Arc<EngineState>>)->Result<(),String>{state.stop()}
#[cfg_attr(mobile,tauri::mobile_entry_point)]
pub fn run(){tauri::Builder::default().manage(Arc::new(EngineState::default())).invoke_handler(tauri::generate_handler![run_python_demo,stop_python_demo]).build(tauri::generate_context!()).expect("Initialisation Tauri impossible").run(|app,event|{if matches!(event,tauri::RunEvent::ExitRequested{..}|tauri::RunEvent::Exit){let _=app.state::<Arc<EngineState>>().stop();}});}
#[cfg(test)]mod tests{use super::*;#[test]fn examples_are_allowlisted(){for value in ["tokens","neuron","error"]{assert!(approved_example(value).is_ok());}for value in ["../../probe.py","print(1)","tokens & whoami",""]{assert!(approved_example(value).is_err());}}}
#[cfg(test)]
mod integration_tests;
