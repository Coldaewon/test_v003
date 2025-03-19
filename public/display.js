let messages = []; // 저장된 메시지 목록
let fadeValues = []; // 메시지별 투명도(alpha) 값
const maxMessages = 8; // 최대 표시할 메시지 개수
let fadeSpeed = 2; // 페이드 속도
let baseAlpha = 180; // 기본 alpha 값 (완전히 사라지지 않도록 설정)
let clearing = false; // 전체 리셋 상태 여부
let socket;

function setup() {
    createCanvas(600, 400);
    background(0);
    textSize(18);
    fill(255);
    textAlign(LEFT, TOP);
    
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

// 긴 메시지를 자동으로 줄바꿈하는 함수
function wrapText(txt, maxWidth) {
    let words = txt.split(" ");
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let testLine = currentLine + " " + words[i];
        let testWidth = textWidth(testLine);
        
        if (testWidth < maxWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }
    lines.push(currentLine);
    return lines;
}

function draw() {
    background(0, 50); // 배경을 약간 투명하게 하여 부드러운 효과 유지

    for (let i = 0; i < messages.length; i++) {
        // 페이드 인 효과
        fadeValues[i] = min(fadeValues[i] + fadeSpeed, 255);

        // 호흡 효과: sin()을 이용해 밝기가 부드럽게 변하도록 설정
        let breathEffect = baseAlpha + sin(frameCount * 0.05) * 50;

        fill(255, min(fadeValues[i], breathEffect)); // alpha 값 조절
        
        // 자동 줄바꿈 적용
        let lines = wrapText(messages[i], width - 40);
        for (let j = 0; j < lines.length; j++) {
            text(lines[j], 20, 40 + i * 40 + j * 20);
        }
    }
}
