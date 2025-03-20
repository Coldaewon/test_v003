let nameInput, messageInput, submitButton;
let bgImg;
let socket;

function preload() {
    // ✅ 배경 이미지 파일이 `public/` 폴더에 있는지 확인 후 올바른 경로로 설정
    bgImg = loadImage("index.png", () => {
        console.log("✅ 배경 이미지 로드 성공!");
    }, () => {
        console.error("❌ 배경 이미지 로드 실패! 경로를 확인하세요.");
    });
}

function setup() {
    createCanvas(1920, 1080);
    background(255);

    // ✅ WebSocket 서버 연결
    socket = new WebSocket("ws://localhost:8080");

    socket.addEventListener("open", () => {
        console.log("✅ WebSocket 연결 성공!");
    });

    socket.addEventListener("message", (event) => {
        event.data.text().then((text) => {
            const data = JSON.parse(text);
            console.log("📩 받은 메시지:", data);
        }).catch((err) => {
            console.error("❌ JSON 변환 오류:", err);
        });
    });

    // ✅ 입력창 (이름)
    nameInput = createInput();
    nameInput.position(width / 2 - 150, height / 2 - 50);
    nameInput.size(300, 40);
    nameInput.style("font-size", "18px");
    nameInput.style("padding", "10px");
    nameInput.style("border", "2px solid black");
    nameInput.style("background", "rgba(255, 255, 255, 0.8)");
    nameInput.style("color", "black");

    // ✅ 입력창 (메시지)
    messageInput = createInput();
    messageInput.position(width / 2 - 150, height / 2 + 10);
    messageInput.size(300, 40);
    messageInput.style("font-size", "18px");
    messageInput.style("padding", "10px");
    messageInput.style("border", "2px solid black");
    messageInput.style("background", "rgba(255, 255, 255, 0.8)");
    messageInput.style("color", "black");

    // ✅ 전송 버튼
    submitButton = createButton("전송");
    submitButton.position(width / 2 - 50, height / 2 + 80);
    submitButton.size(100, 50);
    submitButton.style("font-size", "20px");
    submitButton.style("background", "black");
    submitButton.style("color", "white");
    submitButton.style("border", "none");
    submitButton.style("cursor", "pointer");

    submitButton.mouseOver(() => {
        submitButton.style("opacity", "0.7");
        submitButton.style("transform", "scale(1.05)");
    });

    submitButton.mouseOut(() => {
        submitButton.style("opacity", "1");
        submitButton.style("transform", "scale(1)");
    });

    submitButton.mousePressed(sendMessage);
}

function draw() {
    if (bgImg) {
        background(bgImg); // ✅ 배경이 정상적으로 로드되면 표시
    } else {
        background(255); // ✅ 이미지가 없을 경우 흰 배경 유지
        textSize(32);
        fill(0);
        textAlign(CENTER, CENTER);
        text("🔄 Loading...", width / 2, height / 2);
    }
}

function sendMessage() {
    let name = nameInput.value();
    let message = messageInput.value();

    if (name && message) {
        const data = { name, message };
        console.log("📩 전송할 메시지:", data);

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
            console.log("✅ 메시지가 서버로 전송됨!");
            nameInput.value('');
            messageInput.value('');
        } else {
            console.error("❌ WebSocket 연결이 닫혀 있음. 메시지를 보낼 수 없음.");
        }
    } else {
        console.warn("⚠️ 이름 또는 메시지가 입력되지 않음.");
    }
}
