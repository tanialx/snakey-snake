class Food {

    constructor(canvas_ctx, food_size, margin) {
        this.ctx = canvas_ctx;
        this.x = 0;
        this.y = 0;
        this.margin = margin;
        this.foodSize = food_size;
    }

    getX() { return this.x; }
    getY() { return this.y; }
    getFoodSize() { return this.foodSize; }

    genFood() {
        this.x = this.randomFoodPos(this.foodSize, this.margin, snakeboard.width - this.foodSize - this.margin);
        this.y = this.randomFoodPos(this.foodSize, this.margin, snakeboard.height - this.foodSize - this.margin);
    }

    randomFoodPos(food_size, min_pos, max_pos) {
        return Math.round((Math.random() * (max_pos - min_pos) + min_pos) / food_size) * food_size;
    }

    drawFood() {
        this.ctx.fillStyle = 'Black';
        this.ctx.fillRect(this.x, this.y, this.foodSize, this.foodSize);
    }
}