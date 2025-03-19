let nameInput, messageInput, submitButton;
let logoImg;
let socket; // WebSocket 변수 추가

function preload() {
    logoImg = loadImage("assets/ATMOS_logo.png"); // 로고 이미지 로드
}

function setup() {
    createCanvas(1920, 1080);
    background(255); // 배경을 흰색으로 설정
    
    // WebSocket 서버 연결
    socket = new WebSocket("ws://localhost:8080");

    socket.addEventListener("open", () => {
        console.log("✅ WebSocket 연결 성공!");
    });

    socket.addEventListener("error", (error) => {
        console.error("❌ WebSocket 연결 오류:", error);
    });

    // 타이틀 텍스트
    textSize(60);
    fill(0);
    textAlign(CENTER, CENTER);
    text("Re:spire(inspire)", width / 2, 150);
    
    // 설명 문구 (입력창과 중앙에 맞추기)
    textSize(32);
    text("방명록을 남겨주세요!", width / 2, height / 2 - 150);

    // 입력창 (이름)
    nameInput = createInput();
    nameInput.position(width / 2 - 150, height / 2 - 80);
    nameInput.size(300, 40);
    nameInput.style("font-size", "18px");
    nameInput.style("padding", "5px");

    // 입력창 (메시지)
    messageInput = createInput();
    messageInput.position(width / 2 - 150, height / 2 - 20);
    messageInput.size(300, 40);
    messageInput.style("font-size", "18px");
    messageInput.style("padding", "5px");

    // 전송 버튼
    submitButton = createButton("전송");
    submitButton.position(width / 2 - 50, height / 2 + 50);
    submitButton.size(100, 50);
    submitButton.style("font-size", "20px");
    submitButton.style("background", "black");
    submitButton.style("color", "white");
    submitButton.style("border", "none");
    submitButton.style("cursor", "pointer");

    // 버튼 애니메이션 효과 추가
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
    background(255); // 흰 배경 유지
    
    // 텍스트 다시 그리기
    fill(0);
    textSize(60);
    text("Re:spire(inspire)", width / 2, 150);
    
    textSize(32);
    text("방명록을 남겨주세요!", width / 2, height / 2 - 150);

    // 로고 이미지가 로드되었을 때만 표시
    if (logoImg) {
        image(logoImg, width / 2 - logoImg.width / 6, height - 150, logoImg.width / 3, logoImg.height / 3);
    } else {
        textSize(20);
        text("로고 로드 중...", width / 2, height - 100);
    }
}

function sendMessage() {
    let name = nameInput.value();
    let message = messageInput.value();

    if (name && message) {
        const data = { name, message };
        console.log("📩 전송할 메시지:", data);

        // WebSocket 연결 상태 확인 후 전송
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
            console.log("✅ 메시지가 서버로 전송됨!");

            // 입력 필드 초기화
            nameInput.value('');
            messageInput.value('');
        } else {
            console.error("❌ WebSocket 연결이 닫혀 있음. 메시지를 보낼 수 없음.");
        }
    } else {
        console.warn("⚠️ 이름 또는 메시지가 입력되지 않음.");
    }
}
