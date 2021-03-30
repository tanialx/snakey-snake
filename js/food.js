class Food {

    constructor(canvas_ctx, foodOptions) {
        this.ctx = canvas_ctx;
        this.x = 0;
        this.y = 0;

        this.sizeOpts = foodOptions.size.vary ? {
            min: foodOptions.size.min,
            max: foodOptions.size.max
        } : {
            fixed: foodOptions.size.fixed
        }

        this.type = foodOptions.type;
        this.color = "#ffffff";
    }

    new(boundingBox) {
        this.size = this.sizeOpts.fixed ? this.sizeOpts.fixed : getRandomInteger(this.sizeOpts.min, this.sizeOpts.max);
        this.x = getRandomInteger(boundingBox.x.min + this.size, boundingBox.x.max - this.size);
        this.y = getRandomInteger(boundingBox.y.min + this.size, boundingBox.y.max - this.size);
        this.color = randomPastelColor();
    }

    render() {

    }
}