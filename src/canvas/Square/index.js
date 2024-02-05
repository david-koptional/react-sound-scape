import { Shape } from "../Shape";
export function Square(x, y, velocity, direction, size, color, ctx, movementPatterns) {
    const shape = Shape(x, y, velocity, direction, size, color, ctx, movementPatterns);
    return {
        ...shape,
        draw: function () {
            this.ctx.beginPath();
            this.ctx.rect(this.x, this.y, this.size, this.size);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        },
    };
}
//# sourceMappingURL=index.js.map