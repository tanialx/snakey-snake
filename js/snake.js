class Snake {

    #snake_body;

    constructor(props) {
        this.snake_tile_size = props.initialTileSize;
        this.snake_adult_tile_size = props.adultTileSize;
        this.snake_col = '#adc2eb';
        this.dx = 1;
        this.dy = 0;
        this.#snake_body = [
            {
                x: props.initialPosition.x,
                y: props.initialPosition.y,
                color: this.snake_col
            },
            {
                x: props.initialPosition.x - this.snake_tile_size,
                y: props.initialPosition.y,
                color: this.snake_col
            }
        ];
        this.snake_border = '#000000';
        this.snake_tile_corner_radius = 4;
        this.snake_eye_size = 2;
        this.snake_eye_color = "black";
        this.snake_tongue_size = 4;
        this.snake_tongue_color = "#c6538c";
        this.pause = true;
        this.speed = 70;
        this.weight_increment = .5
    }

    /**
     * The length of each move
     * @returns snake_tile_size
     */
    #step() {
        return this.snake_tile_size;
    }

    init() {
        this.render();
    }

    /**
     * Render snake on canvas
     * Steps:
     * 1. Render each tiles
     * 2. Render eyes and tongue
     * @param {*} canvas_ctx 
     */
    render(canvas_ctx) {
        this.#snake_body.forEach(tile => this.#renderSnakePart(tile, canvas_ctx));
        this.#renderSnakeEyesAndTongue(canvas_ctx);
    }

    /**
     * Render a single snake's tile on canvas
     * @param {*} snake_part snake's tile
     * @param {*} ctx canvas context
     */
    #renderSnakePart(snake_part, ctx) {
        drawRoundedSquare(ctx,
            snake_part.x, snake_part.y,
            this.snake_tile_size, this.snake_tile_size,
            this.snake_tile_corner_radius,
            snake_part.color, this.snake_border,
            2);
    }

    /**
     * Render snake's eyes and tongue on canvas
     * @param {*} canvas_ctx 
     */
    #renderSnakeEyesAndTongue(canvas_ctx) {
        const head = this.#snake_body[0];
        let eye_1 = {
            x: 0, y: 0
        }, eye_2 = {
            x: 0, y: 0
        };
        let tongue = {
            x1: 0, y1: 0,
            x2: 0, y2: 0,
            x3: 0, y3: 0
        }
        if (this.isMovingLeft()) {
            eye_1.x = head.x + this.snake_tile_size / 4;
            eye_2.x = eye_1.x;
            eye_1.y = head.y + this.snake_tile_size / 4;
            eye_2.y = head.y + this.snake_tile_size / 4 * 3;
            tongue.x1 = head.x;
            tongue.y1 = head.y + this.snake_tile_size / 2;
            tongue.x2 = tongue.x1 - this.snake_tongue_size;
            tongue.y2 = tongue.y1 - this.snake_tongue_size;
            tongue.x3 = tongue.x1 - this.snake_tongue_size;
            tongue.y3 = tongue.y1 + this.snake_tongue_size;
        } else if (this.isMovingRight()) {
            eye_1.x = head.x + this.snake_tile_size / 4 * 3;
            eye_2.x = eye_1.x;
            eye_1.y = head.y + this.snake_tile_size / 4;
            eye_2.y = head.y + this.snake_tile_size / 4 * 3;
            tongue.x1 = head.x + this.snake_tile_size;
            tongue.y1 = head.y + this.snake_tile_size / 2;
            tongue.x2 = tongue.x1 + this.snake_tongue_size;
            tongue.y2 = tongue.y1 + this.snake_tongue_size;
            tongue.x3 = tongue.x1 + this.snake_tongue_size;
            tongue.y3 = tongue.y1 - this.snake_tongue_size;
        } else if (this.isMovingUp()) {
            eye_1.y = head.y + this.snake_tile_size / 4;
            eye_2.y = eye_1.y;
            eye_1.x = head.x + this.snake_tile_size / 4;
            eye_2.x = head.x + this.snake_tile_size / 4 * 3;
            tongue.x1 = head.x + this.snake_tile_size / 2;
            tongue.y1 = head.y;
            tongue.x2 = tongue.x1 + this.snake_tongue_size;
            tongue.y2 = tongue.y1 - this.snake_tongue_size;
            tongue.x3 = tongue.x1 - this.snake_tongue_size;
            tongue.y3 = tongue.y1 - this.snake_tongue_size;
        } else {
            eye_1.y = head.y + this.snake_tile_size / 4 * 3;
            eye_2.y = eye_1.y;
            eye_1.x = head.x + this.snake_tile_size / 4;
            eye_2.x = head.x + this.snake_tile_size / 4 * 3;
            tongue.x1 = head.x + this.snake_tile_size / 2;
            tongue.y1 = head.y + this.snake_tile_size;
            tongue.x2 = tongue.x1 - this.snake_tongue_size;
            tongue.y2 = tongue.y1 + this.snake_tongue_size;
            tongue.x3 = tongue.x1 + this.snake_tongue_size;
            tongue.y3 = tongue.y1 + this.snake_tongue_size;
        }
        canvas_ctx.save();

        canvas_ctx.fillStyle = this.snake_eye_color;
        canvas_ctx.fillRect(eye_1.x, eye_1.y, this.snake_eye_size, this.snake_eye_size);
        canvas_ctx.fillRect(eye_2.x, eye_2.y, this.snake_eye_size, this.snake_eye_size);

        canvas_ctx.strokeStyle = this.snake_tongue_color;
        canvas_ctx.lineWidth = 1;
        canvas_ctx.beginPath();
        canvas_ctx.moveTo(tongue.x2, tongue.y2);
        canvas_ctx.lineTo(tongue.x1, tongue.y1);
        canvas_ctx.lineTo(tongue.x3, tongue.y3);
        canvas_ctx.stroke();

        canvas_ctx.restore();
    }

    /**
     * Re-calculate snake tiles' positions at each move while preserving the order of tiles' colors
     * @returns 
     */
    move() {
        if (this.pause) {
            return;
        }
        const head = { x: this.#snake_body[0].x + this.dx * this.#step(), y: this.#snake_body[0].y + this.dy * this.#step(), color: this.#snake_body[0].color };
        for (var i = 0; i < this.#snake_body.length - 1; i++) {
            this.#snake_body[i].color = this.#snake_body[i + 1].color;
        }
        this.#snake_body.unshift(head);
        this.#snake_body.pop();
    }

    /**
     * Reset head position for snake to come back to canvas
     */
    comeBackAt(x, y) {
        let head = this.head()
        head.x = x
        head.y = y
        // Stack other body's tiles together
        // They would be resolved in subsequent moves by move() function
        for (var i = 1; i < this.#snake_body.length - 1; i++) {
            this.#snake_body[i].x = x - this.dx * this.#step
            this.#snake_body[i].y = y - this.dy * this.#step
        }
    }

    pauseOrResumeMoving() {
        this.pause = !this.pause;
    }

    turnLeft() {
        this.#turnMult(1);
    }

    turnRight() {
        this.#turnMult(-1);
    }

    #turnMult(mult) {
        if (this.isMovingRight() || this.isMovingLeft()) {
            this.dy = this.dx * mult * -1;
            this.dx = 0;
            return;
        }
        if (this.isMovingUp() || this.isMovingDown()) {
            this.dx = this.dy * mult;
            this.dy = 0;
            return;
        }
    }

    isMovingLeft() {
        return this.dx === -1;
    }

    isMovingRight() {
        return this.dx === 1;
    }

    isMovingUp() {
        return this.dy === -1;
    }

    isMovingDown() {
        return this.dy === 1;
    }

    /**
     * Get snake's head tile
     * @returns the first tile in snake's body
     */
    head() {
        return this.#snake_body[0];
    }

    /**
     * Get snake's tail tile
     * @returns the last tile in snake's body
     */
    tail() {
        return this.#snake_body[this.#snake_body.length - 1]
    }

    /**
     * Get snake's neck tile
     * @returns the second tile in snake's body
     */
    neck() {
        return this.#snake_body[1];
    }

    /**
     * Add one more tile to snake's body with input color
     * also, increase snake's speed 
     * @param {*} nColor new tile's color
     * 
     * @todo consider handle 'grow' and 'speed change' separately
     */
    grow(nColor) {
        const head = { x: this.#snake_body[0].x + this.dx * this.#step(), y: this.#snake_body[0].y + this.dy * this.#step(), color: nColor };
        this.#snake_body.unshift(head);
        if (this.speed > 1) {
            this.speed -= 1;
        } else if (this.speed > 0.01) {
            this.speed -= 0.01;
        } else {
            // Keep constant speed 0.01
        }
    }

    /**
     * Re-calculate snake tiles' positions when snake gains weight
     * @returns 
     */
    #bodySizeIncrease() {
        const newSnakeBody = [snake.head()];
        let current_x = snake.head().x;
        let current_y = snake.head().y;
        for (let i = 1; i < this.#snake_body.length; i++) {
            const this_tile = {
                x: this.#snake_body[i].x,
                y: this.#snake_body[i].y,
                col: this.#snake_body[i].color
            }
            const prev_tile = {
                x: this.#snake_body[i - 1].x,
                y: this.#snake_body[i - 1].y
            }
            if (this_tile.x === prev_tile.x) {
                if (this_tile.y < prev_tile.y) {
                    current_y = prev_tile.y - this.snake_tile_size;
                } else {
                    current_y = prev_tile.y + this.snake_tile_size;
                }
            } else if (this_tile.y === prev_tile.y) {
                if (this_tile.x < prev_tile.x) {
                    current_x = prev_tile.x - this.snake_tile_size;
                } else {
                    current_x = prev_tile.x + this.snake_tile_size;
                }
            }
            newSnakeBody.push({
                x: current_x,
                y: current_y,
                color: this_tile.col
            })
        }
        return newSnakeBody;
    }

    /**
     * Signal that snake has gained some weight to re-calculate snake body accordingly
     */
    gainWeight() {
        /*
         * 1. Assign new value for snake_tile_size
         * 2. Re-calculate snake body tiles' positions based on the new tile size
         */
        this.snake_tile_size += this.weight_increment;
        this.#snake_body = this.#bodySizeIncrease();
        /*
         * after snake reaches a certain tile size (adult tile size), weight gain
         * slows down significantly to prevent the snake from getting too fat
         */
        if (this.snake_tile_size >= this.snake_adult_tile_size) {
            this.weight_increment = .01
        }
    }
}