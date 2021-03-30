class Snake {

    constructor(snakeboard_ctx, initialPosition, initialTileSize, maxTileSize) {
        this.snake_tile_size = initialTileSize;
        this.snake_max_tile_size = maxTileSize;
        this.snake_col = '#adc2eb';
        this.step = initialTileSize;
        this.dx = 1;
        this.dy = 0;
        this.snake_body = [
            {
                x: initialPosition.x,
                y: initialPosition.y,
                color: this.snake_col
            },
            {
                x: initialPosition.x - this.snake_tile_size,
                y: initialPosition.y,
                color: this.snake_col
            }
        ];
        this.snake_border = '#000000';
        this.snake_tile_corner_radius = 4;
        this.snake_eye_size = 2;
        this.snake_eye_color = "black";
        this.snake_tongue_size = 4;
        this.snake_tongue_color = "#c6538c";
        this.ctx = snakeboard_ctx;
        this.pause = true;
        this.speed = 70;
    }

    getSpeed() { return this.speed; }

    init() {
        this.render();
    }

    isPaused() {
        return this.pause;
    }

    render() {
        this.snake_body.forEach(tile => this.renderSnakePart(tile, this.ctx));
        this.renderSnakeEyesAndTongue();
    }

    renderSnakePart(snake_part, ctx) {
        drawRoundedSquare(ctx,
            snake_part.x, snake_part.y,
            this.snake_tile_size, this.snake_tile_size,
            this.snake_tile_corner_radius,
            snake_part.color, this.snake_border,
            2);
    }

    renderSnakeEyesAndTongue() {
        const head = this.snake_body[0];
        var eye_1 = {
            x: 0, y: 0
        }, eye_2 = {
            x: 0, y: 0
        };
        var tongue = {
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
        this.ctx.save();

        this.ctx.fillStyle = this.snake_eye_color;
        this.ctx.fillRect(eye_1.x, eye_1.y, this.snake_eye_size, this.snake_eye_size);
        this.ctx.fillRect(eye_2.x, eye_2.y, this.snake_eye_size, this.snake_eye_size);

        this.ctx.strokeStyle = this.snake_tongue_color;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(tongue.x2, tongue.y2);
        this.ctx.lineTo(tongue.x1, tongue.y1);
        this.ctx.lineTo(tongue.x3, tongue.y3);
        this.ctx.stroke();

        this.ctx.restore();
    }

    move() {
        if (this.pause) {
            return;
        }
        const head = { x: this.snake_body[0].x + this.dx * this.step, y: this.snake_body[0].y + this.dy * this.step, color: this.snake_body[0].color };
        for (var i = 0; i < this.snake_body.length - 1; i++) {
            this.snake_body[i].color = this.snake_body[i + 1].color;
        }
        this.snake_body.unshift(head);
        this.snake_body.pop();
    }

    pauseOrResumeMoving() {
        this.pause = !this.pause;
    }

    dx() { return this.dx; }
    dy() { return this.dy; }

    turnLeft() {
        this.turnMult(1);
    }

    turnRight() {
        this.turnMult(-1);
    }

    turnMult(mult) {
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

    head() {
        return this.snake_body[0];
    }

    isCollide() {
        for (var i = 4; i < this.snake_body.length; i++) {
            return this.snake_body[i].x === this.snake_body[0].x && this.snake_body[i].y === this.snake_body[0].y;
        }
    }

    grow(nColor) {
        const head = { x: this.snake_body[0].x + this.dx * this.step, y: this.snake_body[0].y + this.dy * this.step, color: nColor };
        this.snake_body.unshift(head);
        if (this.speed > 1) {
            this.speed -= 1;
        } else if (this.speed > 0.01) {
            this.speed -= 0.01;
        } else {
            // Keep constant speed 0.01
        }
    }

    bodySizeIncrease() {
        var newSnakeBody = [snake.head()];
        var current_x = snake.head().x;
        var current_y = snake.head().y;
        for (var i = 1; i < this.snake_body.length; i++) {
            const this_tile = {
                x: this.snake_body[i].x,
                y: this.snake_body[i].y,
                col: this.snake_body[i].color
            }
            const prev_tile = {
                x: this.snake_body[i - 1].x,
                y: this.snake_body[i - 1].y
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

    gainWeight() {
        const offset = 1;
        if (this.snake_tile_size < this.snake_max_tile_size) {
            this.snake_tile_size += offset;
            this.step = this.snake_tile_size;
            this.snake_body = this.bodySizeIncrease();
        }
    }
}