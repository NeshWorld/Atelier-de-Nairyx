$ErrorActionPreference='Stop'
$projectRoot=Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot
$rustBins=Join-Path $env:USERPROFILE '.cargo\bin'
if(Test-Path -LiteralPath $rustBins){$env:Path=$rustBins+';'+$env:Path}
$env:CARGO_HOME=Join-Path $projectRoot '.local\cargo'
$env:CARGO_TARGET_DIR=Join-Path $projectRoot 'src-tauri\target'
& cargo.exe test --manifest-path src-tauri/Cargo.toml --locked --workspace --lib -- --include-ignored
if($LASTEXITCODE -ne 0){throw 'Tests natifs en échec.'}