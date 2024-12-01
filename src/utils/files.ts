import {readFileSync} from "fs";

export function readPuzzleInput(day: number): string {
    return readFileSync(`./inputs/day${day.toString().padStart(2, "0")}input.txt`, 'utf-8');
}
