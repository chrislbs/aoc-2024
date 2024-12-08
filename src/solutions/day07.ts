import {readPuzzleInput} from "../utils/files";
import {Solution} from "./solution";

enum Operators {
    ADD,
    MULTI,
    COMBINE
}

const AllOperators= [
    (a: number, b: number) => a + b,
    (a: number, b: number) => a * b,
    (a: number, b: number) => parseInt(a.toString(10) + b.toString(10))
]

type operator = (a: number, b: number) => number;

export class Equation {
    expectedResult: number;
    operands: number[];

    constructor(operands: number[], expectedResult: number) {
        this.operands = operands;
        this.expectedResult = expectedResult;
    }

    hasValidCalibration(accumResult: number, operandIndex: number, operatorFuncs: operator[]): boolean {

        if (operandIndex === this.operands.length) {
            return accumResult === this.expectedResult;
        }

        const nextOperand = this.operands[operandIndex];
        for (let op = Operators.ADD; op < operatorFuncs.length; op++) {
            const opFunc = operatorFuncs[op];

            let result = opFunc(accumResult, nextOperand);
            if (result > this.expectedResult) {
                continue;
            }
            if (this.hasValidCalibration(result, operandIndex + 1, operatorFuncs)) {
                return true;
            }
        }
        return false;
    }
}

export function parseInput(input: string) : Equation[] {
    const lines = input.trim().split("\n");
    const equations = new Array<Equation>(lines.length);

    for(let i = 0; i < equations.length; i++){
        const [resultStr, operandsStr] = lines[i].split(":");
        const result = parseInt(resultStr);
        const operands = operandsStr.trim().split(/\s+/).map(x => parseInt(x));

        equations[i] = new Equation(operands, result);
    }
    return equations;
}

function pipeline(input: string, operatorFuncs: operator[]): number {
    const equations = parseInput(input);


    let totalCalibrationResult = 0;
    for(let i = 0; i < equations.length; i++){
        let equation = equations[i];

        if(equation.hasValidCalibration(equation.operands[0], 1, operatorFuncs)) {
            totalCalibrationResult += equation.expectedResult;
        }
    }

    return Number(totalCalibrationResult);
}

export function p1pipeline(input: string): number {
    const operatorFuncs = [
        AllOperators[Operators.ADD],
        AllOperators[Operators.MULTI],
    ];
    return pipeline(input, operatorFuncs);
}


export function p2pipeline(input: string): number {
    const operatorFuncs = [
        AllOperators[Operators.ADD],
        AllOperators[Operators.MULTI],
        AllOperators[Operators.COMBINE],
    ];
    return pipeline(input, operatorFuncs);
}

function part1(): number {
    return p1pipeline(readPuzzleInput(7));
}

function part2(): number {
    return p2pipeline(readPuzzleInput(7));
}

const day7: Solution = {
    part1: part1,
    part2: part2
}

export default day7;
