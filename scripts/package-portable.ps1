$ErrorActionPreference='Stop'
$projectRoot=Split-Path -Parent $PSScriptRoot
$builtExe=Join-Path $projectRoot 'src-tauri\target\release\laboratoire-pedagogique-ia.exe'
if(-not(Test-Path -LiteralPath $builtExe)){throw 'Exécutable release absent : construire avant de préparer la livraison.'}
$portableExe=Join-Path $projectRoot 'Laboratoire pedagogique IA.exe'
Copy-Item -LiteralPath $builtExe -Destination $portableExe -Force
$artifacts=@($portableExe)
$nsisDir=Join-Path $projectRoot 'src-tauri\target\release\bundle\nsis'
if(Test-Path -LiteralPath $nsisDir){
  $installer=Get-ChildItem -LiteralPath $nsisDir -Filter '*.exe' -File | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if($installer){$installerCopy=Join-Path $projectRoot 'Installer-Laboratoire-IA-0.1.0.exe';Copy-Item -LiteralPath $installer.FullName -Destination $installerCopy -Force;$artifacts+=$installerCopy}
}
$report=foreach($artifact in $artifacts){$item=Get-Item -LiteralPath $artifact;[pscustomobject]@{name=$item.Name;bytes=$item.Length;sha256=(Get-FileHash -LiteralPath $artifact -Algorithm SHA256).Hash}}
[IO.File]::WriteAllText((Join-Path $projectRoot 'evidence\windows-artifacts.json'),($report|ConvertTo-Json -Depth 3),(New-Object Text.UTF8Encoding($false)))
$report|Format-Table