import {Solution} from "./solution";
import {readPuzzleInput} from "../utils/files";

export function parseInput(input: string): puzzleInput {
    return input.trim().split("\n").map((line) => line.split(""));
}

type puzzleInput = string[][]

type location = {
    x: number;
    y: number;
}

export enum direction {
    N,
    NE,
    E,
    SE,
    S,
    SW,
    W,
    NW
}

const allDirs = [
    direction.N,
    direction.NE,
    direction.E,
    direction.SE,
    direction.S,
    direction.SW,
    direction.W,
    direction.NW,
]

function getRelativeLetter(input: puzzleInput, xLoc: location, mul: number, dir: direction): string | undefined {
    let yOffset: number = 0;
    let xOffset: number = 0;
    switch (dir) {
        case direction.N:
            yOffset = -1;
            break;
        case direction.NE:
            yOffset = -1;
            xOffset = 1;
            break;
        case direction.E:
            xOffset = 1;
            break
        case direction.SE:
            yOffset = 1;
            xOffset = 1;
            break
        case direction.S:
            yOffset = 1;
            break
        case direction.SW:
            yOffset = 1;
            xOffset = -1;
            break
        case direction.W:
            xOffset = -1;
            break
        case direction.NW:
            yOffset = -1;
            xOffset = -1;
            break
    }

    const y = xLoc.y + (mul * yOffset);
    const x = xLoc.x + (mul * xOffset);

    if (y < 0 || y >= input.length) {
        return undefined;
    } else if (x < 0 || x >= input[0].length) {
        return undefined;
    } else {
        return input[y][x]
    }
}

/**
 * Given the location of an X, return all directions that X spells XMAS
 *
 * Brute force it
 */
function xmasLocs(input: puzzleInput, xLoc: location): direction[] {
    const lettersToMatch = ["M", "A", "S"]
    const dirsToSearch = new Set(allDirs);
    for (let i = 0; i < lettersToMatch.length; i++) {
        const letterToMatch = lettersToMatch[i];
        for (let dir of dirsToSearch) {
            if (letterToMatch !== getRelativeLetter(input, xLoc, i + 1, dir)) {
                dirsToSearch.delete(dir);
            }
        }
    }
    return Array.from(dirsToSearch);
}

const validMasXArray = ["M", "M", "S", "S"]

function hasRequiredMasXLetters(input: string[]) {
    return input.length === 4 && input.every((letter, idx) => letter === validMasXArray[idx]);
}

function isMasX(input: puzzleInput, aLoc: location): boolean {
    const nwLetter = getRelativeLetter(input, aLoc, 1, direction.NW);
    const neLetter = getRelativeLetter(input, aLoc, 1, direction.NE);
    const swLetter = getRelativeLetter(input, aLoc, 1, direction.SW);
    const seLetter = getRelativeLetter(input, aLoc, 1, direction.SE);

    if (nwLetter === seLetter || swLetter === neLetter) {
        return false;
    }

    const dirLetters = [nwLetter, neLetter, swLetter, seLetter]
        .filter(l => l === "M" || l === "S")
        .sort();

    return hasRequiredMasXLetters(dirLetters);
}

export function p1pipeline(input: string): number {
    const puzzleInput = parseInput(input);

    let count = 0;
    for (let y = 0; y < puzzleInput.length; y++) {
        for (let x = 0; x < puzzleInput[y].length; x++) {
            if (puzzleInput[y][x] === "X") {
                const xmasDirs = xmasLocs(puzzleInput, {x: x, y: y});
                count += xmasDirs.length;
            }
        }
    }

    return count;
}


export function p2pipeline(input: string): number {
    const puzzleInput = parseInput(input);

    let count = 0;
    for (let y = 0; y < puzzleInput.length; y++) {
        for (let x = 0; x < puzzleInput[y].length; x++) {
            if (puzzleInput[y][x] === "A" && isMasX(puzzleInput, {x: x, y: y})) {
                count += 1
            }
        }
    }

    return count;
}


function part1(): number {
    return p1pipeline(readPuzzleInput(4));
}

function part2(): number {
    return p2pipeline(readPuzzleInput(4));
}

const day4: Solution = {
    part1: part1,
    part2: part2
}

export default day4;