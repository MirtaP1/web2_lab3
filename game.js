let canvas, context;
let loptica, palica, cigle;
let lopticaBrzinaX = 1.8, lopticaBrzinaY = -1.8;
let palicaBrzina = 5;
let score = 0;
let maxScore = 0;
let gameOver = false;
let ciglaRedovi = 4;
let ciglaStupci = 6;

function inicijalizacija() {
    canvas = document.getElementById("gameCanvas");
    context = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    loptica = { x: canvas.width / 2, y: canvas.height - 50, radius: 10 };
    palica = { width: 150, height: 20, x: canvas.width / 2 - 75, y: canvas.height - 40 };
    cigle = kreirajCigle();
    
    score = 0;
    maxScore = localStorage.getItem("maxScore") || 0;
    gameOver = false;

    requestAnimationFrame(igra);
}

function kreirajCigle() {
    const ciglaWidth = (canvas.width - (ciglaStupci - 1) * 10 - 2 * 10) / ciglaStupci;
    const ciglaHeight = 20;

    let cigle = [];
    for (let row = 0; row < ciglaRedovi; row++) {
        for (let col = 0; col < ciglaStupci; col++) {
            cigle.push({
                x: 10 + col * (ciglaWidth + 10),
                y: 40 + row * (ciglaHeight + 10),
                width: ciglaWidth,
                height: ciglaHeight 
            });
        }
    }
    return cigle;
}

function napraviIgru() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.arc(loptica.x, loptica.y, loptica.radius, 0, Math.PI * 2);
    context.fillStyle = "#F0E68C";
    context.fill();
    context.closePath();

    context.beginPath();
    context.rect(palica.x, palica.y, palica.width, palica.height);
    context.fillStyle = "#DDA0DD";
    context.fill();
    context.closePath();

    for (let i = 0; i < cigle.length; i++) {
        let cigla = cigle[i];
        context.beginPath();
        context.rect(cigla.x, cigla.y, cigla.width, cigla.height);
        context.fillStyle = "#1F75FE";
        context.fill();
        context.closePath();
    }

    context.font = "16px Arial";
    context.fillStyle = "#FFFFFF";
    context.fillText("Bodovi: " + score, 8, 20);
    context.fillText("Najbolji rezultat: " + maxScore, canvas.width - 200, 20);
}

function azurirajIgru() {
    if (gameOver) {
        return;
    }

    loptica.x += lopticaBrzinaX;
    loptica.y += lopticaBrzinaY;
    if (loptica.x + loptica.radius > canvas.width || loptica.x - loptica.radius < 0) {
        lopticaBrzinaX = -lopticaBrzinaX;
    }
    if (loptica.y - loptica.radius < 0) {
        lopticaBrzinaY = -lopticaBrzinaY;
    }
    if (loptica.y + loptica.radius > palica.y && loptica.x > palica.x && loptica.x < palica.x + palica.width) {
        lopticaBrzinaY = -lopticaBrzinaY;
    }
    for (let i = 0; i < cigle.length; i++) {
        let cigla = cigle[i];
        if (loptica.x > cigla.x && loptica.x < cigla.x + cigla.width && loptica.y - loptica.radius < cigla.y + cigla.height && loptica.y + loptica.radius > cigla.y) {
            cigle.splice(i, 1);
            lopticaBrzinaY = -lopticaBrzinaY;
            score++;
            break;
        }
    }

    if (loptica.y + loptica.radius > canvas.height) {
        gameOver = true;
        localStorage.setItem("maxScore", Math.max(score, maxScore));
    }
    if (cigle.length === 0) {
        gameOver = true;
        localStorage.setItem("maxScore", Math.max(score, maxScore));
    }
}

function pomakniPalica() {
    if (rightPressed && palica.x < canvas.width - palica.width) {
        palica.x += palicaBrzina;
    } else if (leftPressed && palica.x > 0) {
        palica.x -= palicaBrzina;
    }
}

function igra() {
    azurirajIgru();
    napraviIgru();

    if (gameOver) {
        context.font = "30px Arial";
        context.fillStyle = "#C6011F";
        if (cigle.length === 0) {
            context.fillText("POBJEDA", canvas.width / 2 - 90, canvas.height / 2);
        } else {
            context.fillText("GAME OVER", canvas.width / 2 - 90, canvas.height / 2);
        }
        return;
    }

    pomakniPalica();
    requestAnimationFrame(igra);
}

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "ArrowLeft") {
        leftPressed = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "ArrowLeft") {
        leftPressed = false;
    }
});

window.onload = inicijalizacija;
window.onresize = inicijalizacija;
