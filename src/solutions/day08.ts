import {readPuzzleInput} from "../utils/files";
import {Solution} from "./solution";
import {createCachedGridLocationFactory, Location, LocationFactory} from "../utils/location";
import {Combination} from "js-combinatorics";

function isAlphaNumeric(str: string): boolean {
    let code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
}

class AntennaMap {
    map: string[][];
    createLocation: LocationFactory;
    antennaLocations: Map<string, Set<Location>>;

    constructor(map: string[][]) {
        this.map = map;
        this.createLocation = createCachedGridLocationFactory(map.length, map[0].length);
        this.antennaLocations = new Map<string, Set<Location>>();
        for(let y = 0; y < this.map.length; y++) {
            for(let x = 0; x < this.map[y].length; x++) {
                const mapChar = this.map[y][x];
                if(isAlphaNumeric(mapChar)) {
                    const locations = this.antennaLocations.get(mapChar) || new Set<Location>();
                    const location = this.createLocation(y, x);
                    locations.add(location);

                    this.antennaLocations.set(mapChar, locations);
                }
            }
        }
    }

    inBounds(y: number, x:number) {
        return y >= 0 && y < this.map.length && x >= 0 && x < this.map[y].length;
    }

    findAllAntiNodes() : Set<Location> {
        const antiNodeLocations = new Set<Location>();

        for(let antennaKey of this.antennaLocations.keys()) {
            const antennas = Array.from(this.antennaLocations.get(antennaKey)!.values());

            // need every combination of 2 pairs to calculate antinodes
            const antennaCombos = new Combination(antennas, 2);
            for(let combo of antennaCombos) {
                const loc1 = combo[0];
                const loc2 = combo[1];
                const dist = loc1.manhattanDistance(loc2);

                // add to l1, subtract from l2
                const antiNode1Coords = [loc1.y + dist[0], loc1.x + dist[1]];
                if(this.inBounds(antiNode1Coords[0], antiNode1Coords[1])) {
                    antiNodeLocations.add(this.createLocation(antiNode1Coords[0], antiNode1Coords[1]));
                }

                const antiNode2Coords = [loc2.y - dist[0], loc2.x - dist[1]];
                if(this.inBounds(antiNode2Coords[0], antiNode2Coords[1])) {
                    antiNodeLocations.add(this.createLocation(antiNode2Coords[0], antiNode2Coords[1]));
                }
            }
        }

        return antiNodeLocations;
    }
}

export function parseInput(input: string) {
    const map= input.trim().split("\n").map(line => line.split(""));
    return new AntennaMap(map);
}


export function p1pipeline(input: string): number {
    const antiNodes = parseInput(input).findAllAntiNodes();

    return antiNodes.size;
}


export function p2pipeline(input: string): number {
    return 2;
}

function part1(): number {
    return p1pipeline(readPuzzleInput(8));
}

function part2(): number {
    return p2pipeline(readPuzzleInput(8));
}

const day8: Solution = {
    part1: part1,
    // part2: part2
}

export default day8;
