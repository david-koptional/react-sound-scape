export function Shape(x, y, velocity, direction, size, color, ctx, movementPatterns) {
    const movementPattern = movementPatterns[0];
    let beatCount = 0;
    const originalSize = size;
    return {
        x,
        y,
        size,
        color,
        ctx,
        velocity,
        direction,
        movementPattern,
        globalAlpha: 1.0, // Default alpha value
        shadow: {
            color: "rgba(0, 0, 0, 0.5)", // Default shadow color
            blur: 10,
            offsetX: 5,
            offsetY: 5,
        },
        draw: function () {
            // Implement the draw method
        },
        update: function () {
            const updatedShape = this.movementPattern(this);
            this.x = updatedShape.x;
            this.y = updatedShape.y;
        },
        wrappedDraw: function () {
            this.ctx.save(); // Save the current context state
            // Apply global alpha and shadow settings
            this.ctx.globalAlpha = this.globalAlpha;
            this.ctx.shadowColor = this.shadow.color;
            this.ctx.shadowBlur = this.shadow.blur;
            this.ctx.shadowOffsetX = this.shadow.offsetX;
            this.ctx.shadowOffsetY = this.shadow.offsetY;
            // Call the specific shape's draw method
            this.draw();
            this.ctx.restore(); // Restore the context state, reverting alpha and shadow changes
        },
        changeMovementPatternsWithTheBeat: function (beat) {
            if (beat) {
                beatCount++;
                this.movementPattern = movementPatterns[beatCount % movementPatterns.length];
            }
        },
        scaleSizeWithBass: function (bassFrequency) {
            this.size = originalSize; // Reset the size to the original size
            const scaleFactor = 1 + bassFrequency / 255;
            this.size = this.size * scaleFactor;
        },
        keepWithinBounds: function (bounds) {
            if (this.x < 0) {
                this.x = 0;
                this.direction = Math.PI - this.direction; // Reflect direction on x-axis
            }
            else if (this.x > bounds.width) {
                this.x = bounds.width;
                this.direction = Math.PI - this.direction; // Reflect direction on x-axis
            }
            if (this.y < 0) {
                this.y = 0;
                this.direction = -this.direction; // Reflect direction on y-axis
            }
            else if (this.y > bounds.height) {
                this.y = bounds.height;
                this.direction = -this.direction; // Reflect direction on y-axis
            }
        },
        rotate: function (angle) {
            this.direction += angle;
        },
    };
}
//# sourceMappingURL=Shape.js.map