let messages = [];
let fadeValues = [];
let scaleValues = [];
const maxMessages = 8;
let fadeSpeed = 2;
let baseAlpha = 180;
let clearing = false;
let socket;

function setup() {
    createCanvas(1920, 1080);
    background(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    
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
    fadeValues.push(0); 
    scaleValues.push(0.8); 
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
            scaleValues = [];
            clearing = false;
            background(0);
            console.log("🧹 화면이 초기화되었습니다.");
        }
    }, 100);
}

function draw() {
    background(0, 50); 

    for (let i = 0; i < messages.length; i++) {
        
        fadeValues[i] = min(fadeValues[i] + fadeSpeed, 255);

        
        let breathEffect = sin(frameCount * 0.02) * 0.05; 
        scaleValues[i] = min(scaleValues[i] + 0.02, 1) + breathEffect;

        fill(255, fadeValues[i]);
        push();
        translate(width / 2, 100 + i * 80); 
        scale(scaleValues[i]); 
        text(messages[i], 0, 0);
        pop();
    }
}
