import {readPuzzleInput} from "../utils/files";
import {Solution} from "./solution";
import {Grid, Location} from "../utils/location";
import {getUnitVector, manhattanDirection} from "../utils/manhattan-direction";
import {Stack} from "typescript-collections";

class Garden {
    grid: Grid<string>
    regions: Region[]

    constructor(grid: Grid<string>, regions: Region[]) {
        this.grid = grid
        this.regions = regions;
    }
}

class Region {
    plant: string
    locations: Set<Location>

    constructor(plant: string, locations: Set<Location>) {
        this.plant = plant;
        this.locations = locations
    }

    area() {
        return this.locations.size;
    }

    perimeter(grid: Grid<string>) {
        const visitedLocations = new Set<Location>();

        let perimeterSum = 0;
        const locationsToVisit = new Stack<Location>();
        const startingLocation= this.locations.values().next().value!;
        locationsToVisit.add(startingLocation);
        while(!locationsToVisit.isEmpty()) {
            const curLocation = locationsToVisit.pop()!
            if(visitedLocations.has(curLocation)) {
                continue;
            }
            visitedLocations.add(curLocation);
            for (let dir = manhattanDirection.UP; dir < 4; dir++) {
                const nextLoc = grid.getNextLocation(curLocation, dir)!;

                if(!this.locations.has(nextLoc)) {
                    perimeterSum++;
                    continue
                }
                if(visitedLocations.has(nextLoc)) {
                    continue
                }
                locationsToVisit.push(nextLoc);
            }
        }

        return perimeterSum;
    }

    cost(grid: Grid<string>) {
        return this.area() * this.perimeter(grid)
    }
}


export function parseInput(input: string): Garden {
    const inputGrid = input.trim().split("\n").map(line => {
        let plants = line.split("")
        plants.unshift(".");
        plants.push(".")
        return plants;
    });
    const width = inputGrid[0].length;
    inputGrid.unshift(Array(width).fill("."));
    inputGrid.push(Array(width).fill("."));
    // make the grid bigger by 1 on all sides to simplify flood fill


    const grid = new Grid(inputGrid);
    const visitedLocations = new Set<Location>();
    const regions = new Array<Region>();
    for(let y = 0; y < grid.height; y++) {
        for(let x = 0; x < grid.width; x++) {
            const curLoc = grid.getLocation(y, x)!
            const plant = grid.getAtLoc(curLoc);

            if(plant === ".") {
                visitedLocations.add(curLoc);
            } else if(!visitedLocations.has(curLoc)) {
                const regionLocations = new Set<Location>();
                regionLocations.add(curLoc);
                fillRegion(grid, curLoc, plant, regionLocations);
                regionLocations.forEach(loc => visitedLocations.add(loc));

                regions.push(new Region(plant, regionLocations));
            }
        }
    }
    return new Garden(grid, regions);
}

function fillRegion(grid: Grid<string>, curLocation: Location, plant: string, regionLocations: Set<Location>) {
    if(grid.getAtLoc(curLocation) === plant) {
        regionLocations.add(curLocation);

        for (let dir = manhattanDirection.UP; dir < 4; dir++) {
            const nextLocation = grid.getNextLocation(curLocation, dir);
            if(nextLocation === undefined ||
                regionLocations.has(nextLocation) ||
                grid.getAtLoc(nextLocation) !== plant) {
                continue
            }

            fillRegion(grid, nextLocation, plant, regionLocations);
        }
    }
}

export function p1pipeline(input: string): number {
    const garden = parseInput(input);
    return garden.regions.reduce((a, b) => a + b.cost(garden.grid), 0);
}


export function p2pipeline(input: string): number {
    return 2;
}

function part1(): number {
    return p1pipeline(readPuzzleInput(12));
}

function part2(): number {
    return p2pipeline(readPuzzleInput(12));
}

const day12: Solution = {
    part1: part1,
    // part2: part2
}

export default day12;
