import {readPuzzleInput} from "../utils/files";
import {Solution} from "./solution";

export function parseInput(input: string) {
}


export function p1pipeline(input: string): number {
    return 1;
}


export function p2pipeline(input: string): number {
    return 2;
}

function part1(): number {
    return p1pipeline(readPuzzleInput(0));
}

function part2(): number {
    return p2pipeline(readPuzzleInput(0));
}

const day0: Solution = {
    part1: part1,
    part2: part2
}

export default day0;
