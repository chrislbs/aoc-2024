import {Solution} from "./solution";
import {readPuzzleInput} from "../utils/files";

function parseInput(input: string): number[][] {
    return input
        .split("\n")
        .filter(x => x)
        .map((line) => line.split(" "))
        .map(levels => levels.map(lvl => parseInt(lvl, 10)));
}

function isReportSafe(levels: number[]): boolean {

    const increasing = levels[0] < levels[1];
    for (let i = 0; i < levels.length - 1; i++) {

        const diff = levels[i + 1] - levels[i];
        const safeGradient= Math.abs(diff) >= 1 && Math.abs(diff) <= 3
        const sameDirection = increasing ? diff > 0 : diff < 0;

        if(!safeGradient || !sameDirection) {
            return false;
        }
    }

    return true;
}

function p2IsReportSafe(levels: number[]) : boolean {
    if(isReportSafe(levels)) {
        return true;
    }

    for(let i = 0; i < levels.length; i++) {
        const clonedLevels = [...levels];
        clonedLevels.splice(i, 1);
        if(isReportSafe(clonedLevels)) {
            return true;
        }
    }

    return false;
}


export function p1pipeline(input: string): number {
    return parseInput(input)
        .filter(levels => isReportSafe(levels))
        .length
}

function part1(): number {
    return p1pipeline(readPuzzleInput(2));
}

export function p2pipeline(input: string): number {
    return parseInput(input)
        .filter(levels => p2IsReportSafe(levels))
        .length
}

function part2(): number {
    return p2pipeline(readPuzzleInput(2));
}

const day2: Solution = {
    part1: part1,
    part2: part2
}

export default day2;