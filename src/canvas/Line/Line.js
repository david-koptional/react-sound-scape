export function Line(x1, y1, x2, y2, color, ctx) {
    let amplitude = 0;
    let phase = 0;
    let floatOffsetX = 0;
    let floatOffsetY = 0;
    let angle = 0;
    return {
        x1,
        y1,
        x2,
        y2,
        color,
        ctx,
        update: function () {
            angle += 0.0000001;
            floatOffsetX += 0.000001;
            floatOffsetY += 0.000001;
            this.rotate();
            this.float();
            phase += 0.05; // Increment the phase for the sin wave
        },
        rotate: function () {
            // Calculate the center of the line
            const centerX = (this.x1 + this.x2) / 2;
            const centerY = (this.y1 + this.y2) / 2;
            // Translate the line's endpoints to the origin
            const x1Translated = this.x1 - centerX;
            const y1Translated = this.y1 - centerY;
            const x2Translated = this.x2 - centerX;
            const y2Translated = this.y2 - centerY;
            // Apply the rotation to the translated points
            const rotatedX1 = x1Translated * Math.cos(angle) - y1Translated * Math.sin(angle);
            const rotatedY1 = x1Translated * Math.sin(angle) + y1Translated * Math.cos(angle);
            const rotatedX2 = x2Translated * Math.cos(angle) - y2Translated * Math.sin(angle);
            const rotatedY2 = x2Translated * Math.sin(angle) + y2Translated * Math.cos(angle);
            // Translate the points back to their original position around the center point
            this.x1 = rotatedX1 + centerX;
            this.y1 = rotatedY1 + centerY;
            this.x2 = rotatedX2 + centerX;
            this.y2 = rotatedY2 + centerY;
        },
        float: function () {
            // Use trigonometric functions for a smooth, wave-like motion
            const deltaX = Math.sin(floatOffsetX) * 2; // Horizontal displacement
            const deltaY = Math.cos(floatOffsetY) * 2; // Vertical displacement
            // Apply the floating effect to the line's endpoints
            this.x1 += deltaX;
            this.y1 += deltaY;
            this.x2 += deltaX;
            this.y2 += deltaY;
        },
        draw: function () {
            this.ctx.beginPath();
            this.ctx.moveTo(this.x1, this.y1);
            const startX = Math.min(this.x1, this.x2);
            const endX = Math.max(this.x1, this.x2);
            for (let x = startX; x <= endX; x++) {
                const y = this.y1 + amplitude * Math.sin((x + phase) * 0.1);
                this.ctx.lineTo(x, y);
            }
            this.ctx.strokeStyle = this.color;
            this.ctx.stroke();
            this.ctx.globalAlpha = 1.0;
            this.ctx.shadowColor = "transparent";
            this.ctx.shadowBlur = 0;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
        },
        respondToBass: function (bassFrequency) {
            amplitude = (bassFrequency / 255) * 50; // Modulate amplitude based on bass
        },
    };
}
//# sourceMappingURL=Line.js.map