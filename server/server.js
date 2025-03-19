const fs = require("fs");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
    console.log("✅ 클라이언트가 연결되었습니다!");

    ws.on("message", (message) => {
        console.log("📩 받은 메시지:", message);  // 🔴 콘솔에 메시지 출력

        // 모든 클라이언트(B화면)에게 메시지 전송
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

console.log("✅ WebSocket 서버가 8080번 포트에서 실행 중!");
