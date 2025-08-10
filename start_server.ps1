# Simple HTTP Server using PowerShell
$port = 8000
$root = Get-Location

Write-Host "Starting HTTP server on port $port" -ForegroundColor Green
Write-Host "Root directory: $root" -ForegroundColor Yellow
Write-Host "Open browser and go to: http://localhost:$port" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop server" -ForegroundColor Red

try {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        $filePath = Join-Path $root $localPath.TrimStart('/')
        
        Write-Host "Request: $localPath" -ForegroundColor White
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = Get-Content $filePath -Raw -Encoding UTF8
            $extension = [System.IO.Path]::GetExtension($filePath)
            
            # Set content type based on file extension
            switch ($extension) {
                '.html' { $contentType = 'text/html' }
                '.js' { $contentType = 'application/javascript' }
                '.css' { $contentType = 'text/css' }
                '.md' { $contentType = 'text/plain' }
                '.txt' { $contentType = 'text/plain' }
                default { $contentType = 'application/octet-stream' }
            }
            
            $response.ContentType = $contentType
            $response.StatusCode = 200
            
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        } else {
            $response.StatusCode = 404
            $notFound = "File not found: $localPath"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($notFound)
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        
        $response.Close()
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
} finally {
    if ($listener) {
        $listener.Stop()
    }
}
