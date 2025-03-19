let messages = []; // 저장된 메시지 목록
let fadeValues = []; // 메시지별 투명도(alpha) 값
const maxMessages = 8; // 최대 표시할 메시지 개수
let fadeSpeed = 5; // 페이드 속도 증가
let clearing = false; // 전체 리셋 상태 여부
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

    // 메시지 수신
    socket.addEventListener("message", (event) => {
        event.data.text().then((text) => {  
            const data = JSON.parse(text);
            console.log("📩 받은 메시지:", data);

            if (!clearing) {
                addMessage(`${data.name}: ${data.message}`);
            }
        }).catch((err) => {
            console.error("❌ JSON 변환 오류:", err);
        });
    });

    loop(); // 계속 업데이트되도록 설정
}

function addMessage(newMessage) {
    console.log(`➕ 메시지 추가: ${newMessage}`);

    if (messages.length >= maxMessages) {
        console.log("🧹 메시지가 꽉 찼습니다. 화면 초기화 시작!");
        startClearingScreen(); // 메시지가 꽉 차면 리셋
        return;
    }

    messages.push(newMessage);
    fadeValues.push(0); // 처음에는 투명한 상태에서 시작
}

function startClearingScreen() {
    clearing = true;
    let fadeOutInterval = setInterval(() => {
        for (let i = 0; i < fadeValues.length; i++) {
            fadeValues[i] -= fadeSpeed;
        }
        redraw();

        if (fadeValues.every(f => f <= 0)) {
            clearInterval(fadeOutInterval);
            messages = []; // 모든 메시지 삭제
            fadeValues = [];
            clearing = false;
            background(0);
            console.log("🧹 화면이 초기화되었습니다.");
        }
    }, 100);
}

function draw() {
    background(0, 50); // 배경을 살짝 투명하게 해서 흐려지는 느낌 추가

    for (let i = 0; i < messages.length; i++) {
        fadeValues[i] = min(fadeValues[i] + fadeSpeed, 255); // 페이드 인 효과
        fill(255, fadeValues[i]); // alpha 값 조절
        text(messages[i], 20, 40 + i * 30);
    }
}
