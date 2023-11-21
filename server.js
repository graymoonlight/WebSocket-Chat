const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname + '/views'));

app.get("/", function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        if (typeof data === 'string') {
            console.log(data);
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        } else if (data instanceof Buffer) {
            const content = data.toString('utf-8');
            console.log(content);
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(content);
                }
            });
        }
    });
});

server.listen(port, () => console.log(`Сервер запущен на ${port} хосте!`));
