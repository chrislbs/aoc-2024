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

class Location {
    constructor(public readonly x: number, public readonly y: number) {
    }
}

type locationFactory = (y: number, x: number) => Location;

// factory builder for locations so we can use reference equality in Maps/Sets
function buildLocationFactory(map: string[][]) {
    const allLocations = new Array<Location[]>(map.length);
    for (let y = 0; y < map.length; y++) {
        const rows = map[y];
        const rowLocations = new Array<Location>(rows.length);
        for (let x = 0; x < rows.length; x++) {
            rowLocations[x] = new Location(x, y)
        }
        allLocations[y] = rowLocations;
    }

    return (y: number, x: number) => {
        return allLocations[y][x]
    }
}

class LabMap {
    readonly map: string[][]

    constructor(map: string[][]) {
        this.map = map
    }

    isObstruction(location: Location): boolean {
        return this.map[location.y][location.x] === OBSTRUCTION
    }

    inBounds(y: number, x: number): boolean {
        return y >= 0 && y < this.map.length && x >= 0 && x < this.map[y].length;
    }
}

class Guard {
    location: Location
    direction: direction

    constructor(initialLocation: Location, direction: direction) {
        this.location = initialLocation;
        this.direction = direction;
    }

    nextDirection(): direction {
        return (this.direction + 1) % 4;
    }

    nextLocation(map: LabMap, locationFactory: locationFactory): Location | undefined {
        const offsets = movements[this.direction];
        const {y, x} = this.location;
        const nextLoc = {y: y + offsets[0], x: x + offsets[1]};
        if (map.inBounds(nextLoc.y, nextLoc.x)) {
            return locationFactory(nextLoc.y, nextLoc.x);
        }
        return undefined
    }

    /**
     * Based on this map, take a step. Return the new location or undefined if it walks us off the map
     */
    step(map: LabMap, locationFactory: locationFactory, additionalObstruction?: Location): Location | undefined {
        let nextLocation = this.nextLocation(map, locationFactory);
        let nextDirection = this.nextDirection();
        if (nextLocation === undefined) {
            return undefined;
        }
        if (map.isObstruction(nextLocation) || nextLocation == additionalObstruction) {
            this.direction = nextDirection;
        } else {
            this.location = nextLocation;
        }
        return this.location;
    }

    isInLoop(map: LabMap, locationFactory: locationFactory, additionalObstruction: Location): boolean {
        const visitedPositions = new Map<Location, direction[]>();
        let nextLocation = this.nextLocation(map, locationFactory);
        while (nextLocation != undefined) {
            const visitedDirs = visitedPositions.get(this.location) || [];
            if (visitedDirs.includes(this.direction)) {
                return true;
            }

            visitedDirs.push(this.direction);
            visitedPositions.set(this.location, visitedDirs);

            nextLocation = this.step(map, locationFactory, additionalObstruction);
        }
        return false;
    }

    clone() {
        return new Guard(this.location, this.direction);
    }
}

export function parseInput(input: string) {

    const lines = input.trim().split("\n");
    const map = new Array<string[]>(lines.length);
    let guardPosition;
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

    const locationFactory = buildLocationFactory(map);
    const guardLocation = locationFactory(guardPosition!.y, guardPosition!.x);

    return {
        map: new LabMap(map),
        guard: new Guard(guardLocation, direction.UP),
        locationFactory: locationFactory,
    }
}

export function p1pipeline(input: string): number {

    const {map, locationFactory, guard} = parseInput(input);

    const visitedPositions = new Set<Location>();
    let nextLocation = guard.nextLocation(map, locationFactory);
    while (nextLocation != undefined) {
        visitedPositions.add(nextLocation);

        nextLocation = guard.step(map, locationFactory);
    }

    return visitedPositions.size;
}

export function p2pipeline(input: string): number {

    const {map, locationFactory, guard} = parseInput(input);
    const startLocation = guard.location;

    const testedObstructions = new Set<Location>();
    const loopingObstructions = new Set<Location>();

    let nextLocation = guard.nextLocation(map, locationFactory);
    while (nextLocation != undefined) {

        const obstructionLocation = guard.nextLocation(map, locationFactory);

        if (obstructionLocation != undefined &&
            !testedObstructions.has(obstructionLocation) &&
            !map.isObstruction(obstructionLocation) &&
            obstructionLocation !== startLocation) {
            const loopingGuard = guard.clone()
            if (loopingGuard.isInLoop(map, locationFactory, obstructionLocation)) {
                loopingObstructions.add(obstructionLocation);
            }
            testedObstructions.add(obstructionLocation);
        }

        nextLocation = guard.step(map, locationFactory);
    }

    return loopingObstructions.size;
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