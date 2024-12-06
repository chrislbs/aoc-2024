import {Solution} from "./solution";
import {readPuzzleInput} from "../utils/files";

const OBSTRUCTION = "#"

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
    for ( let y = 0; y < lines.length; y++ ) {
        const line = lines[y];
        const mapRow = new Array<string>(line.length);
        for( let x = 0; x < line.length; x++ ) {
            mapRow[x] = line[x];
            if(line[x] === directions[direction.UP]) {
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

// in front, turn right 90 degress
// otherwise, step forward
function step(mapState: mapState): location {
    const {guardPosition, guardDirection, map} = mapState;

    const offsets = movements[guardDirection];
    const {y, x} = guardPosition;
    let nextLocation = {y: guardPosition.y + offsets[0], x: guardPosition.x + offsets[1]};
    let nextDirection = guardDirection;
    if(inBounds(map, nextLocation)) {
        if (map[nextLocation.y][nextLocation.x] === OBSTRUCTION) {
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

    // key is y, value is x
    const visitedPositions = new Map<number, Set<number>>();
    while(inBounds(mapState.map, mapState.guardPosition)) {
        const guardPosition = mapState.guardPosition;
        const visitedOnRow = visitedPositions.get(guardPosition.y) || new Set<number>();
        visitedOnRow.add(guardPosition.x);
        visitedPositions.set(guardPosition.y, visitedOnRow);

        step(mapState);
    }

    let distinctLocations = 0;
    visitedPositions.forEach((xPositions, _) => {
        distinctLocations += xPositions.size;
    })

    return distinctLocations;
}

export function p2pipeline(input: string): number {
    return 2;
}


function part1(): number {
    return p1pipeline(readPuzzleInput(6));
}

function part2(): number {
    return p2pipeline(readPuzzleInput(6));
}

const day6: Solution = {
    part1: part1,
    // part2: part2
}

export default day6;