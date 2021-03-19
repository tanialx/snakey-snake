class Snake {

    constructor(snakeboard_ctx, initialPosition) {
        this.snake_body = initialPosition;
        this.snake_col = 'DarkSeaGreen';
        this.snake_border = 'Black';
        this.snake_tile_w = 19;
        this.snake_tile_h = 19;
        this.snake_tile_corner_radius = 8;
        this.ctx = snakeboard_ctx;
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

    move(dx, dy) {
        const head = { x: this.snake_body[0].x + dx, y: this.snake_body[0].y + dy };
        this.snake_body.unshift(head);
        this.snake_body.pop();
        this.redraw();
    }
}
