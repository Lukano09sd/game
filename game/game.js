const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Carregar imagens do jogador, obstáculo, projétil e fundo
const playerImage = new Image();
playerImage.src = 'player.png.png'; // Caminho da imagem do jogador

const obstacleImage = new Image();
obstacleImage.src = 'obstacle.png.png'; // Caminho da imagem do obstáculo

const backgroundImage = new Image();
backgroundImage.src = 'background.png'; // Caminho da imagem do fundo

const bulletImage = new Image();
bulletImage.src = 'bullet.png'; // Caminho da imagem do projétil

// Configuração do jogador
const player = {
    width: 50,
    height: 50,
    x: 50,
    y: canvas.height / 2 - 25,
    speed: 5,
    dx: 0, // Novo: Controle de movimento na direção x
    dy: 0, // Controle de movimento na direção y
    bulletSpeed: 7
};

// Configurações iniciais do jogo
const obstacles = [];
const bullets = []; // Array para armazenar os projéteis
let obstacleFrequency = 90;
let gameOver = false;
let score = 0;
let frames = 0;

// Função para criar obstáculos
function createObstacle() {
    const obstacle = {
        width: 50,
        height: 50,
        x: canvas.width,
        y: Math.random() * (canvas.height - 50),
        speed: 4
    };
    obstacles.push(obstacle);
}

// Função para criar projéteis
function createBullet() {
    const bullet = {
        x: player.x + player.width, // Inicia o projétil na posição da nave
        y: player.y + player.height / 2 - 5, // No meio vertical da nave
        width: 10,
        height: 5,
        speed: player.bulletSpeed
    };
    bullets.push(bullet);
}

// Atualizar obstáculos e verificar colisões
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= obs.speed;

        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            score++;
        }

        if (detectCollision(player, obs)) {
            gameOver = true;
        }
    }

    if (frames % obstacleFrequency === 0) {
        createObstacle();
    }
}

// Função para atualizar e desenhar projéteis
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.x += bullet.speed;

        if (bullet.x > canvas.width) {
            bullets.splice(i, 1); // Remove o projétil quando ele sair da tela
        }

        // Verificar colisões do projétil com obstáculos
        for (let j = obstacles.length - 1; j >= 0; j--) {
            const obs = obstacles[j];
            if (detectCollision(bullet, obs)) {
                obstacles.splice(j, 1); // Remove o obstáculo
                bullets.splice(i, 1); // Remove o projétil
                score += 10; // Aumenta a pontuação
                break; // Sai do loop de colisões
            }
        }
    }
}

// Função para detectar colisão entre dois retângulos
function detectCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Movimento do jogador
function movePlayer(event) {
    if (event.key === "ArrowUp") {
        player.dy = -player.speed;
    } else if (event.key === "ArrowDown") {
        player.dy = player.speed;
    } else if (event.key === "ArrowLeft") { // Movimento para a esquerda
        player.dx = -player.speed;
    } else if (event.key === "ArrowRight") { // Movimento para a direita
        player.dx = player.speed;
    } else if (event.key === " ") {
        createBullet(); // Dispara quando a barra de espaço é pressionada
    }
}

function stopPlayer(event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        player.dy = 0;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        player.dx = 0;
    }
}

// Desenhar fundo
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Desenhar jogador com imagem
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// Desenhar obstáculos com imagem
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Desenhar projéteis
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Mostrar pontuação
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Pontuação: " + score, 10, 30);
}

// Atualizar posição do jogador e limitar dentro do canvas
function updatePlayerPosition() {
    player.x += player.dx;
    player.y += player.dy;

    // Limitar movimento vertical dentro do canvas
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

    // Limitar movimento horizontal dentro do canvas
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Função principal do loop do jogo
function gameLoop() {
    if (gameOver) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
        ctx.fillText("Pontuação final: " + score, canvas.width / 2 - 80, canvas.height / 2 + 40);
        return;
    }

    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(); // Desenhar fundo
    drawPlayer();
    drawObstacles();
    drawBullets(); // Desenhar projéteis
    drawScore();
    updatePlayerPosition();
    updateObstacles();
    updateBullets(); // Atualizar e verificar projéteis

    requestAnimationFrame(gameLoop);
}

// Iniciar o jogo após o carregamento das imagens
let imagesLoaded = 0;

function startGame() {
    if (imagesLoaded === 4) { // Verifica se todas as imagens foram carregadas
        document.addEventListener("keydown", movePlayer);
        document.addEventListener("keyup", stopPlayer);
        gameLoop();
    }
}

playerImage.onload = () => {
    imagesLoaded++;
    startGame();
};

obstacleImage.onload = () => {
    imagesLoaded++;
    startGame();
};

backgroundImage.onload = () => {
    imagesLoaded++;
    startGame();
};

bulletImage.onload = () => {
    imagesLoaded++;
    startGame();
};
