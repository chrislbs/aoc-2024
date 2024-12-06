import {Solution} from "./solution";
import {readPuzzleInput} from "../utils/files";

const OBSTRUCTION = "#"
const NEW_OBSTRUCTION = "O"

enum direction {
    UP,
    RIGHT,
    DOWN,
    LEFT,
}

const directions = [
    "^",
    ">",
    "v",
    "<",
]

const movements = [
    // y, x movements
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
]

function nextDir(direction: direction): direction {
    return (direction + 1) % 4;
}

function isObstruction(mapState: mapState, location: location): boolean {
    return mapState.map[location.y][location.x] === OBSTRUCTION ||
        mapState.map[location.y][location.x] === NEW_OBSTRUCTION;
}

type location = {
    x: number;
    y: number;
}

type mapState = {
    map: string[][]
    guardPosition: location;
    guardDirection: direction;
}

export function parseInput(input: string): mapState {

    const lines = input.trim().split("\n");
    const map = new Array<string[]>(lines.length);
    let guardPosition: location;
    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
        const mapRow = new Array<string>(line.length);
        for (let x = 0; x < line.length; x++) {
            mapRow[x] = line[x];
            if (line[x] === directions[direction.UP]) {
                guardPosition = {x: x, y: y};
            }
        }
        map[y] = mapRow;
    }

    return {
        map: map,
        guardPosition: guardPosition!,
        guardDirection: direction.UP,
    }
}

function inBounds(map: string[][], location: location): boolean {
    const {x, y} = location;
    return y >= 0 && y < map.length && x >= 0 && x < map[y].length;
}

// get the next location we'd be if there were no obstacle
function calcNextLocation(mapState: mapState): location {
    const {guardPosition, guardDirection} = mapState;

    const offsets = movements[guardDirection];
    const {y, x} = guardPosition;
    return {y: y + offsets[0], x: x + offsets[1]};
}

// in front, turn right 90 degress
// otherwise, step forward
function step(mapState: mapState): location {
    const {guardPosition, guardDirection, map} = mapState;

    const offsets = movements[guardDirection];
    const {y, x} = guardPosition;
    let nextLocation = {y: guardPosition.y + offsets[0], x: guardPosition.x + offsets[1]};
    let nextDirection = guardDirection;
    if (inBounds(map, nextLocation)) {
        if (isObstruction(mapState, nextLocation)) {
            nextLocation = guardPosition;
            nextDirection = nextDir(guardDirection);
            map[y][x] = directions[nextDirection]
        } else {
            map[y][x] = "."
            if (inBounds(map, nextLocation)) {
                map[nextLocation.y][nextLocation.x] = directions[guardDirection];
            }
        }
    }
    mapState.guardPosition = nextLocation;
    mapState.guardDirection = nextDirection;
    return nextLocation;
}

export function p1pipeline(input: string): number {

    const mapState = parseInput(input);

    let numSteps = 0;
    // key is y, value is x
    const visitedPositions = new Map<number, Set<number>>();
    while (inBounds(mapState.map, mapState.guardPosition)) {
        const guardPosition = mapState.guardPosition;
        const visitedOnRow = visitedPositions.get(guardPosition.y) || new Set<number>();
        visitedOnRow.add(guardPosition.x);
        visitedPositions.set(guardPosition.y, visitedOnRow);

        step(mapState);
        numSteps += 1;
    }

    let distinctLocations = 0;
    visitedPositions.forEach((xPositions, _) => {
        distinctLocations += xPositions.size;
    })

    return distinctLocations;
}

function parseObstaclePositions(mapState: mapState) {
    const obstaclesByRow = new Map<number, number[]>();
    const obstaclesByCol = new Map<number, number[]>();
    for (let y = 0; y < mapState.map.length; y++) {
        for (let x = 0; x < mapState.map.length; x++) {
            if (isObstruction(mapState, {x: x, y: y})) {
                let obstaclesInRow = obstaclesByRow.get(y) || [];
                obstaclesInRow.push(x);
                obstaclesByRow.set(y, obstaclesInRow);

                let obstaclesInCol = obstaclesByCol.get(x) || [];
                obstaclesInCol.push(y);
                obstaclesByCol.set(x, obstaclesInCol)
            }
        }
    }

    return {
        obstaclesByCol,
        obstaclesByRow
    };
}

function isLoop(mapState: mapState): boolean {
    const visitedPositions = new Map<number, Map<number, Set<string>>>();
    while (inBounds(mapState.map, mapState.guardPosition)) {
        const {guardPosition, guardDirection} = mapState;

        if (visitedPositions.has(guardPosition.y) &&
            visitedPositions.get(guardPosition.y)!.has(guardPosition.x) &&
            visitedPositions.get(guardPosition.y)!.get(guardPosition.x)!.has(directions[guardDirection])) {
            return true;
        }

        const visitedRow = visitedPositions.get(guardPosition.y) || new Map<number, Set<string>>();
        const visitedDirs = visitedRow.get(guardPosition.x) || new Set<string>();
        visitedDirs.add(directions[guardDirection]);
        visitedRow.set(guardPosition.x, visitedDirs);
        visitedPositions.set(guardPosition.y, visitedRow);


        step(mapState);
    }
    return false;
}

function renderMap(mapState: mapState) {
    const render = mapState.map.map(row => row.join("")).join("\n");
    console.log(render);
}

export function p2pipeline(input: string): number {

    const originalState = parseInput(input);
    const startLocation = originalState.guardPosition;

    const cloneState = (s: mapState) => JSON.parse(JSON.stringify(s)) as mapState;

    const testedObstructions = new Map<number, Set<number>>();
    const loopingObstructions = new Array<location>();
    const {obstaclesByRow, obstaclesByCol} = parseObstaclePositions(originalState);

    let numSteps = 0;
    let mapState = cloneState(originalState);
    while (inBounds(mapState.map, mapState.guardPosition)) {
        const {guardPosition, guardDirection} = mapState;

        const nextDirectionIfObstaclePlaced = nextDir(guardDirection);
        const obstructionLocation = calcNextLocation(mapState);
        let obstructionCandidate = false;

        // If we're heading UP or DOWN, look down the current row for an obstacle
        // if we're heading LEFT or RIGHT, look down the current column.
        let positionsToCheck;
        let position;
        let comparisonFunc;
        if (nextDirectionIfObstaclePlaced % 3 === 0) {
            // moving up or left means obstacle must be < curPos
            comparisonFunc = (curPos: number, obs: number) => obs < curPos;
        } else {
            comparisonFunc = (curPos: number, obs: number) => obs > curPos;
        }
        if (guardDirection % 2 === 0) {
            // we're going up or down - look through the row for obstacles
            positionsToCheck = obstaclesByRow.get(guardPosition.y) || [];
            position = guardPosition.x
        } else {
            // we're going left or right - look up and down the column for obstacles
            positionsToCheck = obstaclesByCol.get(guardPosition.x) || [];
            position = guardPosition.y
        }
        for (let i = 0; i < positionsToCheck.length; i++) {
            const obstaclePosition = positionsToCheck[i];
            if (comparisonFunc(position, obstaclePosition)) {
                obstructionCandidate = true;
                break;
            }
        }

        // Make sure the location is:
        // 1. Not already an obstruction
        // 2. In bounds
        // 3. Not one we've tested before
        // 4. Is not the starting location
        const hasTestedLocation = testedObstructions.has(obstructionLocation.y) && testedObstructions.get(obstructionLocation.y)!.has(obstructionLocation.x);
        const isNotOriginalLocation = startLocation.y !== obstructionLocation.y || startLocation.x !== obstructionLocation.x;
        if (obstructionCandidate &&
            inBounds(mapState.map, obstructionLocation) &&
            !isObstruction(mapState, obstructionLocation) &&
            !hasTestedLocation &&
            isNotOriginalLocation
        ) {
            // create a fresh state with a new obstruction, and check if it loops
            const stateWithNewObstruction = cloneState(mapState);
            stateWithNewObstruction.map[obstructionLocation.y][obstructionLocation.x] = NEW_OBSTRUCTION;

            if (isLoop(stateWithNewObstruction)) {
                loopingObstructions.push(obstructionLocation);
            } else {
            }
            const testedRow = testedObstructions.get(obstructionLocation.y) || new Set<number>();
            testedRow.add(obstructionLocation.x);
            testedObstructions.set(obstructionLocation.y, testedRow);
        }

        step(mapState);
    }

    return loopingObstructions.length;
}


function part1(): number {
    return p1pipeline(readPuzzleInput(6));
}

function part2(): number {
    return p2pipeline(readPuzzleInput(6));
}

const day6: Solution = {
    part1: part1,
    part2: part2
}

export default day6;