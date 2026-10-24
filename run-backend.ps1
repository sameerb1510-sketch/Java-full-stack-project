$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$envFile = Join-Path $projectRoot '.env.local'
$maven = Join-Path $projectRoot '.tools\apache-maven-3.10.0\bin\mvn.cmd'
$repository = Join-Path $projectRoot '.tools\m2repo'

if (-not (Test-Path -LiteralPath $envFile)) {
    throw 'Missing .env.local. Add MYSQL_URL, MYSQL_USER, and MYSQL_PASSWORD before starting the backend.'
}
if (-not (Test-Path -LiteralPath $maven)) {
    throw 'Project-local Maven was not found in .tools.'
}

Get-Content -LiteralPath $envFile | ForEach-Object {
    if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$') {
        Set-Item -Path "Env:$($Matches[1])" -Value $Matches[2]
    }
}

Push-Location (Join-Path $projectRoot 'backend')
try {
    & $maven "-Dmaven.repo.local=$repository" spring-boot:run
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
