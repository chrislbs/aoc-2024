import {Solution} from "./solution";
import {readPuzzleInput} from "../utils/files";

type safetyProtocols = {
    pageRules: Map<number, number[]>
    pageUpdates: number[][]
    pageDependencies: Map<number, number[]>
}

export function parseInput(input: string): safetyProtocols {
    const lines = input.trim().split("\n");

    const pageRules = new Map<number, number[]>();
    const pageDependencies = new Map<number, number[]>();
    let lineNum = 0;
    while (lineNum < lines.length) {
        const line = lines[lineNum];
        if (line.trim() === "") {
            lineNum++;
            break;
        }
        const [before, after] = line.split("|").map(num => parseInt(num));

        const numbersAfter = pageRules.get(before) || [];
        numbersAfter.push(after);
        pageRules.set(before, numbersAfter);

        const dependencies = pageDependencies.get(after) || [];
        dependencies.push(before);
        pageDependencies.set(after, dependencies);

        lineNum++;
    }

    const pageUpdates = lines.slice(lineNum).map(line => line.split(",").map(num => parseInt(num)));

    return {
        pageRules: pageRules,
        pageUpdates: pageUpdates,
        pageDependencies: pageDependencies,
    }
}

function validOrdering(printedPages: Set<number>, requiredPagesAfter: number[]): boolean {
    for (let i = 0; i < requiredPagesAfter.length; i++) {
        const page = requiredPagesAfter[i];
        if (printedPages.has(page)) {
            return false;
        }
    }
    return true;
}

function filterValidPageOrders(protocols: safetyProtocols): { "valid": number[][], "invalid": number[][] } {
    const pageRules = protocols.pageRules;

    let validPageOrders = [] as number[][];
    let invalidPageOrders = [] as number[][];
    for (let i = 0; i < protocols.pageUpdates.length; i++) {
        const pageNumbers = protocols.pageUpdates[i];

        const printedPages = new Set<number>();
        let validPageOrdering = true;
        for (let j = 0; j < pageNumbers.length; j++) {
            const page = pageNumbers[j];
            const requiredPagesAfter = pageRules.get(page) || [];
            if (requiredPagesAfter.length > 0 && !validOrdering(printedPages, requiredPagesAfter)) {
                validPageOrdering = false;
                break;
            }
            printedPages.add(page);
        }
        if (validPageOrdering) {
            validPageOrders.push(pageNumbers)
        } else {
            invalidPageOrders.push(pageNumbers);
        }
    }

    return {
        "valid": validPageOrders,
        "invalid": invalidPageOrders
    }
}

export function p1pipeline(input: string): number {
    const protocols = parseInput(input);

    const {valid} = filterValidPageOrders(protocols);

    let sumMiddlePages = 0;
    for (let i = 0; i < valid.length; i++) {
        const pageNumbers = valid[i];
        // OOF
        const middleIndex = Math.floor(pageNumbers.length / 2)
        const middlePage = pageNumbers[middleIndex];
        sumMiddlePages += middlePage;
    }

    return sumMiddlePages;
}

/**
 * Returns if dependent has a dependency on the search number
 */
function hasDependency(dependencyMap: Map<number, number[]>, dependent: number, search: number): boolean {
    const possibleDependencies = [...(dependencyMap.get(dependent) || [])]
    while (possibleDependencies.length > 0) {
        const dependency = possibleDependencies.pop()!
        if (dependency === search) {
            return true;
        }

        const moreDependencies = [...(dependencyMap.get(dependent) || [])]

        possibleDependencies.concat(moreDependencies);
    }
    return false;
}

export function p2pipeline(input: string): number {
    const protocols = parseInput(input);
    const pageDependencies = protocols.pageDependencies;

    const pageSorter = (a: number, b: number) => {

        let result = 0;
        if (hasDependency(pageDependencies, a, b)) {
            result = 1;
        } else if (hasDependency(pageDependencies, b, a)) {
            result = -1;
        } else {
            result = 0;
        }
        return result;
    }

    const {invalid} = filterValidPageOrders(protocols);

    const orderedInvalidPageLists = new Array<number[]>(invalid.length);
    for (let i = 0; i < invalid.length; i++) {
        const pageNumbers = invalid[i];
        const orderedPageNumbers = pageNumbers.sort(pageSorter);
        orderedInvalidPageLists[i] = orderedPageNumbers;
    }

    let sumMiddlePages = 0;
    for (let i = 0; i < orderedInvalidPageLists.length; i++) {
        const pageNumbers = orderedInvalidPageLists[i];
        // OOF
        const middleIndex = Math.floor(pageNumbers.length / 2)
        const middlePage = pageNumbers[middleIndex];
        sumMiddlePages += middlePage;
    }

    return sumMiddlePages;
}


function part1(): number {
    return p1pipeline(readPuzzleInput(5));
}

function part2(): number {
    return p2pipeline(readPuzzleInput(5));
}

const day5: Solution = {
    part1: part1,
    part2: part2
}

export default day5;