class Snake {

    constructor(snakeboard_ctx, initialPosition) {
        this.snake_body = initialPosition;
        this.snake_col = '#d1e0e0';
        this.snake_border = 'White';
        this.snake_tile_w = 20;
        this.snake_tile_h = 20;
        this.snake_tile_corner_radius = 4;
        this.snake_eye_size = 2;
        this.snake_eye_color = "black";
        this.snake_tongue_size = 4;
        this.snake_tongue_color = "red";
        this.ctx = snakeboard_ctx;
        this.step = 20;
        this.dx = this.step;
        this.dy = 0;
        this.pause = false;
    }

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
            this.snake_tile_w, this.snake_tile_h,
            this.snake_tile_corner_radius,
            this.snake_col, this.snake_border,
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
            eye_1.x = head.x + this.snake_tile_w / 4;
            eye_2.x = eye_1.x;
            eye_1.y = head.y + this.snake_tile_h / 4;
            eye_2.y = head.y + this.snake_tile_h / 4 * 3;
            tongue.x1 = head.x;
            tongue.y1 = head.y + this.snake_tile_w / 2;
            tongue.x2 = tongue.x1 - this.snake_tongue_size;
            tongue.y2 = tongue.y1 - this.snake_tongue_size;
            tongue.x3 = tongue.x1 - this.snake_tongue_size;
            tongue.y3 = tongue.y1 + this.snake_tongue_size;
        } else if (this.isMovingRight()) {
            eye_1.x = head.x + this.snake_tile_w / 4 * 3;
            eye_2.x = eye_1.x;
            eye_1.y = head.y + this.snake_tile_h / 4;
            eye_2.y = head.y + this.snake_tile_h / 4 * 3;
            tongue.x1 = head.x + this.snake_tile_h;
            tongue.y1 = head.y + this.snake_tile_w / 2;
            tongue.x2 = tongue.x1 + this.snake_tongue_size;
            tongue.y2 = tongue.y1 + this.snake_tongue_size;
            tongue.x3 = tongue.x1 + this.snake_tongue_size;
            tongue.y3 = tongue.y1 - this.snake_tongue_size;
        } else if (this.isMovingUp()) {
            eye_1.y = head.y + this.snake_tile_h / 4;
            eye_2.y = eye_1.y;
            eye_1.x = head.x + this.snake_tile_w / 4;
            eye_2.x = head.x + this.snake_tile_w / 4 * 3;
            tongue.x1 = head.x + this.snake_tile_w / 2;
            tongue.y1 = head.y;
            tongue.x2 = tongue.x1 + this.snake_tongue_size;
            tongue.y2 = tongue.y1 - this.snake_tongue_size;
            tongue.x3 = tongue.x1 - this.snake_tongue_size;
            tongue.y3 = tongue.y1 - this.snake_tongue_size;
        } else {
            eye_1.y = head.y + this.snake_tile_h / 4 * 3;
            eye_2.y = eye_1.y;
            eye_1.x = head.x + this.snake_tile_w / 4;
            eye_2.x = head.x + this.snake_tile_w / 4 * 3;
            tongue.x1 = head.x + this.snake_tile_w / 2;
            tongue.y1 = head.y + this.snake_tile_h;
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
        const head = { x: this.snake_body[0].x + this.dx, y: this.snake_body[0].y + this.dy };
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
        return this.dx === - this.step;
    }

    isMovingRight() {
        return this.dx === this.step;
    }

    isMovingUp() {
        return this.dy === - this.step;
    }

    isMovingDown() {
        return this.dy === this.step;
    }

    head() {
        return this.snake_body[0];
    }

    isCollide() {
        for (var i = 4; i < this.snake_body.length; i++) {
            return this.snake_body[i].x === this.snake_body[0].x && this.snake_body[i].y === this.snake_body[0].y;
        }
    }

    grow() {
        const head = { x: this.snake_body[0].x + this.dx, y: this.snake_body[0].y + this.dy };
        this.snake_body.unshift(head);
    }

}