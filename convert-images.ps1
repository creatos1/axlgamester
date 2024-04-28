# Ruta del directorio de imágenes
$IMAGES_DIR = "src\assets\img"

# Obtener la lista de archivos de imagen en el directorio
$imageFiles = Get-ChildItem -Path $IMAGES_DIR -File | Where-Object { $_.Extension -match "\.(jpg|jpeg|png)$" }

# Iterar sobre cada archivo de imagen y convertirlo a WebP
foreach ($file in $imageFiles) {
    $outputFile = "$IMAGES_DIR\$($file.BaseName).webp"
    magick convert "$($file.FullName)" "$outputFile"
}

Write-Host "Conversión completa."
