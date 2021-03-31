const snakeboard = document.getElementById("snakeboard");
const vpRect = snakeboard.parentNode.getBoundingClientRect();
const bgStatic = document.getElementById("bg_static");
snakeboard.width = vpRect.width;
snakeboard.height = vpRect.height;
bgStatic.width = vpRect.width;
bgStatic.height = vpRect.height;

const snakeboard_ctx = snakeboard.getContext("2d");
const bgStatic_ctx = bgStatic.getContext("2d");

const middle_y = snakeboard.height / 2;

let snake = new Snake({ x: 240, y: middle_y }, 10, 20);

let foods = [new Fruit({
    size: {
        min: 5,
        max: 25
    },
    type: 'fruit',
    callback: {
        eaten: c => snake.grow(c)
    }
}), new Donut({
    size: {
        min: 24,
        max: 24
    },
    type: 'donut',
    callback: {
        eaten: c => snake.gainWeight()
    }
})];

const generatedItemMargin = 40;
const generatedItemBox = {
    x: {
        min: generatedItemMargin,
        max: snakeboard.width - generatedItemMargin
    },
    y: {
        min: generatedItemMargin,
        max: snakeboard.height - generatedItemMargin
    }
};

document.addEventListener("keydown", keyboardControl);

init();

function init() {
    renderStaticBackground(bgStatic_ctx);
    foods.forEach(f => f.new(generatedItemBox));
    snake.render(snakeboard_ctx);
}

function gameLoop() {
    setTimeout(function onTick() {
        if (isGameEnded()) {
            alert('Game over');
            return;
        }
        if (snake.pause) {
            return;
        }
        snake.move();
        const foodEaten = snakeEating();
        foods.forEach(f => {
            if (foodEaten.includes(f.type)) {
                f.takeEffect();
                f.new(generatedItemBox);
            }
        });
        renderActivityFrame();
        gameLoop();
    }, snake.speed)
}

function renderActivityFrame() {
    snakeboard_ctx.clearRect(0, 0, snakeboard.width, snakeboard.height);
    foods.forEach(f => f.render(snakeboard_ctx));
    snake.render(snakeboard_ctx);
}

function snakeEating() {
    var foodEaten = [];
    foods.forEach(f => {
        if (eatingDistanceValid(snake, {
            x: f.x,
            y: f.y,
            size: f.size
        })) foodEaten.push(f.type);
    });
    return foodEaten;
}

function eatingDistanceValid(snake, food) {
    const snakeHead = snake.head();
    const snakeHeadCenter = {
        x: snakeHead.x + snake.snake_tile_size / 2,
        y: snakeHead.y + snake.snake_tile_size / 2
    }
    const x_distance = snakeHeadCenter.x - food.x;
    const y_distance = snakeHeadCenter.y - food.y;
    const distance = x_distance * x_distance + y_distance * y_distance;
    const eatingDistance = (snake.snake_tile_size + food.size) / 2;
    if (distance < eatingDistance * eatingDistance) {
        return true;
    }
    return false;
}

function keyboardControl(event) {
    const KEY_LEFT = 37;
    const KEY_UP = 38;
    const KEY_RIGHT = 39;
    const KEY_DOWN = 40;
    const KEY_SPACE = 32;

    const keyPressed = event.keyCode;

    if (keyPressed === KEY_LEFT) {
        if (snake.isMovingUp()) snake.turnLeft();
        if (snake.isMovingDown()) snake.turnRight();
    }
    if (keyPressed === KEY_RIGHT) {
        if (snake.isMovingUp()) snake.turnRight();
        if (snake.isMovingDown()) snake.turnLeft();
    }
    if (keyPressed === KEY_UP) {
        if (snake.isMovingLeft()) snake.turnRight();
        if (snake.isMovingRight()) snake.turnLeft();
    }
    if (keyPressed === KEY_DOWN) {
        if (snake.isMovingLeft()) snake.turnLeft();
        if (snake.isMovingRight()) snake.turnRight();
    }
    if (keyPressed === KEY_SPACE) {
        snake.pauseOrResumeMoving();
        if (!snake.pause) {
            gameLoop();
        }
    }
}

function isGameEnded() {
    if (snake.isCollide()) {
        return true;
    }
    const hitLeftWall = snake.head().x < 0;
    const hitRightWall = snake.head().x > snakeboard.width - 10;
    const hitTopWall = snake.head().y < 0;
    const hitBottomWall = snake.head().y > snakeboard.height - 10;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}
