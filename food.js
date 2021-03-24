class Food {

    constructor(canvas_ctx, max_size, min_size, margin) {
        this.ctx = canvas_ctx;
        this.x = 0;
        this.y = 0;
        this.margin = margin;
        this.maxSize = max_size;
        this.minSize = min_size;
        this.foodSize = min_size;
        this.color = "#ffffff";
    }

    getX() { return this.x; }
    getY() { return this.y; }
    getFoodSize() { return this.foodSize; }

    genFood() {
        this.foodSize = getRandomInteger(this.minSize, this.maxSize);
        this.x = this.randomFoodPos(this.foodSize, this.margin, snakeboard.width - this.foodSize - this.margin);
        this.y = this.randomFoodPos(this.foodSize, this.margin, snakeboard.height - this.foodSize - this.margin);
        this.color = randomColor();
    }

    randomFoodPos(food_size, min_pos, max_pos) {
        return Math.round((Math.random() * (max_pos - min_pos) + min_pos) / food_size) * food_size;
    }

    render() {
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = "#ffffff";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.foodSize / 2, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    }
}