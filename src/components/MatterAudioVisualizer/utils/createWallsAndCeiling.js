import Matter from "matter-js";
export const createWallsAndCeiling = (engine, WORLD_WIDTH, WORLD_HEIGHT) => {
    const wallThickness = 16; // Thickness of the walls and ceiling
    const halfWallThickness = wallThickness / 2;
    const ceiling = Matter.Bodies.rectangle(WORLD_WIDTH / 2, halfWallThickness, WORLD_WIDTH, wallThickness, { isStatic: true });
    const floor = Matter.Bodies.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT - halfWallThickness, WORLD_WIDTH, wallThickness, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(halfWallThickness, WORLD_HEIGHT / 2, wallThickness, WORLD_HEIGHT, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(WORLD_WIDTH - halfWallThickness, WORLD_HEIGHT / 2, wallThickness, WORLD_HEIGHT, { isStatic: true });
    Matter.Composite.add(engine.world, [floor, ceiling, leftWall, rightWall]);
};
//# sourceMappingURL=createWallsAndCeiling.js.map