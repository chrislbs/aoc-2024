
export enum manhattanDirection {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3,
}

const directions = [
    "^",
    ">",
    "v",
    "<",
]

const unitVectors: [number, number][] = [
    // y, x movements
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
]

export function turnRight(currentDir: manhattanDirection): manhattanDirection {
    return (currentDir + 1) % 4;
}

export function getUnitVector(currentDir: manhattanDirection): [number, number] {
    return unitVectors[currentDir]
}