$ErrorActionPreference = 'Stop'

$mysqlBin = 'C:\Program Files\MySQL\MySQL Server 8.4\bin'
$server = Join-Path $mysqlBin 'mysqld.exe'
$config = Join-Path $PSScriptRoot '.tools\mysql.ini'

if (-not (Test-Path -LiteralPath $server)) {
    throw "MySQL server was not found at $server"
}
if (-not (Test-Path -LiteralPath $config)) {
    throw "MySQL configuration was not found at $config"
}

if (-not (Test-NetConnection -ComputerName 127.0.0.1 -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue)) {
    $argumentLine = '"--defaults-file=' + $config + '"'
    Start-Process -FilePath $server -ArgumentList $argumentLine -WindowStyle Hidden | Out-Null

    $ready = $false
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        Start-Sleep -Seconds 2
        if (Test-NetConnection -ComputerName 127.0.0.1 -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue) {
            $ready = $true
            break
        }
    }
    if (-not $ready) {
        throw 'MySQL did not start listening on 127.0.0.1:3306.'
    }
}

Write-Output 'MySQL is listening on 127.0.0.1:3306.'
