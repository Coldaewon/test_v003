let messages = [];
let socket;

function setup() {
    createCanvas(600, 400);
    background(0);
    
    textSize(20);
    fill(255);
    textAlign(LEFT);
    
    socket = new WebSocket("ws://localhost:8080");
    
    socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        messages.push(`${data.name}: ${data.message}`);
        
        // 메시지 목록이 너무 길어지면 오래된 메시지 삭제
        if (messages.length > 10) {
            messages.shift();
        }

        redraw(); // 새로운 메시지가 들어올 때마다 화면 갱신
    });

    noLoop(); // 새로운 메시지가 올 때만 화면 업데이트
}

function draw() {
    background(0);
    
    for (let i = 0; i < messages.length; i++) {
        text(messages[i], 20, 40 + i * 30);
    }
}
