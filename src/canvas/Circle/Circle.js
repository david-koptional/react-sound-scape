import { Shape } from "../Shape/Shape";
export function Circle(x, y, velocity, direction, size, color, ctx, movementPatterns) {
    const shape = Shape(x, y, velocity, direction, size, color, ctx, movementPatterns);
    return {
        ...shape,
        draw: function () {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        },
    };
}
//# sourceMappingURL=Circle.js.map