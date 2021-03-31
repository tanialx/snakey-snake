class Food {

    constructor(food_opts) {
        this.x = 0;
        this.y = 0;

        this.sizeOpts = {
            min: food_opts.size.min,
            max: food_opts.size.max
        }

        this.type = food_opts.type;
        this.callback = food_opts.callback;
    }

    new(boundingBox) {
        this.size = this.sizeOpts.min === this.sizeOpts.max ? this.sizeOpts.min : getRandomInteger(this.sizeOpts.min, this.sizeOpts.max);
        this.x = getRandomInteger(boundingBox.x.min + this.size, boundingBox.x.max - this.size);
        this.y = getRandomInteger(boundingBox.y.min + this.size, boundingBox.y.max - this.size);
        this.color = randomPastelColor();
    }

    render(canvas_ctx) {}

    takeEffect() {
        this.callback.eaten(this.color);
    }
}

class Fruit extends Food {

    render(canvas_ctx) {
        canvas_ctx.save();

        // Exocarp
        canvas_ctx.fillStyle = this.color;
        canvas_ctx.strokeStyle = "#000000";
        canvas_ctx.lineWidth = 2;
        canvas_ctx.beginPath();
        canvas_ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI);
        canvas_ctx.stroke();
        canvas_ctx.fill();

        // Stalk
        const offset = this.size / 10;
        const stalk_root = {
            x: this.x,
            y: this.y - this.size / 4
        }
        const stalk_mid = {
            x: stalk_root.x + 2 * offset,
            y: stalk_root.y - 3 * offset
        }
        canvas_ctx.beginPath();
        canvas_ctx.lineWidth = 1;
        canvas_ctx.moveTo(stalk_root.x, stalk_root.y);
        canvas_ctx.quadraticCurveTo(stalk_root.x, stalk_root.y - offset, stalk_mid.x, stalk_mid.y);
        canvas_ctx.quadraticCurveTo(stalk_root.x + 4 * offset, stalk_root.y - 6 * offset, stalk_root.x + 6 * offset, stalk_root.y - 6 * offset);
        canvas_ctx.stroke();

        // Leaf
        canvas_ctx.beginPath();
        canvas_ctx.moveTo(stalk_mid.x, stalk_mid.y);
        canvas_ctx.quadraticCurveTo(stalk_root.x, stalk_root.y - 7 * offset, stalk_root.x - 4 * offset, stalk_root.y - 5 * offset);
        canvas_ctx.quadraticCurveTo(stalk_root.x - 2 * offset, stalk_root.y - 3 * offset, stalk_mid.x, stalk_mid.y);
        canvas_ctx.lineTo(stalk_root.x - 2 * offset, stalk_root.y - 4 * offset);
        canvas_ctx.fillStyle = '#66CDAA';
        canvas_ctx.fill();
        canvas_ctx.stroke();

        canvas_ctx.restore();
    }
}

class Donut extends Food {

    render(canvas_ctx) {
        canvas_ctx.save();

        canvas_ctx.fillStyle = "#d4b59d";
        canvas_ctx.strokeStyle = "#000000";
        canvas_ctx.lineWidth = 2;
        canvas_ctx.beginPath();
        canvas_ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI, false);
        canvas_ctx.closePath();
        canvas_ctx.arc(this.x, this.y, this.size / 4, 0, 2 * Math.PI, true);
        canvas_ctx.closePath();
        canvas_ctx.stroke();
        canvas_ctx.fill();

        canvas_ctx.beginPath();
        canvas_ctx.arc(this.x, this.y, this.size / 3, 0, 2 * Math.PI, true);
        canvas_ctx.strokeStyle = this.color;
        canvas_ctx.lineWidth = 2;
        canvas_ctx.stroke();

        canvas_ctx.restore();
    }
}
