class Donut {

    constructor(canvas_ctx, size, margin) {
        this.ctx = canvas_ctx;
        this.x = 0;
        this.y = 0;
        this.margin = margin;
        this.size = size;
        this.creamColor = "#ffffff";
    }

    getX() { return this.x; }
    getY() { return this.y; }
    getSize() { return this.size; }

    newDonut() {
        this.x = this.randomPos(this.size, this.margin, snakeboard.width - this.size - this.margin);
        this.y = this.randomPos(this.size, this.margin, snakeboard.height - this.size - this.margin);
        this.creamColor = randomPastelColor();
    }

    randomPos(size, min_pos, max_pos) {
        return Math.round((Math.random() * (max_pos - min_pos) + min_pos) / size) * size;
    }

    render() {
        this.ctx.save();

        this.ctx.fillStyle = "#d4b59d";
        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI, false);
        this.ctx.closePath();
        this.ctx.arc(this.x, this.y, this.size / 4, 0, 2 * Math.PI, true);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size / 3, 0, 2 * Math.PI, true);
        this.ctx.strokeStyle = this.creamColor;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.restore();
    }
}