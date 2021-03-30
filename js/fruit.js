class Fruit {

    constructor(canvas_ctx, max_size, min_size, margin) {
        this.ctx = canvas_ctx;
        this.x = 0;
        this.y = 0;
        this.margin = margin;
        this.maxSize = max_size;
        this.minSize = min_size;
        this.fruitSize = min_size;
        this.color = "#ffffff";
    }

    getX() { return this.x; }
    getY() { return this.y; }
    getFruitSize() { return this.fruitSize; }

    genFruit() {
        this.fruitSize = getRandomInteger(this.minSize, this.maxSize);
        this.x = this.randomFruitPos(this.fruitSize, this.margin, snakeboard.width - this.fruitSize - this.margin);
        this.y = this.randomFruitPos(this.fruitSize, this.margin, snakeboard.height - this.fruitSize - this.margin);
        this.color = randomPastelColor();
    }

    randomFruitPos(fruit_size, min_pos, max_pos) {
        return Math.round((Math.random() * (max_pos - min_pos) + min_pos) / fruit_size) * fruit_size;
    }

    render() {
        this.ctx.save();

        // Exocarp
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.fruitSize / 2, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fill();

        // Stalk
        const offset = this.fruitSize / 10;
        const stalk_root = {
            x: this.x,
            y: this.y - this.fruitSize / 4
        }
        const stalk_mid = {
            x: stalk_root.x + 2 * offset,
            y: stalk_root.y - 3 * offset
        }
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(stalk_root.x, stalk_root.y);
        this.ctx.quadraticCurveTo(stalk_root.x, stalk_root.y - offset, stalk_mid.x, stalk_mid.y);
        this.ctx.quadraticCurveTo(stalk_root.x + 4 * offset, stalk_root.y - 6 * offset, stalk_root.x + 6 * offset, stalk_root.y - 6 * offset);
        this.ctx.stroke();

        // Leaf
        this.ctx.beginPath();
        this.ctx.moveTo(stalk_mid.x, stalk_mid.y);
        this.ctx.quadraticCurveTo(stalk_root.x, stalk_root.y - 7 * offset, stalk_root.x - 4 * offset, stalk_root.y - 5 * offset);
        this.ctx.quadraticCurveTo(stalk_root.x - 2 * offset, stalk_root.y - 3 * offset, stalk_mid.x, stalk_mid.y);
        this.ctx.lineTo(stalk_root.x - 2 * offset, stalk_root.y - 4 * offset);
        this.ctx.fillStyle = '#66CDAA';
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.restore();
    }
}