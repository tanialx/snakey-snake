class Donut {

    constructor(canvas_ctx, size) {
        this.ctx = canvas_ctx;
        this.x = 0;
        this.y = 0;
        this.size = size;
        this.creamColor = "#ffffff";
    }

    newDonut(boundingBox) {
        this.x = randomPosition(this.size, boundingBox.x.min, boundingBox.x.max - this.size);
        this.y = randomPosition(this.size, boundingBox.y.min, boundingBox.y.max - this.size);
        this.creamColor = randomPastelColor();
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