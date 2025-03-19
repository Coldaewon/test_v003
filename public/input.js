let nameInput, messageInput, submitButton;
let logoImg;

function preload() {
    logoImg = loadImage("ATMOS_logo.png"); 
}

function setup() {
    createCanvas(1920, 1080);
    background(255); 
    

    textSize(60);
    fill(0); 
    textAlign(CENTER, CENTER);
    text("Re:spire(inspire)", width / 2, 150);
    

    textSize(32);
    text("방명록을 남겨주세요!", width / 2, 250);


    nameInput = createInput();
    nameInput.position(width / 2 - 150, 350);
    nameInput.size(300, 40);
    nameInput.style("font-size", "18px");
    nameInput.style("padding", "5px");

  
    messageInput = createInput();
    messageInput.position(width / 2 - 150, 420);
    messageInput.size(300, 40);
    messageInput.style("font-size", "18px");
    messageInput.style("padding", "5px");

   
    submitButton = createButton("전송");
    submitButton.position(width / 2 - 50, 500);
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
    background(255); 
    
    
    fill(0);
    textSize(60);
    text("Re:spire(inspire)", width / 2, 150);
    
    textSize(32);
    text("방명록을 남겨주세요!", width / 2, 250);

    
    image(logoImg, width / 2 - logoImg.width / 6, height - 150, logoImg.width / 3, logoImg.height / 3);
}

function sendMessage() {
    let name = nameInput.value();
    let message = messageInput.value();

    if (name && message) {
        const data = { name, message };
        console.log("메시지 전송:", data);

        
        socket.send(JSON.stringify(data));

        nameInput.value('');
        messageInput.value('');
    }
}
