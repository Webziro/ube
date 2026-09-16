$host1 = 'ac-ieui5ey-shard-00-00.wps3hoi.mongodb.net'
$tcp = New-Object System.Net.Sockets.TcpClient
$tcp.Connect($host1, 27017)
$stream = $tcp.GetStream()
$ssl = New-Object System.Net.Security.SslStream($stream)
$ssl.AuthenticateAsClient($host1)
Write-Host ('TLS OK - Protocol: ' + $ssl.SslProtocol)
$ssl.Close()
$tcp.Close()
