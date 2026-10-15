param([Parameter(Mandatory=$true)][string]$PythonPath)
$ErrorActionPreference='Stop'
$projectRoot=Split-Path -Parent $PSScriptRoot
$resolved=(Resolve-Path -LiteralPath $PythonPath).Path
if(-not [IO.Path]::IsPathRooted($resolved) -or [IO.Path]::GetExtension($resolved) -ne '.exe'){throw 'Indiquez un python.exe local existant.'}
New-Item -ItemType Directory -Path (Join-Path $projectRoot '.local') -Force | Out-Null
[IO.File]::WriteAllText((Join-Path $projectRoot '.local\python-path.txt'),$resolved,(New-Object Text.UTF8Encoding($false)))
Write-Output 'Chemin Python enregistré localement. Aucun paquet téléchargé.'