import {Solution} from "./solution";
import {readPuzzleInput} from "../utils/files";
import assert from "node:assert";

const mulRegex = /mul\(\d+,\d+\)/g;
const doRegex = /do\(\)/g;
const dontRegex = /don't\(\)/g;

export const allInstructions = [mulRegex, doRegex, dontRegex];

export function parseInstructions(input: string, instructionRegexes: RegExp[]): string[] {
    const combinedRe = new RegExp(instructionRegexes.map(re => re.source).join("|"), "g");
    const matches = input.match(combinedRe);
    assert(matches !== null);

    return matches.map(x => x);
}

function runMultiInstruction(instruction: string): number {
    const [lhs, rhs] = instruction.replace("mul(", "").replace(")", "").split(",").map(x => parseInt(x, 10));
    return lhs * rhs;
}

export function parseInputP1(input: string): number[] {
    const matches = input.match(mulRegex);
    assert(matches !== null);

    const results = new Array<number>(matches.length);
    for(let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const result = runMultiInstruction(match);

        results[i] = result;
    }

    return results;
}

function part1(): number {
    return parseInputP1(readPuzzleInput(3))
        .reduce((total, val) => total + val, 0);
}

export function p2pipeline(input: string): number {
    const instructions = parseInstructions(input, allInstructions);

    let mulEnabled = true;
    let total = 0;
    for(let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i];

        if(instruction.match(mulRegex)) {
            if(mulEnabled) {
                total += runMultiInstruction(instruction);
            }
        } else if (instruction.match(doRegex)) {
            mulEnabled = true;
        } else if (instruction.match(dontRegex)) {
            mulEnabled = false;
        }
    }

    return total;
}

function part2(): number {
    return p2pipeline(readPuzzleInput(3));
}

const day3: Solution = {
    part1: part1,
    // part2: part2
}

export default day3;