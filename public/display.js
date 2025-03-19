let messages = [];
let fadeValues = []; 
const maxMessages = 20; 
let fadeSpeed = 2; 
let baseAlpha = 180; 
let clearing = false;
let socket;

function setup() {
    createCanvas(1080, 1920);
    background(0);
    textSize(18);
    fill(255);
    textAlign(LEFT, TOP);
    

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
    background(0, 50); 

    for (let i = 0; i < messages.length; i++) {
     
        fadeValues[i] = min(fadeValues[i] + fadeSpeed, 255);

      
        let breathEffect = baseAlpha + sin(frameCount * 0.05) * 50;

        fill(255, min(fadeValues[i], breathEffect)); 
        
        
        let lines = wrapText(messages[i], width - 40);
        for (let j = 0; j < lines.length; j++) {
            text(lines[j], 20, 40 + i * 40 + j * 20);
        }
    }
}
