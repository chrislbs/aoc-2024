import {readPuzzleInput} from "../utils/files";
import {Solution} from "./solution";
import {Grid, Location} from "../utils/location";
import {getDirectionString, getUnitVector, isUpOrDown, manhattanDirection} from "../utils/manhattan-direction";
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

    sides(grid: Grid<string>) {
        // every wall we walk into in a particular direction
        // if going up/down, we want to capture the x coord, going right/left capture the y coord
        const collidedWalls = new Map<string, Location[]>();
        const toWallKey = (dir: manhattanDirection, partialCoord: number) => {
            return `${getDirectionString(dir)}-${partialCoord}`
        }
        const visitedLocations = new Set<Location>();

        let numSides= 0;
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
                    let coord;
                    if(isUpOrDown(dir)) {
                        coord = curLocation.y;
                    } else {
                        coord = curLocation.x;
                    }
                    const key = toWallKey(dir, coord);
                    const collidedLocations = collidedWalls.get(key) || [];
                    collidedLocations.push(nextLoc);
                    collidedWalls.set(key, collidedLocations);

                    continue
                }
                if(visitedLocations.has(nextLoc)) {
                    continue
                }
                locationsToVisit.push(nextLoc);
            }
        }

        for(let [key, locations] of collidedWalls.entries()) {
            let dir = key.split("-")[0]
            let wasBlockedUp;
            if(dir === "^" || dir === "v") {
                wasBlockedUp = true;
            } else {
                wasBlockedUp = false;
            }

            const coords = locations.sort((a, b) => {
                if(wasBlockedUp) {
                    return a.x - b.x;
                } else {
                    return a.y - b.y;
                }
            }).map(loc => {
                if(wasBlockedUp) {
                    return loc.x;
                } else {
                    return loc.y;
                }
            })

            let lastCoord: number | undefined;
            for(let i = 0; i < coords.length; i++) {
                const coord = coords[i];
                if(lastCoord === undefined) {
                    numSides++;
                } else if(coord - 1 !== lastCoord) {
                    // there was a gap, so this must be a new section
                    numSides++;
                }

                lastCoord = coord;
            }
        }

        return numSides;
    }

    cost(grid: Grid<string>) {
        return this.area() * this.perimeter(grid)
    }

    discountCost(grid: Grid<string>) {
        return this.area() * this.sides(grid)
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
    const garden = parseInput(input);
    return garden.regions.reduce((a, b) => a + b.discountCost(garden.grid), 0);
}

function part1(): number {
    return p1pipeline(readPuzzleInput(12));
}

function part2(): number {
    return p2pipeline(readPuzzleInput(12));
}

const day12: Solution = {
    part1: part1,
    part2: part2
}

export default day12;
