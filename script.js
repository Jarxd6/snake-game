// === DOM ELEMENTS ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playButton = document.getElementById('playButton');
const restartButton = document.getElementById('restartButton');

// Modal Elements
const modal = document.getElementById('modalAlert');
const modalMessage = document.getElementById('modalMessage');
const modalClose = document.getElementById('modalClose');

// === GAME VARIABLES ===
const gridSize = 10;
let snake = [{ x: 160, y: 160 }, { x: 150, y: 160 }, { x: 140, y: 160 }];
let food = { x: 420, y: 220 };
let direction = { x: gridSize, y: 0 };
let score = 0;
let highScore = 0;
let coins = 0;
let gameInterval;
let isGameOver = false;
let gameStarted = false;

// === SKIN SYSTEM ===
let snakeColor = localStorage.getItem('snakeColor') || 'green';

// === LOCAL STORAGE ===
function loadLocalData() {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    highScore = savedHighScore ? parseInt(savedHighScore) : 0;

    const savedCoins = localStorage.getItem('snakeCoins');
    coins = savedCoins ? parseInt(savedCoins) : 0;
}

function saveHighScore() {
    localStorage.setItem('snakeHighScore', highScore);
}

function saveCoins() {
    localStorage.setItem('snakeCoins', coins);
}

// === GAME FUNCTIONS ===
function startGame() {
    snake = [{ x: 160, y: 160 }, { x: 150, y: 160 }, { x: 140, y: 160 }];
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
    direction = { x: gridSize, y: 0 };
    score = 0;
    isGameOver = false;
    gameStarted = true;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);

    playButton.disabled = true;
    restartButton.disabled = false;

    drawGame();
}

function endGame() {
    clearInterval(gameInterval);
    isGameOver = true;

    if (score > highScore) {
        highScore = score;
        saveHighScore();
    }

    // Add coins: 1 coin per 10 points
    const coinsEarned = Math.floor(score / 10);
    coins += coinsEarned;
    saveCoins();

    showModal(`Game Over! 🎮<br>Score: ${score}<br>Coins Earned: ${coinsEarned}<br>Total Coins: ${coins}`);

    restartButton.disabled = false;

    drawGame();
}

function detectCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function eatFood() {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        snake.push({}); // Add segment

        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
        };
    }
}

function gameLoop() {
    if (detectCollision()) {
        endGame();
        return;
    }

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    eatFood();

    if (!isGameOver) {
        snake.pop();
    }

    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = (index === 0) ? 'red' : snakeColor;
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Draw food
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw score, high score, coins
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
    ctx.fillText('High Score: ' + highScore, 10, 60);
    ctx.fillText('Coins: ' + coins, 10, 90);

    // Game over message (optional)
    if (isGameOver && !modal.classList.contains('show')) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 85, canvas.height / 2);
    } else if (!gameStarted) {
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText('Press Play to Start', canvas.width / 2 - 100, canvas.height / 2);
    }
}

// === CONTROL FUNCTIONS ===
function changeDirection(event) {
    if (isGameOver) return;

    if (event.key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    } else if (event.key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    } else if (event.key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    } else if (event.key === 'ArrowRight' && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
    }
}

// === MOBILE BUTTON CONTROLS ===
document.getElementById('arrowUp').addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: -gridSize };
});
document.getElementById('arrowDown').addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: gridSize };
});
document.getElementById('arrowLeft').addEventListener('click', () => {
    if (direction.x === 0) direction = { x: -gridSize, y: 0 };
});
document.getElementById('arrowRight').addEventListener('click', () => {
    if (direction.x === 0) direction = { x: gridSize, y: 0 };
});

// === MODAL ===
function showModal(message) {
    modalMessage.innerHTML = message;
    modal.style.display = 'block';
}

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

// === EVENT LISTENERS ===
window.addEventListener('keydown', changeDirection);

playButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// === INIT ===
loadLocalData();
drawGame();
