//! Native/Python integration tests. Included by `#[cfg(test)] mod integration_tests;`.
//! All cases are ignored by default: `cargo test --lib -- --include-ignored`.
#![cfg(windows)]

use super::*;
use std::io::{BufRead, BufReader};
use std::os::windows::io::{AsRawHandle, FromRawHandle, OwnedHandle};
use std::sync::mpsc;
use windows_sys::Win32::System::Threading::{OpenProcess, WaitForSingleObject};

fn project_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("src-tauri must have a parent project directory")
        .to_path_buf()
}

fn assert_idle(state: &EngineState) {
    assert!(!state.busy.load(Ordering::SeqCst), "busy must reset after execute");
    assert!(state.job.lock().expect("state job lock").is_none(), "Job handle must be closed after execute");
}

fn run_example(example: &str) -> (serde_json::Value, Arc<EngineState>) {
    let state = Arc::new(EngineState::default());
    let value = execute(state.clone(), project_root(), example.to_owned())
        .unwrap_or_else(|error| panic!("real example {example} failed: {error}"));
    assert_idle(&state);
    assert_eq!(value["timedOut"], false, "{value}");
    assert_eq!(value["truncated"], false, "{value}");
    (value, state)
}

#[test]
#[ignore = "requires configured Python"]
fn real_tokens_reconstruct_unicode_input() {
    let (value, _) = run_example("tokens");
    assert_eq!(value["exitCode"], 0, "{value}");
    assert_eq!(value["stderr"], "");
    let output = value["stdout"].as_str().expect("stdout string");
    let data: serde_json::Value = serde_json::from_str(output.lines().nth(1).expect("tokens JSON line"))
        .expect("parse token result");
    let pieces = data["tokens"].as_array().expect("token array");
    let reconstructed: String = pieces.iter().map(|piece| piece.as_str().expect("token string")).collect();
    assert_eq!(reconstructed, data["phrase"].as_str().expect("phrase"));
    assert!(reconstructed.contains("L'atelier"));
    assert!(reconstructed.contains("l’IA"));
    assert_eq!(pieces.len(), data["ids"].as_array().expect("ids").len());
}

#[test]
#[ignore = "requires configured Python"]
fn real_neuron_computes_weighted_sum() {
    let (value, _) = run_example("neuron");
    assert_eq!(value["exitCode"], 0, "{value}");
    let output = value["stdout"].as_str().expect("stdout string");
    let data: serde_json::Value = serde_json::from_str(output.lines().next().expect("neuron JSON line"))
        .expect("parse neuron result");
    let calculated: f64 = data["inputs"].as_array().expect("inputs").iter()
        .zip(data["weights"].as_array().expect("weights"))
        .map(|(x, w)| x.as_f64().unwrap() * w.as_f64().unwrap()).sum::<f64>()
        + data["bias"].as_f64().expect("bias");
    assert!((calculated - data["sum"].as_f64().expect("sum")).abs() < 1e-9);
    assert!((data["relu"].as_f64().unwrap() - calculated.max(0.0)).abs() < 1e-9);
}

#[test]
#[ignore = "requires configured Python"]
fn real_error_preserves_stderr_and_nonzero_exit_and_resets_busy() {
    let (value, state) = run_example("error");
    assert_ne!(value["exitCode"].as_i64().expect("exit code"), 0);
    assert_eq!(value["stdout"], "");
    let stderr = value["stderr"].as_str().expect("stderr string");
    assert!(stderr.contains("RuntimeError"), "{stderr}");
    assert!(stderr.contains("Erreur pédagogique volontaire"), "{stderr}");
    // A failed example must not leave the shared state busy for the next run.
    let next = execute(state.clone(), project_root(), "neuron".into()).expect("run after example error");
    assert_eq!(next["exitCode"], 0, "{next}");
    assert_idle(&state);
}

#[test]
#[ignore = "requires configured Python"]
fn native_execute_refuses_sources_and_preserves_busy_owner() {
    let state = Arc::new(EngineState::default());
    for source in ["print(1)", "../../probe.py", "tokens & whoami", "tokens\n", ""] {
        assert!(execute(state.clone(), project_root(), source.into()).is_err());
        assert_idle(&state);
    }
    state.busy.store(true, Ordering::SeqCst);
    let error = execute(state.clone(), project_root(), "tokens".into()).expect_err("busy owner must be protected");
    assert!(error.contains("déjà en cours"), "{error}");
    assert!(state.busy.load(Ordering::SeqCst), "a rejected concurrent call must not clear another owner's busy flag");
    state.busy.store(false, Ordering::SeqCst);
    let result = execute(state.clone(), project_root(), "tokens".into()).expect("subsequent run");
    assert_eq!(result["exitCode"], 0, "{result}");
    assert_idle(&state);
}

// Ensures a panic or assertion failure cannot leave the bounded fixture running.
struct FixtureProcess {
    child: std::process::Child,
    state: Arc<EngineState>,
}
impl Drop for FixtureProcess {
    fn drop(&mut self) {
        let _ = self.state.stop();
        let _ = self.child.kill();
        let _ = self.child.wait();
        if let Ok(mut slot) = self.state.job.lock() { *slot = None; }
    }
}

#[test]
#[ignore = "requires configured Python"]
fn native_stop_kills_fixed_fixture_and_its_descendant() {
    use std::os::windows::process::CommandExt;
    let root = project_root();
    let python = find_python(&root).expect("configured Python runtime");
    let fixture_path = root.join("engine/_fixtures.py");
    assert!(fixture_path.is_file(), "safe fixture must exist");
    let state = Arc::new(EngineState::default());
    state.busy.store(true, Ordering::SeqCst);
    let run_guard = RunGuard(state.clone());
    let child = Command::new(python).args(["-I", "-B"]).arg(fixture_path).arg("descendant")
        .creation_flags(0x08000000)
        .stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::null())
        .spawn().expect("launch fixed descendant fixture");
    let mut fixture = FixtureProcess { child, state: state.clone() };
    let job = ProcessJob::attach(&fixture.child).expect("assign fixture before opening its gate");
    *state.job.lock().expect("state job lock") = Some(job);
    let stdout = fixture.child.stdout.take().expect("fixture stdout");
    let (sender, receiver) = mpsc::channel();
    let reader = std::thread::spawn(move || {
        let mut line = String::new();
        let result = BufReader::new(stdout).read_line(&mut line).map(|_| line);
        let _ = sender.send(result);
    });
    {
        let mut stdin = fixture.child.stdin.take().expect("fixture gate");
        stdin.write_all(b"RUN\n").expect("open fixture gate");
    }
    let line = receiver.recv_timeout(Duration::from_secs(5)).expect("descendant PID within five seconds")
        .expect("read descendant PID");
    let pid: u32 = line.trim().parse().expect("numeric descendant PID");
    reader.join().expect("PID reader");
    // Keep a real process handle before cancellation, avoiding PID reuse races.
    let raw_handle = unsafe { OpenProcess(0x00100000, 0, pid) }; // SYNCHRONIZE
    assert!(!raw_handle.is_null(), "OpenProcess descendant: {}", std::io::Error::last_os_error());
    let descendant = unsafe { OwnedHandle::from_raw_handle(raw_handle) };
    assert_eq!(unsafe { WaitForSingleObject(descendant.as_raw_handle(), 0) }, 258, "descendant should initially be running"); // WAIT_TIMEOUT
    state.stop().expect("TerminateJobObject through EngineState.stop");
    assert!(state.cancelled.load(Ordering::SeqCst));
    assert_eq!(unsafe { WaitForSingleObject(fixture.child.as_raw_handle(), 3000) }, 0, "fixture parent must stop");
    assert_eq!(unsafe { WaitForSingleObject(descendant.as_raw_handle(), 3000) }, 0, "fixture descendant must stop");
    fixture.child.wait().expect("reap fixture parent");
    drop(fixture);
    drop(run_guard);
    assert_idle(&state);
}

