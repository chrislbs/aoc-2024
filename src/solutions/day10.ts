import {readPuzzleInput} from "../utils/files";
import {Solution} from "./solution";
import {createCachedGridLocationFactory, LocationFactory, Location} from "../utils/location";
import assert from "node:assert";
import {Stack} from "typescript-collections";
import {getUnitVector, manhattanDirection} from "../utils/manhattan-direction";

class TrailMap {
    map: number[][];
    trailHeads: Location[]
    private readonly locationFactory: LocationFactory

    constructor(map: number[][]) {
        this.map = map;
        assert(map.length > 0);
        this.locationFactory = createCachedGridLocationFactory(map.length, map[0].length);
        this.trailHeads = new Array<Location>();
        for(let y = 0; y < map.length; y++) {
            for(let x = 0; x < map[y].length; x++) {
                if(map[y][x] === 0) {
                    this.trailHeads.push(this.locationFactory(y, x))
                }
            }
        }
    }

    private getNextLocation(location: Location, unitVector: [number, number]): Location | undefined {
        const newY = location.y + unitVector[0];
        const newX = location.x + unitVector[1];
        if(newY >= 0 && newY < this.map.length && newX >= 0 && newX < this.map[newY].length) {
            return this.locationFactory(newY, newX)
        } else {
            return undefined
        }
    }

    private calcTrailHeadScore(trailHead: Location):number {
        const visitedLocations = new Set<Location>();
        const locationsToVisit = new Stack<Location>()
        locationsToVisit.add(trailHead)

        let ninesVisited = 0;
        while(!locationsToVisit.isEmpty()) {
            const curLocation = locationsToVisit.pop()!
            const curHeight = this.map[curLocation.y][curLocation.x]
            visitedLocations.add(curLocation)

            if(curHeight === 9) {
                ninesVisited++;
                continue;
            }

            // TODO: hate this enumeration style for the directions
            for(let i = manhattanDirection.UP; i < 4; i++) {
                const movementVector = getUnitVector(i)
                const nextLocation = this.getNextLocation(curLocation, movementVector);
                if(nextLocation === undefined ||
                    visitedLocations.has(nextLocation) ||
                    this.map[nextLocation.y][nextLocation.x] - curHeight != 1) {
                    continue;
                }

                locationsToVisit.add(nextLocation);
            }
        }
        return ninesVisited;
    }

    findTrailHeadScores(): Map<Location, number> {
        const trailHeadScores = new Map<Location, number>();

        for(let i = 0; i < this.trailHeads.length; i++) {
            const loc = this.trailHeads[i]
            const score = this.calcTrailHeadScore(loc)
            trailHeadScores.set(loc, score);
        }

        return trailHeadScores;
    }
}

export function parseInput(input: string): TrailMap {
    const map = input.trim()
        .split("\n")
        .map(line => {
            return line.trim().split("").map(height => {
                // handle test inputs
                const val = parseInt(height, 10)
                if(isNaN(val)) {
                    return -10;
                }
                return val;
            })
        });
    return new TrailMap(map);
}


export function p1pipeline(input: string): number {
    const trailMap = parseInput(input);

    return Array.from(trailMap.findTrailHeadScores().values()).reduce((a, b) => a + b)
}


export function p2pipeline(input: string): number {
    return 2;
}

function part1(): number {
    return p1pipeline(readPuzzleInput(10));
}

function part2(): number {
    return p2pipeline(readPuzzleInput(10));
}

const day10: Solution = {
    part1: part1,
    // part2: part2
}

export default day10;
