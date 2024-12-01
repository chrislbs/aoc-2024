import {Solution} from "./solution";
import {readPuzzleInput} from "../utils/files";

function parseInput(input: string): [number[], number[]] {
    const parsedNumbers = input
        .split("\n")
        .filter(x => x !== "")
        .map((line) => line.split(/\s+/))
        .filter(numStrs => numStrs.length === 2)
        .map(numStrs => [parseInt(numStrs[0], 10), parseInt(numStrs[1], 10)])
        .reduce((acc: [number[], number[]], currentValue) => {
                acc[0].push(currentValue[0]);
                acc[1].push(currentValue[1]);
                return acc;
            },
            [[] as number[], [] as number[]]);

    parsedNumbers[0].sort();
    parsedNumbers[1].sort();

    return parsedNumbers;
}

function calcDistances(sortedListLocs: [number[], number[]]): number[] {
    const distances = new Array<number>(sortedListLocs[0].length);
    for (let i = 0; i < sortedListLocs[0].length; i++) {
        distances[i] = Math.abs(sortedListLocs[0][i] - sortedListLocs[1][i]);
    }
    return distances;
}

function totalDistance(distances: number[]): number {
    return distances.reduce((total, currentValue) => total + currentValue, 0);
}

export function p1pipeline(input: string): number{
    return totalDistance(calcDistances(parseInput(input)));
}

function part1(): number {
    return p1pipeline(readPuzzleInput(1));
}

function parseInputPart2(input: [number[], number[]]): [number[], Map<number, number>] {
    const numCounts = input[1].reduce(
        (counts, currentValue) => {
            let count = counts.get(currentValue) || 0;
            count += 1;
            counts.set(currentValue, count);
            return counts;
        },
        new Map<number, number>);
    return [input[0], numCounts]
}

function calcSimilarityScore(input: [number[], Map<number, number>]): number {
    const lhs = input[0]
    const rhs = input[1]

    return lhs.reduce((totalSimilarity, currentValue) => {
        const numAppears = rhs.get(currentValue) || 0;
        return totalSimilarity + currentValue * numAppears;
    }, 0);
}

export function p2pipeline(input: string): number {

    let puzzleInput = new Array(input);
    return puzzleInput
        .map(parseInput)
        .map(parseInputPart2)
        .map(calcSimilarityScore)[0];
}

function part2(): number {
    return p2pipeline(readPuzzleInput(1));
}

const day1: Solution = {
    part1: part1,
    part2: part2
}

export default day1;