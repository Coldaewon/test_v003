const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        // 모든 클라이언트(B화면)에게 메시지 전송
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

console.log("✅ WebSocket 서버가 8080번 포트에서 실행 중!");
