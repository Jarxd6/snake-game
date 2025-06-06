const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 10;
let snake = [{ x: 160, y: 160 }, { x: 150, y: 160 }, { x: 140, y: 160 }];
let food = { x: 420, y: 220 };
let direction = { x: gridSize, y: 0 };
let score = 0;
let highScore = 0;
let gameInterval;
let isGameOver = false;
let gameStarted = false;

// Button elements
const playButton = document.getElementById('playButton');
const restartButton = document.getElementById('restartButton');

// Load high score from localStorage
function loadHighScore() {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    highScore = savedHighScore ? parseInt(savedHighScore) : 0;
}

// Save high score to localStorage
function saveHighScore() {
    localStorage.setItem('snakeHighScore', highScore);
}

function startGame() {
    snake = [{ x: 160, y: 160 }, { x: 150, y: 160 }, { x: 140, y: 160 }];
    food = { x: 420, y: 220 };
    direction = { x: gridSize, y: 0 };
    score = 0;
    isGameOver = false;
    gameStarted = true;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);

    // Update button states
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

    // Enable restart button
    restartButton.disabled = false;

    drawGame();
}

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

function detectCollision() {
    const head = snake[0];
    // Wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    // Self-collision
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
        snake.push({}); // Add new segment

        // Generate new food location
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

    // Draw the snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = (index === 0) ? 'red' : 'green';
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Draw the food
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw score and high score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
    ctx.fillText('High Score: ' + highScore, 10, 60);

    // Game Over message
    if (isGameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 85, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + score, canvas.width / 2 - 40, canvas.height / 2 + 30);
        ctx.fillText('High Score: ' + highScore, canvas.width / 2 - 55, canvas.height / 2 + 60);
    } else if (!gameStarted) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText(canvas.width / 2 - 120, canvas.height / 2);
    }
}

// Event listener for keyboard input
window.addEventListener('keydown', changeDirection);

// Button event listeners
playButton.addEventListener('click', () => {
    startGame();
});

restartButton.addEventListener('click', () => {
    startGame();
});

// Initialize the game
loadHighScore();
drawGame();
