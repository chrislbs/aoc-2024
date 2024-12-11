import {readPuzzleInput} from "../utils/files";
import {Solution} from "./solution";
import assert from "node:assert";


type StoneNode = {
    engraving: number;
    prevStone?: StoneNode;
    nextStone?: StoneNode;

}

class Stones {
    private headStone: StoneNode
    // 0 => 1
    // even number of digits 10, 1000, 100000 -> 2 stones
    //      left stone gets first half of digits, right stone 2nd half
    //      don't maintain leading 0's
    //      can do log base 10 to get number of 0's
    // if none of these, reaplce with new stone and multiplie original by 2024
    constructor(engravings: number[]) {
        assert(engravings.length > 0);

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

    blink() {

        let curStone: StoneNode | undefined = this.headStone;
        while(curStone !== undefined) {

            const engravingDigits = Math.floor(Math.log10(curStone.engraving) + 1);

            if(curStone.engraving === 0) {
                curStone.engraving = 1;
            } else if (engravingDigits % 2 === 0) {
                const splitLeftStone: StoneNode = {
                    engraving: Math.floor(curStone.engraving / (Math.pow(10, engravingDigits / 2))),
                    prevStone : curStone.prevStone,
                    nextStone: curStone
                }
                if(splitLeftStone.prevStone !== undefined) {
                    splitLeftStone.prevStone.nextStone = splitLeftStone
                } else {
                    // the split left will become the new head
                    this.headStone = splitLeftStone;
                }

                curStone.prevStone = splitLeftStone;
                curStone.engraving = curStone.engraving % Math.pow(10, engravingDigits / 2);
            } else {
                curStone.engraving *= 2024
            }

            curStone = curStone.nextStone
        }
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

    const blinkCount = 25;
    for (let i = 0; i < blinkCount; i++) {
        stones.blink()
    }
    return stones.count();
}


export function p2pipeline(input: string): number {
    return 2;
}

function part1(): number {
    return p1pipeline(readPuzzleInput(11));
}

function part2(): number {
    return p2pipeline(readPuzzleInput(11));
}

const day11: Solution = {
    part1: part1,
    // part2: part2
}

export default day11;
