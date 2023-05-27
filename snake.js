const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let direction = "right";
let snake = [{ x: 0, y: 0 }];
let food = { x: 5, y: 5 };
let score = 0;

function gameLoop() {
    // Move the snake
    const head = { x: snake[0].x, y: snake[0].y };
    switch (direction) {
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        case "right":
            head.x++;
            break;
    }
    snake.unshift(head);

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food.x = Math.floor(Math.random() * canvas.width / 10);
        food.y = Math.floor(Math.random() * canvas.height / 10);

        // Speed up the game slightly
        clearInterval(intervalId);
        intervalTime -= 5;
        intervalId = setInterval(gameLoop, intervalTime);

        // Update the score display
        document.getElementById("score").textContent = score;
    } else {
        snake.pop();
    }

    // Check for collision with walls or self
    if (head.x < 0) {
        head.x = canvas.width / 10 - 1;
    } else if (head.x >= canvas.width / 10) {
        head.x = 0;
    } else if (head.y < 0) {
        head.y = canvas.height / 10 - 1;
    } else if (head.y >= canvas.height / 10) {
        head.y = 0;
    } else if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(intervalId);
        window.alert("Game over! Your score is " + score);
    }
    
    // Update the last direction
    lastDirection = direction;

    // Draw the game board
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "green";
    snake.forEach(segment => ctx.fillRect(segment.x * 10, segment.y * 10, 10, 10));
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * 10, food.y * 10, 10, 10);
}

let intervalTime = 100;
let intervalId = setInterval(gameLoop, intervalTime);

let isPaused = false;

document.addEventListener("keydown", event => {
    if (event.key === " ") {
        if (isPaused) {
            intervalId = setInterval(gameLoop, intervalTime);
            isPaused = false;
            document.getElementById("pause-button").textContent = "Pause";
        } else {
            clearInterval(intervalId);
            isPaused = true;
            document.getElementById("pause-button").textContent = "Resume";
        }
        document.getElementById("pause-button").blur();
    }
});

document.getElementById("pause-button").addEventListener("click", () => {
    if (isPaused) {
        intervalId = setInterval(gameLoop, intervalTime);
        isPaused = false;
        document.getElementById("pause-button").textContent = "Pause";
    } else {
        clearInterval(intervalId);
        isPaused = true;
        document.getElementById("pause-button").textContent = "Resume";
    }
});

//
// Set up the touch controls
let touchStartX = null;
let touchStartY = null;

document.addEventListener("touchstart", event => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener("touchmove", event => {
    if (touchStartX === null || touchStartY === null) {
        return;
    }

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;
    const touchDiffX = touchEndX - touchStartX;
    const touchDiffY = touchEndY - touchStartY;

    if (Math.abs(touchDiffX) > Math.abs(touchDiffY)) {
        if (touchDiffX > 0 && lastDirection !== "left") {
            direction = "right";
        } else if (touchDiffX < 0 && lastDirection !== "right") {
            direction = "left";
        }
    } else {
        if (touchDiffY < 0 && lastDirection !== "down") {
            direction = "up";
        } else if (touchDiffY > 0 && lastDirection !== "up") {
            direction = "down";
        }
    }

    touchStartX = null;
    touchStartY = null;
});

//
// Set up the keyboard controls
document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
            if (lastDirection !== "down") {
                direction = "up";
            }
            break;
        case "ArrowDown":
            if (lastDirection !== "up") {
                direction = "down";
            }
            break;
        case "ArrowLeft":
            if (lastDirection !== "right") {
                direction = "left";
            }
            break;
        case "ArrowRight":
            if (lastDirection !== "left") {
                direction = "right";
            }
            break;
    }
});
