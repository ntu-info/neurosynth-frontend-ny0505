Param(
  [string]$OutDir = "frontend\tmp",
  [int]$TimeoutSec = 30
)

# Ensure output directory exists
New-Item -ItemType Directory -Path $OutDir -Force | Out-Null

$endpoints = @{
  terms = "https://mil.psy.ntu.edu.tw:5000/terms"
  term_amygdala = "https://mil.psy.ntu.edu.tw:5000/terms/amygdala"
  query_amygdala = "https://mil.psy.ntu.edu.tw:5000/query/amygdala%20not%20emotion/studies"
}

Write-Host "Saving smoke test outputs to: $OutDir"

foreach ($k in $endpoints.Keys) {
  $uri = $endpoints[$k]
  $outFile = Join-Path $OutDir ($k + '.json')
  try {
    Write-Host "Fetching $uri ..." -NoNewline
    $resp = Invoke-RestMethod -Uri $uri -TimeoutSec $TimeoutSec
    $resp | ConvertTo-Json -Depth 8 | Out-File -FilePath $outFile -Encoding utf8
    Write-Host " saved to $outFile"
  } catch {
    $msg = $_.Exception.Message
    Write-Host " FAILED: $msg"
    # Write error body (if any) to a .err file for debugging
  $errFile = Join-Path $OutDir ($k + '.err.txt')
  $errText = "$uri`nError: $msg"
  $errText | Out-File -FilePath $errFile -Encoding utf8
  }
}

Write-Host "Smoke run complete. Check $OutDir for .json / .err files." 
