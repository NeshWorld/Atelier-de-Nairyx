$ErrorActionPreference='Stop'
$projectRoot=Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot
$rustBins=Join-Path $env:USERPROFILE '.cargo\bin'
if(Test-Path -LiteralPath $rustBins){$env:Path=$rustBins+';'+$env:Path}
if(-not(Get-Command cargo.exe -ErrorAction SilentlyContinue)){throw 'Rust/Cargo absent. Installer les prérequis uniquement après autorisation.'}
$env:CARGO_HOME=Join-Path $projectRoot '.local\cargo'
$env:CARGO_TARGET_DIR=Join-Path $projectRoot 'src-tauri\target'
$env:npm_config_cache=Join-Path $projectRoot '.npm-cache'
& npm.cmd test
if($LASTEXITCODE -ne 0){throw 'Tests frontend en échec.'}
$nativeArgs=@('test','--manifest-path','src-tauri/Cargo.toml','--locked','--workspace','--lib')
$pythonConfig=Join-Path $projectRoot '.local\python-path.txt'
if(Test-Path -LiteralPath $pythonConfig){$nativeArgs+=@('--','--include-ignored')}else{Write-Output 'Python non configuré : les cinq tests d’intégration Python resteront explicitement ignorés.'}
& cargo.exe @nativeArgs
if($LASTEXITCODE -ne 0){throw 'Tests natifs en échec.'}
& npm.cmd run desktop:build -- -- --locked
if($LASTEXITCODE -ne 0){throw 'Compilation native en échec.'}
& (Join-Path $PSScriptRoot 'package-portable.ps1')
