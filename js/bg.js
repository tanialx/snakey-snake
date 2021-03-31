function renderStaticBackground(bgStatic_ctx) {
    const board_border = 'GhostWhite';
    const board_background = "#d9f2e6";
    const grassColor = '#669999';
    // Draw grass

    bgStatic_ctx.strokeStyle = board_border;
    bgStatic_ctx.lineWidth = 10;
    bgStatic_ctx.fillStyle = board_background;
    bgStatic_ctx.fillRect(0, 0, bgStatic.width, bgStatic.height);
    bgStatic_ctx.strokeRect(0, 0, bgStatic.width, bgStatic.height);
    bgStatic_ctx.strokeStyle = grassColor;
    bgStatic_ctx.lineWidth = 1;
    for (let i = 0; i <= 20; ++i) {
        let x = getRandomInteger(20, bgStatic.width - 20);
        let y = getRandomInteger(20, bgStatic.height - 20);
        bgStatic_ctx.beginPath();
        bgStatic_ctx.moveTo(x, y);
        bgStatic_ctx.quadraticCurveTo(x - 1, y - 6, x - 5, y - 5);
        bgStatic_ctx.stroke();
        bgStatic_ctx.beginPath();
        bgStatic_ctx.moveTo(x, y);
        bgStatic_ctx.quadraticCurveTo(x + 1, y - 10, x + 5, y - 10);
        bgStatic_ctx.stroke();
        bgStatic_ctx.beginPath();
        bgStatic_ctx.moveTo(x + 5, y);
        bgStatic_ctx.quadraticCurveTo(x + 1, y - 10, x + 5, y - 10);
        bgStatic_ctx.stroke();
        bgStatic_ctx.beginPath();
        bgStatic_ctx.moveTo(x + 5, y);
        bgStatic_ctx.quadraticCurveTo(x + 4, y - 5, x + 12, y - 9);
        bgStatic_ctx.stroke();
        bgStatic_ctx.beginPath();
        bgStatic_ctx.moveTo(x + 10, y);
        bgStatic_ctx.quadraticCurveTo(x + 9, y - 5, x + 12, y - 4);
        bgStatic_ctx.stroke();
    }
}
