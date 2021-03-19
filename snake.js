class Snake {

    constructor(snakeboard_ctx, initialPosition) {
        this.snake_body = initialPosition;
        this.snake_col = 'DarkSeaGreen';
        this.snake_border = 'Black';
        this.snake_tile_w = 19;
        this.snake_tile_h = 19;
        this.snake_tile_corner_radius = 8;
        this.ctx = snakeboard_ctx;
        this.step = 20;
        this.dx = this.step;
        this.dy = 0;
        this.pause = false;
    }

    init() {
        this.redraw();
    }

    redraw() {
        this.snake_body.forEach(tile => this.redrawSnakePart(tile, this.ctx));
    }

    redrawSnakePart(snake_part, ctx) {
        drawRoundedSquare(ctx,
            snake_part.x, snake_part.y,
            this.snake_tile_w, this.snake_tile_h,
            this.snake_tile_corner_radius,
            this.snake_col, 0,
            1);

    }

    move() {
        if (this.pause) {
            return;
        }
        const head = { x: this.snake_body[0].x + this.dx, y: this.snake_body[0].y + this.dy };
        this.snake_body.unshift(head);
        this.snake_body.pop();
        this.redraw();
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
        if (this.dx === this.step || this.dx === - this.step) {
            this.dy = this.dx * mult * -1;
            this.dx = 0;
            return;
        }
        if (this.dy === this.step || this.dy === - this.step) {
            this.dx = this.dy * mult;
            this.dy = 0;
            return;
        }
    }

}
