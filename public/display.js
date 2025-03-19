let messages = [];
let socket;

function setup() {
    createCanvas(600, 400);
    background(0);

    textSize(20);
    fill(255);
    textAlign(LEFT);

    // WebSocket 서버 연결
    socket = new WebSocket("ws://localhost:8080");

    // WebSocket 연결 성공 시 로그 출력
    socket.addEventListener("open", () => {
        console.log("✅ WebSocket 연결 성공!");
    });

    // WebSocket으로 메시지를 받을 때 실행
    socket.addEventListener("message", (event) => {
        event.data.text().then((text) => {  // Blob → 텍스트 변환
            const data = JSON.parse(text);  // 텍스트 → JSON 변환
            console.log("📩 받은 메시지:", data);

            messages.push(`${data.name}: ${data.message}`);

            // 메시지 개수가 너무 많아지면 오래된 메시지 삭제
            if (messages.length > 10) {
                messages.shift();
            }

            redraw();  // 화면 다시 그리기
        }).catch((err) => {
            console.error("❌ JSON 변환 오류:", err);
        });
    });

    noLoop(); // 새로운 메시지가 들어올 때만 화면을 다시 그림
}

function draw() {
    background(0);

    for (let i = 0; i < messages.length; i++) {
        text(messages[i], 20, 40 + i * 30);
    }
}
