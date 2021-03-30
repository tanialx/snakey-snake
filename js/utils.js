drawRoundedSquare = function (ctx, x, y, width, height, radius, fill, stroke, lineWidth) {

    //Ref https://gist.github.com/afreeland/4484489

    var useStroke = typeof stroke == 'undefined' || stroke !== 0;
    radius = typeof radius == 'undefined' ? 5 : radius;

    // Save previous context
    ctx.save();
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (useStroke && stroke !== 0) {
        ctx.strokeStyle = typeof stroke == 'undefined' ? '#000' : stroke;
        ctx.stroke();
    }
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    ctx.restore();
}

function randomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomPastelColor() {
    return "hsl(" + 360 * Math.random() + ',' +
        (25 + 70 * Math.random()) + '%,' +
        (85 + 10 * Math.random()) + '%)'
}

function randomPosition(size, min_pos, max_pos) {
    return Math.round((Math.random() * (max_pos - min_pos) + min_pos) / size) * size;
}