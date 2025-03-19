let nameInput, messageInput, submitButton;
let socket;

function setup() {
    createCanvas(400, 300);
    background(220);
    
    textSize(16);
    textAlign(CENTER);
    text("방명록을 남겨주세요!", width / 2, 30);
    
    nameInput = createInput();
    nameInput.position(100, 60);
    nameInput.size(200);
    nameInput.attribute("placeholder", "이름 입력");

    messageInput = createInput();
    messageInput.position(100, 100);
    messageInput.size(200);
    messageInput.attribute("placeholder", "메시지 입력");

    submitButton = createButton("등록");
    submitButton.position(160, 140);
    submitButton.mousePressed(sendMessage);

    socket = new WebSocket("ws://localhost:8080"); // WebSocket 서버 연결
}

function sendMessage() {
    const name = nameInput.value();
    const message = messageInput.value();

    if (name && message) {
        const data = { name, message };
        socket.send(JSON.stringify(data)); // 메시지 전송

        // 입력 필드 초기화
        nameInput.value('');
        messageInput.value('');
    }
}
