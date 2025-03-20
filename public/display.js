let messages = [];
let fadeValues = [];
const maxMessages = 8;
let fadeSpeed = 2;
let baseAlpha = 200; // ✅ 최소 밝기를 200으로 설정해 글자가 너무 흐려지지 않도록 함
let clearing = false;
let socket;
let delayFrames = 180; // ✅ 3초(180프레임) 동안 완전히 숨김 상태 유지

function setup() {
    createCanvas(1920, 1080);
    background(0);
    textSize(32);
    textAlign(LEFT, CENTER); // ✅ 왼쪽 정렬 적용
    fill(255);
    
    socket = new WebSocket("ws://localhost:8080");

    socket.addEventListener("open", () => {
        console.log("✅ WebSocket 연결 성공!");
    });

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

    loop();
}

function addMessage(newMessage) {
    console.log(`➕ 메시지 추가: ${newMessage}`);

    if (messages.length >= maxMessages) {
        console.log("🧹 메시지가 꽉 찼습니다. 화면 초기화 시작!");
        startClearingScreen();
        return;
    }

    messages.push(newMessage);
    fadeValues.push(0); // ✅ 처음에는 완전히 안 보이게 설정
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
            messages = [];
            fadeValues = [];
            clearing = false;
            background(0);
            console.log("🧹 화면이 초기화되었습니다.");
        }
    }, 100);
}

function draw() {
    background(0); // 검은 배경 유지

    if (delayFrames > 0) {
        delayFrames--; // ✅ 처음 3초 동안 아무것도 안 보이게 함
        return;
    }

    for (let i = 0; i < messages.length; i++) {
        // ✅ 처음에는 3초(180프레임) 동안 완전히 숨김 → 이후 서서히 나타남
        if (fadeValues[i] < 255) {
            fadeValues[i] += fadeSpeed;
        }

        // ✅ 텍스트가 완전히 선명하게 보인 후, 200~255 사이에서 호흡 효과 적용
        let breathOpacity = baseAlpha + sin(frameCount * 0.02) * 25;
        fill(255, min(fadeValues[i], breathOpacity));

        // ✅ 왼쪽 상단부터 텍스트가 써지도록 위치 조정 (x = 50, y는 줄 간격 50씩)
        text(messages[i], 50, 50 + i * 50);
    }
}
