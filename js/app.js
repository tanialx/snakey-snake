const snakeboard = document.getElementById("snakeboard");
const bgStatic = document.getElementById("bg_static");

const snakeboard_ctx = snakeboard.getContext("2d");
const bgStatic_ctx = bgStatic.getContext("2d");

let snake;

/*
 * pre-generate random foods ( 10 x fruits + 5 x donuts) on screen
 */
let foods = []
const fruitEatenCallback = c => snake.grow(c)
const donutEatenCallback = () => snake.gainWeight()
{
    for (let i = 0; i < 10; i++) {
        foods.push(new Fruit({ size: { min: 5, max: 25 }, type: 'fruit', callback: { eaten: fruitEatenCallback } }))
    }
    for (let i = 0; i < 5; i++) {
        foods.push(new Donut({ size: { min: 24, max: 24 }, type: 'donut', callback: { eaten: donutEatenCallback } }))
    }
}
/*
 * we don't want our generated items to be cropped off due to canvas boundaries
 * so we leave a margin of 25 px (the max size of food declared above)
 */
let generatedItemBox = {}

document.addEventListener("keydown", keyboardControl);

/**
 * When window resize, call init() to re-calculate different dimensions and re-render
 * objects on canvas
 * - foods' positions are re-generated
 * - snake's state is preserved
 * No need to take care of snake's position because if snake is outside of canvas
 * after window resized, it'll be automatically re-positioned by comebackIfSnakeGoOutsideCanvas() func
 * during gameLoop run
 */
window.addEventListener('resize', () => init());

init();

/**
 * this function is called at first-load to set up initial contents
 * it's also called every time window size is changed (e.g, user resizes browser)
 */
function init() {
    sizingGameBoards()
    if (!snake) {
        snake = new Snake({ initialPosition: { x: snakeboard.width / 4, y: snakeboard.height / 2 }, initialTileSize: 10 });
    }
    renderStaticBackground(bgStatic_ctx);
    // pre-generate food items
    foods.forEach(f => f.new(generatedItemBox));
    // render snake object for the first-time; it'll be updated during gameLoop
    snake.render(snakeboard_ctx);
}

/**
 * calculate dimensions for game contents
 */
function sizingGameBoards() {
    const vpRect = snakeboard.parentNode.getBoundingClientRect();
    const generatedItemMargin = 25;
    snakeboard.width = vpRect.width;
    snakeboard.height = vpRect.height;
    bgStatic.width = vpRect.width;
    bgStatic.height = vpRect.height;
    generatedItemBox = {
        x: {
            min: generatedItemMargin,
            max: snakeboard.width - generatedItemMargin
        },
        y: {
            min: generatedItemMargin,
            max: snakeboard.height - generatedItemMargin
        }
    };
}

/**
 * main game function:
 * run continuously to perform game logic at each movement
 * - make the snake move on screen
 * - generate new random foods after snake eats one
 */
function gameLoop() {
    setTimeout(function onTick() {
        /*
         * First, check game state
         * - Is it ended?
         * - Is it paused?
         */
        if (isGameEnded()) {
            alert('Game over');
            return;
        }
        if (snake.pause) {
            /*
            * there's no need to keep re-rendering activity frame(s) when there's no change
            * so 'return' here
            * this loop needs to be triggered explicitly in keyboardControl function
            * when game is requested to resume
            */
            return;
        }

        /* Move the snake one step in its current direction */
        snake.move();

        /* Check if any food is eaten due to previous one step taken */
        const foodEaten = snakeEating();

        /*
         * If one or more food is eaten (foods' positions can be duplicated, so the snake 
         * is be able to eat more than one food in a row):
         * - apply the effect it has on snake
         * - replace the food eaten with a newly one generated at a random position
         */
        foods.forEach(f => {
            if (foodEaten.includes(f)) {
                f.takeEffect();
                f.new(generatedItemBox);
            }
        });

        /* re-position snake at canvas margin if it has almost fully gone outside of canvas */
        comebackIfSnakeGoOutsideCanvas()

        /* render updates above on canvas */
        renderActivityFrame();

        /* re-run this process after a period of time (based-on snake's speed) */
        gameLoop();
    }, snake.speed)
}

/**
 * Render continuously updating activity frame(s)
 * 
 * DO NOT put static frame (which is rendered once or occasionally) here
 * without a condition check
 */
function renderActivityFrame() {
    snakeboard_ctx.clearRect(0, 0, snakeboard.width, snakeboard.height);
    foods.forEach(f => f.render(snakeboard_ctx));
    snake.render(snakeboard_ctx);
}

/**
 * check if any food in FOODS array is eaten by snake
 * @returns list of refs to items in FOODS array
 */
function snakeEating() {
    let foodEaten = [];
    foods.forEach(f => {
        if (eatingDistanceValid(snake, {
            x: f.x,
            y: f.y,
            size: f.size
        })) foodEaten.push(f);
    });
    return foodEaten;
}

/**
 * check if snake is able to eat the input food based on current positions of snake and food
 * rule:
 * snake can eat food if distance between the center of snake's head and the center of the food
 * is less than <snake head's radius + food's radius> (which means snake head and food
 * item is overlapped)
 * @param {*} snake
 * @param {*} food 
 * @returns true if snake can eat food, false otherwise
 */
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

/**
 * control snake using keyboard
 * - 4 arrow keys: move snake up/down/to-the-left/to-the-right
 * - SPACE_BAR: pause/resume game
 * @param {*} event 
 */
function keyboardControl(event) {
    const KEY_LEFT = 37;
    const KEY_UP = 38;
    const KEY_RIGHT = 39;
    const KEY_DOWN = 40;
    const KEY_SPACE = 32;

    const keyPressed = event.keyCode;

    /*
     * we are controlling the snake using our perspective (to move UP/DOWN/LEFT/RIGHT of screen)
     * but SNAKE object only understands 'turn-left' and 'turn-right', hence the requested direction
     * needs to be translated to snake's language first
     */
    if (isSnakeHeadVisible() && isSnakeNeckVisible()) {
        /*
         * only accept snake's movement keyboard request
         * if snake's head & neck are both visible on screen
         * in case snake goes outside of canvas boundaries and not yet fully come back
         */
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

    }

    /*
     * signal the snake that game pause/resume is requested so that it acts accordingly
     */
    if (keyPressed === KEY_SPACE) {
        snake.pauseOrResumeMoving();
        if (!snake.pause) {
            /*
             * gameLoop was stopped previously when game is paused
             * need to re-activate it
             */
            gameLoop();
        }
    }
}

function isGameEnded() {
    /**
     * @todo: (maybe) some game end condition here
     */
    return false
}

function isSnakeHeadVisible() {
    return isSnakeTileVisible(snake.head())
}

function isSnakeNeckVisible() {
    return isSnakeTileVisible(snake.neck())
}

function isSnakeTileVisible(tile) {
    return tile.x >= 0 && tile.x < snakeboard.width && tile.y >= 0 && tile.y < snakeboard.height
}

function noOfSnakeTilesOffCanvasFromHead() {
    let count = 0
    while (count < snake.length() && !isSnakeTileVisible(snake.snake_body[count])) count++
    return count
}

const SNAKE_OFF_CANVAS_DELAY_AFTER_FIRST_TURN = 4

let snakeOffCanvasDelayAfterFirstTurnCountDown = SNAKE_OFF_CANVAS_DELAY_AFTER_FIRST_TURN;

/**
 * Check if snake has gone outside of canvas and re-position the snake to come back to canvas if
 * a number of snake's tiles counted from head (*OFF_THRESHOLD*) has fully gone outside canvas
 * 
 * Snake comes back to canvas by making a U-turn: two consecutive turns with a delay in-between
 * (*SNAKE_OFF_CANVAS_DELAY_AFTER_FIRST_TURN*) so that snake doesn't come back at a position too close
 * from where it starts moving outside canvas
 */
function comebackIfSnakeGoOutsideCanvas() {
    const head = snake.head()
    const OFF_THRESHOLD = snake.length() < 10 ? snake.length() / 2 : 5

    if (noOfSnakeTilesOffCanvasFromHead() >= OFF_THRESHOLD) {

        if (snakeOffCanvasDelayAfterFirstTurnCountDown > 0) {
            snakeOffCanvasDelayAfterFirstTurnCountDown--
            return
        }

        const snakeTileSize = snake.snake_tile_size
        if (head.x < -snakeTileSize) { // outside of left wall
            if (snake.isMovingUp()) snake.turnRight()
            if (snake.isMovingDown()) snake.turnLeft()
            if (snake.isMovingLeft()) {
                if (head.y <= snakeboard.height / 2) {
                    snake.turnLeft()
                } else {
                    snake.turnRight()
                }
                snakeOffCanvasDelayAfterFirstTurnCountDown = SNAKE_OFF_CANVAS_DELAY_AFTER_FIRST_TURN
            }
            return
        }

        if (head.x > snakeboard.width) { // outside of right wall
            if (snake.isMovingUp()) snake.turnLeft()
            if (snake.isMovingDown()) snake.turnRight()
            if (snake.isMovingRight()) {
                if (head.y <= snakeboard.height / 2) {
                    snake.turnRight()
                } else {
                    snake.turnLeft()
                }
                snakeOffCanvasDelayAfterFirstTurnCountDown = SNAKE_OFF_CANVAS_DELAY_AFTER_FIRST_TURN
            }
            return
        }

        if (head.y < -snakeTileSize) { // outside of top wall
            if (snake.isMovingLeft()) snake.turnLeft()
            if (snake.isMovingRight()) snake.turnRight()
            if (snake.isMovingUp()) {
                if (head.x <= snakeboard.width / 2) {
                    snake.turnRight()
                } else {
                    snake.turnLeft()
                }
                snakeOffCanvasDelayAfterFirstTurnCountDown = SNAKE_OFF_CANVAS_DELAY_AFTER_FIRST_TURN
            }
            return
        }

        if (head.y > snakeboard.height) { // outside of bottom wall
            if (snake.isMovingLeft()) snake.turnRight()
            if (snake.isMovingRight()) snake.turnLeft()
            if (snake.isMovingDown()) {
                if (head.x <= snakeboard.width / 2) {
                    snake.turnLeft()
                } else {
                    snake.turnRight()
                }
                snakeOffCanvasDelayAfterFirstTurnCountDown = SNAKE_OFF_CANVAS_DELAY_AFTER_FIRST_TURN
            }
            return
        }
    }
}
