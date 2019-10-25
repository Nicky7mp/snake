//VARIABLES//
const startButton = document.getElementById("start")
const resetButton = document.getElementById("reset")

const GAME_SPEED = 100;
//^^^^Setting Game speed^^^^
const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = 'white';
const SNAKE_COLOUR = "lightgreen";
const SNAKE_BORDER_COLOUR = "darkgreen";
const FOOD_COLOUR = 'red';
const FOOD_BORDER_COLOUR = 'darkred';
//^^^^^Setting Canvas, Food and Snake Colours^^^^^^
let snake = [
    {x: 150, y:150},
    {x: 140, y:150},
    {x: 130, y:150},
    {x: 120, y:150},
    {x: 110, y:150}
]
//^^^^Snake starting position on canvas^^^^
let score = 0;
let highScore = 0;
//^^^^Player Score^^^^
let changingDirection = false;
//^^^^Bug fix to prevent reversing when buttons pressed quickly^^^^
let foodX;
let foodY;
//^^^^Food Co-ordinates^^^^
let dx = 10;
let dy = 0;
//^^^^Horizontal Velocity (dx) & Vertical Velocity (dy)^^^^

const gameCanvas = document.getElementById("gameCanvas");
//^^^^Gets the canvas element^^^^
const ctx = gameCanvas.getContext("2d");
//^^^^Returns 2D drawing context^^^^

ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
ctx.strokeStyle = CANVAS_BORDER_COLOUR;

ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);


//CALLING FUNCTIONS TO START GAME//

startButton.addEventListener("click", () => {
    main();
    createFood();
    document.addEventListener("keydown", changeDirection);
})

//^^^^Start Game, generate 1st food & key press changes direction^^^^

// resetButton.addEventListener("click", () => {

// })


//FUNCTIONS//

function main() {
    if (didGameEnd()) return;

    setTimeout(function onTick() {
        changingDirection = false;
        clearCanvas();
        drawFood()
        advanceSnake();
        drawSnake();

        main();
    }, GAME_SPEED)
}
//^^^^Main function called repeatedly to move snake & generate food^^^^

function clearCanvas() {
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    ctx.strokeStyle = CANVAS_BORDER_COLOUR;

    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}
//^^^^Clears game area to prevent trail on snake^^^^

function drawFood() {
    ctx.fillStyle = FOOD_COLOUR;
    ctx.strokeStyle = FOOD_BORDER_COLOUR;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}
//^^^^Displays Food on Canvas^^^^

function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;
        highScore += 10;
        document.getElementById('score').innerHTML = score;
        document.getElementById('highScore').innerHTML = highScore;

        createFood();

    } else {
    snake.pop();
    }
}
//^^^^Moves Snake forward, creates new food if eaten & adds to score^^^^

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y)
        return true
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}
//^^^^Ends game when Snake touches wall or self^^^^^
//For loop starts from 4 because it is impossible for first 3 parts
//to touch AND didCollide would immediately evaluate to true if
//index was 0.

function randomTen(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}
//^^^^Generates random multpile of 10 for food generation^^^^

function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY
        if (foodIsOnSnake)
            createFood();
    });
}
//^^^^Creates Food and checks if it's the same position as Snake^^^^

function drawSnake(){
    snake.forEach(drawSnakePart)
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = SNAKE_COLOUR;
    ctx.strokeStyle = SNAKE_BORDER_COLOUR;

    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}
//^^^^Creates Snake on Canvas^^^^^

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;

    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}
//^^^^^Add Controls to Snake and prevents it from reversing^^^^

function saveHighScore() {
    if (score >= highScore) {
        highScore == score;
    }
}