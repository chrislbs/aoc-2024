import {readPuzzleInput} from "../utils/files";
import {Solution} from "./solution";
import assert from "node:assert";


type StoneNode = {
    engraving: number;
    prevStone?: StoneNode;
    nextStone?: StoneNode;

}

class Stones {
    engravings: number[]
    private headStone: StoneNode
    // 0 => 1
    // even number of digits 10, 1000, 100000 -> 2 stones
    //      left stone gets first half of digits, right stone 2nd half
    //      don't maintain leading 0's
    //      can do log base 10 to get number of 0's
    // if none of these, reaplce with new stone and multiplie original by 2024
    constructor(engravings: number[]) {
        assert(engravings.length > 0);
        this.engravings = engravings

        this.headStone = {
            engraving: engravings[0]
        }
        let prevStone = this.headStone
        for(let i = 1; i < engravings.length; i++) {
            const engraving = engravings[i];

            const stone: StoneNode = {
                engraving: engraving
            }

            stone.prevStone = prevStone
            stone.prevStone!.nextStone = stone
            prevStone = stone;
        }
    }

    stonesProduced(engraving: number, blinkDepth: number, maxDepth: number, generatedStonesCounts: Map<string, number>) {

        const depthKey = this.depthKey(engraving, blinkDepth);
        if(generatedStonesCounts.has(depthKey)) {
            return generatedStonesCounts.get(depthKey)!;
        }
        if(blinkDepth == maxDepth) {
            return 1;
        }

        const engravingDigits = Math.floor(Math.log10(engraving) + 1);

        let engravingCount = 0;
        if(engraving === 0) {
            engravingCount = this.stonesProduced(1, blinkDepth + 1, maxDepth, generatedStonesCounts);
        } else if (engravingDigits % 2 === 0) {
            const lhs = Math.floor(engraving / (Math.pow(10, engravingDigits / 2)))
            const rhs = engraving % Math.pow(10, engravingDigits / 2);
            engravingCount = this.stonesProduced(lhs, blinkDepth + 1, maxDepth, generatedStonesCounts) + this.stonesProduced(rhs, blinkDepth + 1, maxDepth, generatedStonesCounts);
        } else {
            const nextEngraving = engraving * 2024
            engravingCount = this.stonesProduced(nextEngraving, blinkDepth + 1, maxDepth, generatedStonesCounts);
        }
        generatedStonesCounts.set(depthKey, engravingCount);
        return engravingCount;
    }

    depthKey(engraving: number, blinkDepth: number) {
        return `${blinkDepth}:${engraving}`;
    }

    render(): string {
        let output = ""
        let curStone: StoneNode | undefined = this.headStone;
        while(curStone !== undefined) {
            output += `${curStone.engraving} `;
            curStone = curStone.nextStone;
        }
        return output;
    }

    // TODO: we could easily maintain count as we do this?
    count(): number {
        let count = 0
        let curStone: StoneNode | undefined = this.headStone;
        while(curStone !== undefined) {
            count += 1;
            curStone = curStone.nextStone;
        }
        return count;
    }
}

export function parseInput(input: string) {
    const stoneEngravings = input.trim().split(" ").map(x => parseInt(x, 10));

    return new Stones(stoneEngravings);
}


export function p1pipeline(input: string): number {
    const stones = parseInput(input);

    const engravings = stones.engravings;
    const engravingDepthToStoneCount = new Map<string, number>();
    const blinkCount = 25;

    return engravings.reduce((acc, engraving) => {
        return acc + stones.stonesProduced(engraving, 0, blinkCount, engravingDepthToStoneCount)
    }, 0)
}


export function p2pipeline(input: string): number {
    const stones = parseInput(input);

    const engravings = stones.engravings;
    const engravingDepthToStoneCount = new Map<string, number>();
    const blinkCount = 75;

    return engravings.reduce((acc, engraving) => {
        return acc + stones.stonesProduced(engraving, 0, blinkCount, engravingDepthToStoneCount)
    }, 0)
}

function part1(): number {
    return p1pipeline(readPuzzleInput(11));
}

function part2(): number {
    return p2pipeline(readPuzzleInput(11));
}

const day11: Solution = {
    part1: part1,
    part2: part2
}

export default day11;
