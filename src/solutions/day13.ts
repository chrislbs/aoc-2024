import {readPuzzleInput} from "../utils/files";
import {Solution} from "./solution";
import assert from "node:assert";
import {Location} from "../utils/location";
import {memoize} from "../utils/memoize";
import {Heap} from "typescript-collections";
import {lcm} from "../utils/math";

const PRIZE_POSITION_OFFSET = 10000000000000n;
const A_TOKEN_COST = 3;
const B_TOKEN_COST = 1;

type unitVector = {
    y: number,
    x: number
}

class PathNode {
    location: Location
    aPresses: number
    bPresses: number

    constructor(location: Location, aPresses: number = 0, bPresses: number = 0) {
        this.location = location;
        this.aPresses = aPresses;
        this.bPresses = bPresses;
    }

    /**
     * What is the current cost to get to our current location
     */
    actualCost(): number {
        return this.aPresses * A_TOKEN_COST + this.bPresses * B_TOKEN_COST
    }

    /**
     * What would be the cheapest possible cost to get from current location to prize loc?
     */
    cheapestPossibleCost(prizeLoc: Location, buttonA: unitVector, buttonB: unitVector): number {
        const [yDist, xDist] = prizeLoc.manhattanDistance(this.location)

        if(yDist < 0 || xDist < 0) {
            return Number.MAX_SAFE_INTEGER;
        }

        let minYMovements = Math.min(
            Math.ceil(yDist / buttonA.y),
            Math.ceil(yDist / buttonB.y));

        let minXMovements = Math.min(
            Math.ceil(xDist / buttonA.x),
            Math.ceil(xDist / buttonB.x));

        return Math.min(A_TOKEN_COST, B_TOKEN_COST) * Math.max(minXMovements, minYMovements);
    }

    /**
     * What is the cheapest cost estimate to get to the prize location given our current location
     */
    cheapestCostEstimate(prizeLoc: Location, buttonA: unitVector, buttonB: unitVector): number {
        const cheapestCost = this.cheapestPossibleCost(prizeLoc, buttonA, buttonB);
        if(cheapestCost === Number.MAX_SAFE_INTEGER) {
            return Number.MAX_SAFE_INTEGER;
        }
        return cheapestCost + this.actualCost()
    }
}

class ClawMachine {
    buttonA: unitVector
    buttonB: unitVector
    prizeLoc: Location
    prizeOffset: bigint

    constructor(buttonA: unitVector, buttonB: unitVector, prizeLoc: Location, prizeOffset: bigint = 0n) {
        this.buttonA = buttonA;
        this.buttonB = buttonB;
        this.prizeLoc = prizeLoc;
        this.prizeOffset = prizeOffset;
    }

    private bigPriceLoc() : {x: bigint, y:bigint} {
        return {
            x: this.prizeOffset + BigInt(this.prizeLoc.x),
            y: this.prizeOffset + BigInt(this.prizeLoc.y),
        }
    }

    solveSystemOfEquations(): bigint | undefined {
        // Button A: X+94, Y+34
        // Button B: X+22, Y+67
        // Prize: X=8400, Y=5400
        // 94A + 22B = 8400 -- xEquation
        // 34A + 67B = 5400 -- yEquation

        // just use elimination of A variable after solving for lcm
        const aLCM = lcm(this.buttonA.x, this.buttonA.y);

        const xEquationMultiple = aLCM / this.buttonA.x
        const yEquationMultiple = aLCM / this.buttonA.y

        const bigLocation = this.bigPriceLoc();
        const bCoefficient = BigInt(xEquationMultiple * this.buttonB.x - yEquationMultiple * this.buttonB.y);
        let rhs = BigInt(xEquationMultiple) * bigLocation.x - BigInt(yEquationMultiple) * bigLocation.y;

        if(bCoefficient === 0n) {
            if(rhs === 0n) {
                // same line, just use whichever gets there the cheapest
                const aPresses = bigLocation.x / BigInt(this.buttonA.x);
                const bPresses = bigLocation.x / BigInt(this.buttonB.x);

                const aCost = aPresses * BigInt(A_TOKEN_COST);
                const bCost = bPresses * BigInt(B_TOKEN_COST);
                return aCost < bCost ? aCost : bCost;
            } else {
                // parallel lines if no solution
                return undefined;
            }
        }
        // solution doesn't involve an integer, can't be a fractional button press
        if(rhs % bCoefficient !== 0n) {
            return undefined;
        }
        const bPresses = rhs / bCoefficient;

        // solve the x equations for a
        rhs = bigLocation.x - (bPresses * BigInt(this.buttonB.x))
        // solution doesn't involve an integer, can't be a fractional button press
        if(rhs % BigInt(this.buttonA.x) !== 0n) {
            return undefined;
        }
        const aPresses = rhs / BigInt(this.buttonA.x);

        return aPresses * BigInt(A_TOKEN_COST) + bPresses * BigInt(B_TOKEN_COST);
    }

    cheapestPrizePathSoe(): bigint | undefined {
        return this.solveSystemOfEquations()
    }

    // I had to do A*. I got baited by:
    // You wonder: what is the smallest number of tokens you would have to spend to win as many prizes as possible?
    // This solution took 9s on P1 LOL
    cheapestPrizePathGraph() {
        const createLocation = memoize((x: number, y: number) => new Location(x, y))
        // cache the original loc
        this.prizeLoc = createLocation(this.prizeLoc.x, this.prizeLoc.y);
        const scoredPaths = new Map<Location, number>();

        const pathsToCheck = new Heap<PathNode>((lhs, rhs) => {
            const lhsCheapest = lhs.cheapestCostEstimate(this.prizeLoc, this.buttonA, this.buttonB);
            const rhsCheapest = rhs.cheapestCostEstimate(this.prizeLoc, this.buttonA, this.buttonB);
            return lhsCheapest - rhsCheapest;
        });

        const startNode = new PathNode(createLocation(0, 0));
        pathsToCheck.add(startNode);
        while (pathsToCheck.size() > 0) {
            const curPath = pathsToCheck.removeRoot()!

            // at this point, we should have explored the chepeast possible way to get here
            if (curPath.location === this.prizeLoc) {
                return curPath.actualCost();
            }

            // if we've been here before, but it was more costly, no longer need to go down this path
            if (scoredPaths.has(curPath.location) && scoredPaths.get(curPath.location)! <= curPath.actualCost()) {
                continue
            }

            scoredPaths.set(curPath.location, curPath.actualCost());

            const aLocation = createLocation(
                curPath.location.x + this.buttonA.x,
                curPath.location.y + this.buttonA.y);
            const bLocation = createLocation(
                curPath.location.x + this.buttonB.x,
                curPath.location.y + this.buttonB.y);

            const aPath = new PathNode(aLocation, curPath.aPresses + 1, curPath.bPresses);
            const bPath = new PathNode(bLocation, curPath.aPresses, curPath.bPresses + 1);

            let aCheapest = aPath.cheapestCostEstimate(this.prizeLoc, this.buttonA, this.buttonB);
            let bCheapest = bPath.cheapestCostEstimate(this.prizeLoc, this.buttonA, this.buttonB);

            if (aCheapest < Number.MAX_SAFE_INTEGER) {
                pathsToCheck.add(aPath);
            }
            if (bCheapest < Number.MAX_SAFE_INTEGER) {
                pathsToCheck.add(bPath);
            }
        }
        return undefined
    }
}

function parseMachine(input: string, prizeOffset?: bigint): ClawMachine {
    const lines = input.split("\n");
    assert(lines.length === 3);
    const buttonARegex = /Button A:\s+X[+](\d+),\s+Y[+](\d+)/;
    const buttonBRegex = /Button B:\s+X[+](\d+),\s+Y[+](\d+)/;
    const prizeRegex = /Prize:\s+X=(\d+),\s+Y=(\d+)/;

    const buttonAMatches = buttonARegex.exec(lines[0]);
    assert(buttonAMatches?.length == 3);
    const buttonBMatches = buttonBRegex.exec(lines[1]);
    assert(buttonBMatches?.length == 3);
    const prizeMatches = prizeRegex.exec(lines[2]);
    assert(prizeMatches?.length == 3);

    return new ClawMachine(
        { x: parseInt(buttonAMatches[1]), y: parseInt(buttonAMatches[2]) },
        { x: parseInt(buttonBMatches[1]), y: parseInt(buttonBMatches[2]) },
        new Location(parseInt(prizeMatches[1]), parseInt(prizeMatches[2])),
        prizeOffset
    )
}

export function parseInput(input: string, prizeOffset?: bigint): ClawMachine[] {
    const machineDefinitions = input.trim().split("\n\n");

    return machineDefinitions.map(machineDef => parseMachine(machineDef, prizeOffset))
}


export function p1pipeline(input: string): bigint {
    const machines = parseInput(input);
    const machineResults = machines.map(machine => machine.cheapestPrizePathSoe());
    return machineResults.filter(c => c !== undefined).reduce((a, b) => a + b)!
}


export function p2pipeline(input: string): bigint {
    const machines = parseInput(input, PRIZE_POSITION_OFFSET);
    const machineResults = machines.map(machine => machine.cheapestPrizePathSoe());
    return machineResults.filter(c => c !== undefined).reduce((a, b) => a + b)!
}

function part1(): bigint {
    return p1pipeline(readPuzzleInput(13));
}

function part2(): bigint {
    return p2pipeline(readPuzzleInput(13));
}

const day13: Solution = {
    part1: part1,
    part2: part2
}

export default day13;
