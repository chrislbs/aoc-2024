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


    private fillOutsideIter(grid: Grid<string>, curLocation: Location, visitedLocations: Set<Location>) {

        let perimeterSum = 0;
        const locationsToVisit = new Stack<Location>();
        locationsToVisit.add(curLocation);
        while(!locationsToVisit.isEmpty()) {
            curLocation = locationsToVisit.pop()!
            if(visitedLocations.has(curLocation)) {
                continue;
            }
            visitedLocations.add(curLocation);
            for (let dir = manhattanDirection.UP; dir < 4; dir++) {
                const nextLoc = grid.getNextLocation(curLocation, dir);

                if(nextLoc === undefined || visitedLocations.has(nextLoc)) {
                    continue
                }

                if(this.locations.has(nextLoc)) {
                    // if we can't move a direction from the outside it's because there is a "wall" there
                    perimeterSum++;
                } else {
                    locationsToVisit.push(nextLoc);
                }
            }
        }

        return perimeterSum;
    }

    private fillInsideIter(grid: Grid<string>, curLocation: Location, visitedLocations: Set<Location>) {

        let perimeterSum = 0;

        const locationsToVisit = new Stack<Location>();
        locationsToVisit.add(curLocation);

        while (!locationsToVisit.isEmpty()) {
            const curLocation = locationsToVisit.pop()!;
            if (visitedLocations.has(curLocation)) {
                continue;
            }
            visitedLocations.add(curLocation);
            for (let dir = manhattanDirection.UP; dir < 4; dir++) {
                const nextLoc = grid.getNextLocation(curLocation, dir);

                if (nextLoc === undefined || visitedLocations.has(nextLoc)) {
                    continue
                }

                if (this.locations.has(nextLoc)) {
                    // if we can't move a direction from the outside it's because there is a "wall" there
                    perimeterSum++;
                } else {
                    locationsToVisit.push(nextLoc);
                }
            }
        }


        return perimeterSum;
    }

    area() {
        return this.locations.size;
    }

    perimeter(grid: Grid<string>) {
        const visitedLocations = new Set<Location>();
        // const outsidePerimeter = this.fillOutside(grid, grid.getLocation(0, 0)!, visitedLocations);
        const outsidePerimeter = this.fillOutsideIter(grid, grid.getLocation(0, 0)!, visitedLocations);

        const innerLocations = new Set<Location>();
        for(let y = 0; y < grid.height; y++) {
            for(let x = 0; x < grid.width; x++) {
                const loc = grid.getLocation(y, x)!;
                if(!visitedLocations.has(loc) && !this.locations.has(loc)) {
                    innerLocations.add(loc);
                }
            }
        }

        let innerPerimeter = 0;
        while(innerLocations.size != 0) {
            const curLoc = innerLocations.values().next().value!;
            innerLocations.delete(curLoc);
            // innerPerimeter += this.fillInside(grid, curLoc, innerLocations, visitedLocations);
            innerPerimeter += this.fillInsideIter(grid, curLoc, visitedLocations);

        }
        return outsidePerimeter + innerPerimeter;
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
