import {Solution} from "./solution";
import {readPuzzleInput} from "../utils/files";

type safetyProtocols = {
    pageRules: Map<number, number[]>
    pageUpdates: number[][]
}

export function parseInput(input: string) : safetyProtocols {
    const lines = input.trim().split("\n");

    const pageRules = new Map<number, number[]>();
    let lineNum = 0;
    while(lineNum < lines.length) {
        const line = lines[lineNum];
        if(line.trim() === "") {
            lineNum++;
            break;
        }
        const [before, after] = line.split("|").map(num => parseInt(num));

        const numbersAfter = pageRules.get(before) || [];
        numbersAfter.push(after);
        pageRules.set(before, numbersAfter);

        lineNum++;
    }

    const pageUpdates = lines.slice(lineNum).map(line => line.split(",").map(num => parseInt(num)));

    return {
        pageRules: pageRules,
        pageUpdates: pageUpdates
    }
}

function validOrdering(printedPages: Set<number>, requiredPagesAfter: number[]): boolean {
    for(let i = 0; i < requiredPagesAfter.length; i++) {
        const page = requiredPagesAfter[i];
        if(printedPages.has(page)) {
            return false;
        }
    }
    return true;
}

export function p1pipeline(input: string): number {
    const protocols = parseInput(input);
    const pageRules = protocols.pageRules;

    let sumMiddlePages = 0;
    for(let i = 0; i < protocols.pageUpdates.length; i++) {
        const pageNumbers = protocols.pageUpdates[i];

        const printedPages = new Set<number>();
        let validPageOrdering = true;
        for(let j = 0; j < pageNumbers.length; j++) {
            const page = pageNumbers[j];
            const requiredPagesAfter = pageRules.get(page) || [];
            if(requiredPagesAfter.length > 0 && !validOrdering(printedPages, requiredPagesAfter)) {
                validPageOrdering = false;
                break;
            }
            printedPages.add(page);
        }
        if(!validPageOrdering) {
            continue;
        }
        // OOF
        const middleIndex = Math.floor(pageNumbers.length/2)
        const middlePage = pageNumbers[middleIndex];
        sumMiddlePages += middlePage;
    }

    return sumMiddlePages;
}


export function p2pipeline(input: string): number {
    return 1
}


function part1(): number {
    return p1pipeline(readPuzzleInput(5));
}

function part2(): number {
    return p2pipeline(readPuzzleInput(5));
}

const day5: Solution = {
    part1: part1,
    // part2: part2
}

export default day5;