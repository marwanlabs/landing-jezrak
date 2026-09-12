Add-Type -AssemblyName System.Drawing
$labDirectory = Join-Path $PSScriptRoot 'lab'
foreach ($mode in @('desktop', 'mobile', 'reduced')) {
  $shotDirectory = Join-Path $labDirectory $mode
  $shots = Get-ChildItem -LiteralPath $shotDirectory -Filter '*.png' | Where-Object { $_.BaseName -match '^\d+$' } | Sort-Object Name
  if (!$shots) { continue }
  $first = [System.Drawing.Image]::FromFile($shots[0].FullName)
  $tileWidth = if ($mode -eq 'mobile') { 195 } else { 360 }
  $tileHeight = [int]($tileWidth * $first.Height / $first.Width)
  $first.Dispose()
  $columns = 5
  $rows = [int][Math]::Ceiling($shots.Count / $columns)
  $canvas = New-Object System.Drawing.Bitmap(($columns * $tileWidth), ($rows * ($tileHeight + 24)))
  $drawing = [System.Drawing.Graphics]::FromImage($canvas)
  $drawing.Clear([System.Drawing.Color]::White)
  $drawing.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $labelFont = New-Object System.Drawing.Font('Arial', 10)
  for ($index = 0; $index -lt $shots.Count; $index++) {
    $shot = [System.Drawing.Image]::FromFile($shots[$index].FullName)
    $tileX = ($index % $columns) * $tileWidth
    $tileY = [int][Math]::Floor($index / $columns) * ($tileHeight + 24)
    $drawing.DrawImage($shot, $tileX, ($tileY + 24), $tileWidth, $tileHeight)
    $drawing.DrawString("$mode $index", $labelFont, [System.Drawing.Brushes]::Black, $tileX, $tileY)
    $shot.Dispose()
  }
  $canvas.Save((Join-Path $shotDirectory 'sheet.png'), [System.Drawing.Imaging.ImageFormat]::Png)
  $labelFont.Dispose()
  $drawing.Dispose()
  $canvas.Dispose()
}
