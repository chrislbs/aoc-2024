import {getUnitVector, manhattanDirection} from "./manhattan-direction";

export class Location {
    constructor(public readonly x: number, public readonly y: number) {
    }

    manhattanDistance(other: Location): [y: number, x: number] {
        return [this.y - other.y, this.x - other.x]
    }
}

export type LocationFactory = (y: number, x: number) => Location;

// factory builder for locations so we can use reference equality in Maps/Sets
export function createCachedGridLocationFactory(height: number, width: number): LocationFactory {
    const allLocations = new Array<Location[]>(height);
    for (let y = 0; y < height; y++) {
        const rowLocations = new Array<Location>(width);
        for (let x = 0; x < width; x++) {
            rowLocations[x] = new Location(x, y)
        }
        allLocations[y] = rowLocations;
    }

    return (y: number, x: number) => {
        return allLocations[y][x]
    }
}

export class Grid<T> {

    height: number
    width: number
    private readonly data: T[][];
    private readonly locationFactory: LocationFactory;

    constructor(data: T[][]) {
        this.data = data
        this.height = data.length
        this.width = data[0].length
        this.locationFactory = createCachedGridLocationFactory(data.length, data[0].length);
    }

    getAtLoc(location: Location): T {
        return this.data[location.y][location.x];
    }

    getAt(y: number, x: number): T {
        return this.data[y][x];
    }

    getNextLocation(location: Location, dir: manhattanDirection): Location | undefined {
        const unitVector = getUnitVector(dir)
        const newY = location.y + unitVector[0];
        const newX = location.x + unitVector[1];
        if(newY >= 0 && newY < this.height && newX >= 0 && newX < this.width) {
            return this.locationFactory(newY, newX)
        } else {
            return undefined
        }
    }

    inBounds(y: number, x: number): boolean {
        return y >= 0 && y < this.data.length && x >= 0 && x < this.data[0].length;
    }

    getLocation(y: number, x: number): Location | undefined {
        if(this.inBounds(y, x)) {
            return this.locationFactory(y, x);
        }
        return undefined;
    }
}