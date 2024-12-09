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