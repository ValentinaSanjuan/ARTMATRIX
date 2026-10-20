# Crea copias reducidas de algunas imagenes de ImagenesArtMatrix para revisarlas.
Add-Type -AssemblyName System.Drawing
$origen  = Join-Path $env:USERPROFILE 'Desktop\ImagenesArtMatrix'
$destino = Join-Path $PSScriptRoot '..\tmp-imagenes'
New-Item -ItemType Directory -Force -Path $destino | Out-Null
foreach ($n in @('curi.jpg','pinturas1.jpg','elementsgrid1.png','fondo1.jpg','fondo3.jpg','botones.jpg','flechas.jpg','cartelInicio.jpg','pinturas.png')) {
  $ruta = Join-Path $origen $n
  if (-not (Test-Path $ruta)) { continue }
  $img = [System.Drawing.Image]::FromFile($ruta)
  $ancho = [Math]::Min(1400, $img.Width)
  $alto = [int]($img.Height * $ancho / $img.Width)
  $bmp = New-Object System.Drawing.Bitmap $ancho, $alto
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.DrawImage($img, 0, 0, $ancho, $alto)
  $salida = Join-Path $destino ([IO.Path]::GetFileNameWithoutExtension($n) + '.png')
  $bmp.Save($salida, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
  Write-Host "OK $n"
}
