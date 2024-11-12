//deklaracija canvasa i konteksta, loptice palice i cigle, 
let canvas, ctx;
let loptica, palica, cigle;
//parametri igre, početna brzina i broj cigli 
let lopticaBrzinaX = 2, lopticaBrzinaY = -2;
let palicaBrzina = 5;
let ciglaRedovi = 3;
let ciglaStupci = 5;
//bodovi, max bodovi i kraj igre
let score = 0;
let maxScore = 0;
let gameOver = false;
//desna i lijeva strelica
let rightPressed = false;
let leftPressed = false;

//funkcija za postavljanje osnovnih dijelova igre 
function inicijalizacija() {
    //dohvaćanje canvasa i konteksta
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    
    //širina i visina canvasa prema veličini prozora
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //inicijaliziranje loptice, palice i cigli
    loptica = { x: canvas.width / 2, y: canvas.height - 50, radius: 10 };
    palica = { width: 150, height: 20, x: canvas.width / 2 - 75, y: canvas.height - 40 };
    cigle = kreirajCigle();
    
    //praćenje rezultata i kraja igre
    score = 0;
    maxScore = localStorage.getItem("maxScore") || 0;
    gameOver = false;

    //početak animacije
    requestAnimationFrame(igra);
}

//funkcija za kreiranje cigli
function kreirajCigle() {
    //određivanje veličine cigli
    const ciglaWidth = (canvas.width - (ciglaStupci - 1) * 10 - 2 * 10) / ciglaStupci;
    const ciglaHeight = 20;

    //stvaranje onoliko cigli koliko je definirano u konstantama 
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

//funkcija za kreiranje igre
function napraviIgru() {
    //čišćenje canvasa
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //kreiranje loptice bez sjenčanja ruba, žute boje 
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    ctx.beginPath();
    ctx.arc(loptica.x, loptica.y, loptica.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#F0E68C";
    ctx.fill();
    ctx.closePath();

    //kreiranje palice sa sjenčanjem ruba, crvene boje
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#AA0000";
    ctx.beginPath();
    ctx.rect(palica.x, palica.y, palica.width, palica.height);
    ctx.fillStyle = "#D2122E";
    ctx.fill();
    ctx.closePath();

    //kreiranje cikli sa sjenčanjem ruba, plave boje
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#3457D5";
    for (let i = 0; i < cigle.length; i++) {
        let cigla = cigle[i];
        ctx.beginPath();
        ctx.rect(cigla.x, cigla.y, cigla.width, cigla.height);
        ctx.fillStyle = "#1F75FE";
        ctx.fill();
        ctx.closePath();
    }

    //prikaz broja bodova i max broja bodova u desnom gornjem kutu
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Bodovi: " + score, canvas.width - 250, 20);
    ctx.fillText("Najbolji rezultat: " + maxScore, canvas.width - 150, 20);
}

//funkcija za ažuriranje stanja igre 
function azurirajIgru() {
    //provjera ako je igra završila
    if (gameOver) {
        return;
    }
    //pomicanje loptice, provjere kolizije, provjera ako je igra završila
    pomakniLoptica();
    kolizijaCanvas();
    kolizijaPalica();
    kolizijaCigla();
    provjeriKraj();
}

//funkcija za pomicanje loptice
function pomakniLoptica() {
    loptica.x += lopticaBrzinaX;
    loptica.y += lopticaBrzinaY;
}

//funkcija za provjeru ako se dogodila kolizija s canvasom
function kolizijaCanvas() {
    if (loptica.x + loptica.radius > canvas.width || loptica.x - loptica.radius < 0) {
        lopticaBrzinaX = -lopticaBrzinaX;
    }
    if (loptica.y - loptica.radius < 0) {
        lopticaBrzinaY = -lopticaBrzinaY;
    }
}

//funkcija za provjeru ako se dogogila kolizija s palicom
function kolizijaPalica() {
    if (loptica.y + loptica.radius > palica.y &&
        loptica.x > palica.x &&
        loptica.x < palica.x + palica.width) {
        lopticaBrzinaY = -lopticaBrzinaY;
    }
}

//funkcija za provjeru ako se dogogila kolizija s ciglom
function kolizijaCigla() {
    for (let i = 0; i < cigle.length; i++) {
        let cigla = cigle[i];
        if (loptica.x > cigla.x &&
            loptica.x < cigla.x + cigla.width &&
            loptica.y - loptica.radius < cigla.y + cigla.height &&
            loptica.y + loptica.radius > cigla.y) {
            cigle.splice(i, 1);
            lopticaBrzinaY = -lopticaBrzinaY;
            score++;
            break;
        }
    }
}

//funkcija za provjeru ako je kraj igre i ispis odgovarajuće poruke u slučaju kraja igre
function provjeriKraj() {
    if (loptica.y + loptica.radius > canvas.height) {
        gameOver = true;
        localStorage.setItem("maxScore", Math.max(score, maxScore));
    }
    if (cigle.length === 0) {
        gameOver = true;
        localStorage.setItem("maxScore", Math.max(score, maxScore));
    }
}

//funkcija za pomicanje palice lijevo i desno
function pomakniPalica() {
    if (rightPressed && palica.x < canvas.width - palica.width) {
        palica.x += palicaBrzina;
    } else if (leftPressed && palica.x > 0) {
        palica.x -= palicaBrzina;
    }
}

//glavna funkcija za igru
function igra() {
    //ažuriraanje i kreiranje igre
    azurirajIgru();
    napraviIgru();

    //provjera ako je izga završila
    if (gameOver) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "#C6011F";
        if (cigle.length === 0) {
            ctx.fillText("POBJEDA", canvas.width / 2 - 90, canvas.height / 2);
        } else {
            ctx.fillText("GAME OVER", canvas.width / 2 - 90, canvas.height / 2);
        }
        return;
    }

    //micanje palice i početak animacije
    pomakniPalica();
    requestAnimationFrame(igra);
}

//event listener za pritisak tipke
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "ArrowLeft") {
        leftPressed = true;
    }
});

//event listener za puštanje tipke
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "ArrowLeft") {
        leftPressed = false;
    }
});

//pokretanje prilikom ponovnog pokretanja prozira ili promjene veličine prozora
window.onload = inicijalizacija;
window.onresize = inicijalizacija;
