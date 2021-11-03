const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;
const scoreEl = document.querySelector("#scoreEl");
const startGameBtn = document.querySelector("#startGameBtn");
const modalEl = document.querySelector("#modalEl");
const bigScoreEl = document.querySelector("#bigScoreEl");
const livesEl = document.querySelector("#livesEl");
const levelEl = document.querySelector("#levelEl");

const keys = [];
let enemies = [];
let passengers = [];

let level = 0;
function init() {
    enemies = [];
    clearInterval(enemyClearId);
    passengers = [];
    clearInterval(passClearId);
    score = 0;
    scoreEl.innerHTML = score;
    bigScoreEl.innerHTML = score;
    spee = 5;
    lives = 3;
    livesEl.innerHTML = lives;
    level += 1;
    levelEl.innerHTML = level;
    multiplier += .05;

}

const player = {
    x: 200,
    y: 200,
    width: 48,
    height: 48,
    frameX: 0,
    frameY: 0,
    speed: 15,
    moving: false
};
const playerSprite = new Image();
playerSprite.src = "angel.png";

let enem;

class enemy {
    constructor(speed) {
        this.imag = "ryuk.png";
        this.x = 800;
        this.y = Math.random() * 300 + 100;
        this.frameX = 0;
        this.speed = speed;
    }

    draw() {
        enem = new Image();
        enem.src = "ryuk.png";
        ctx.drawImage(enem, this.frameX * player.width, 65, 48, 64, this.x, this.y, 48, 64);
    }

    handleFrame() {
        if(this.frameX < 3) {
            this.frameX++;
        }
        else {
            this.frameX = 0;
        }
    }

    update() {
        this.draw();
        this.handleFrame();
        this.x -= this.speed;
    }
}
let pass;
class passenger {
    constructor() {
        this.x = Math.random() * 100 + 10;
        this.y = canvas.height;
        this.frameX = 0;
        this.type = Math.random();
    }

    draw() {
        pass = new Image();
        if(this.type > .66) {
            pass.src = "mulan.png";
        }
        else if(this.type > .33) {
            pass.src = "jasmine.png";
        }
        else {
            pass.src = "korea.png";
        }
        ctx.drawImage(pass, this.frameX * 32, 3 * 48, 32, 48, this.x, this.y, 32, 48);
    }

    handlePFrame() {
        if(this.frameX < 3) {
            this.frameX++;
        }
        else {
            this.frameX = 0;
        }
    }

    update() {
        this.handlePFrame();
        this.draw();
        this.y -= 5;
    }
}

let spee = 5;
let multiplier = 1.01;
let passClearId;
function spawnPassengers() {
    passClearId = setInterval(() => {
        passengers.push(new passenger());
    },1000)
}

let enemyClearId;
function spawnEnemies() {
    enemyClearId = setInterval(() => {
        enemies.push(new enemy(spee));
        spee *= multiplier;
    },1800)
}


const background = new Image();
background.src = "background.png";

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

addEventListener("keydown", function(e) {
    keys[e.key] = true;
    player.moving = true;
});

addEventListener("keyup", function(e) {
    delete keys[e.key];
    player.moving = false;
});

function movePlayer() {
    if(keys["ArrowUp"] && player.y > 100) {
        player.y -= player.speed;
        player.frameY = 3;
        player.moving = true;
    }
    if(keys["ArrowDown"] && player.y < canvas.height - player.height) {
        player.y += player.speed;
        player.frameY = 0;
        player.moving = true;
    }
    if(keys["ArrowRight"] && player.x < canvas.width - player.width) {
        player.x += player.speed;
        player.frameY = 2;
        player.moving = true;
    }
    if(keys["ArrowLeft"] && player.x > 0 + player.width) {
        player.x -= player.speed;
        player.frameY = 1;
        player.moving = true;
    }
}

function handlePlayerFrame() {
    if(player.frameX < 3 && player.moving) {
        player.frameX++;
    }
    else {
        player.frameX = 0;
    }
}

let fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    animate();
}

let score = 0;
let lives = 3;
let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if(elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0,0,canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        drawSprite(playerSprite, player.frameX * player.width, player.frameY * player.height, player.width, player.height,
        player.x, player.y, player.width, player.height);
        enemies.forEach((enemy, index) => {
            enemy.update();
            if((Math.abs(enemy.x - player.x) < 20 && Math.abs(enemy.y - player.y) <20) || enemy.x + 48 < 0) {
                setTimeout(() => {
                    enemies.splice(index,1);
                }, 0)
            }
        })
        passengers.forEach((passenger, Pindex) => {
            passenger.update();
            if(passenger.y < 100) {
                setTimeout(() => {
                    passengers.splice(Pindex,1);
                }, 0)
                score += 1;
                scoreEl.innerHTML = score;
            }
            enemies.forEach((enemy) => {
                if(Math.abs(passenger.x - enemy.x) < 30 && Math.abs(passenger.y - enemy.y) < 30) {
                    setTimeout(() => {
                        passengers.splice(Pindex,1);
                    }, 0)
                    lives -= 1;
                    livesEl.innerHTML = lives;
                    if(lives == 0) {
                        bigScoreEl.innerHTML = score;
                        cancelAnimationFrame(animationId);
                        modalEl.style.display = "flex";
                    }
                }
            })
        })  
        movePlayer();
        handlePlayerFrame();
    }
}

startGameBtn.addEventListener("click", () => {
    init();
    spawnEnemies();
    spawnPassengers();
    startAnimating(10);
    modalEl.style.display = "none";
})