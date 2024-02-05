import { Shape } from "../Shape/Shape";
export function Triangle(x, y, velocity, direction, size, color, ctx, movementPatterns) {
    const shape = Shape(x, y, velocity, direction, size, color, ctx, movementPatterns);
    return {
        ...shape,
        draw: function () {
            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(this.direction);
            this.ctx.beginPath();
            this.ctx.moveTo(0, -this.size / 2);
            this.ctx.lineTo(-this.size / 2, this.size / 2);
            this.ctx.lineTo(this.size / 2, this.size / 2);
            this.ctx.closePath();
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
            this.ctx.restore();
        },
    };
}
//# sourceMappingURL=Triangle.js.map