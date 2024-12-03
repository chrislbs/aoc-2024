import {Solution} from "./solution";
import {readPuzzleInput} from "../utils/files";
import assert from "node:assert";

export function parseInput(input: string): number[][] {
    const matches = input.match(/mul\(\d+,\d+\)/g);
    assert(matches !== null);

    const numPairs = new Array<number[]>(matches.length);
    for(let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const numPair = match.replace("mul(", "")
            .replace(")", "")
            .split(",")
            .map(x => parseInt(x, 10));

        numPairs[i] = numPair;
    }

    return numPairs;
}

function part1(): number {
    return parseInput(readPuzzleInput(3))
        .map(pair => pair[0] * pair[1])
        .reduce((total, val) => total + val, 0);
}

function part2(): number {
    return 1;
}

const day3: Solution = {
    part1: part1,
    // part2: part2
}

export default day3;