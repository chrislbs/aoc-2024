import {readPuzzleInput} from "../utils/files";
import {Solution} from "./solution";
import assert from "node:assert";
import {createCachedGridLocationFactory, Location, LocationFactory} from "../utils/location";
import * as readline from "readline-sync";

class Robot {
    currentPosition: Location
    velocity: [x: number, y: number];

    constructor(
        startingPosition: Location,
        velocity: [x: number, y: number]) {
        this.currentPosition = startingPosition
        this.velocity = velocity;
    }

    positionAfter(numSeconds: number, width: number, height: number) {
        const xOffset = numSeconds * this.velocity[0]
        const yOffset = numSeconds * this.velocity[1]

        let newX = this.currentPosition.x + xOffset;
        let newY = this.currentPosition.y + yOffset;

        newX = ((newX % width) + width) % width;
        newY = ((newY % height) + height) % height;

        return {x: newX, y: newY};
    }
}

export function parseRobot(line: string, locationCreator: LocationFactory): Robot {
    const robotRegex = /p=(\d+),(\d+)\s+v=(-?)(\d+),(-?)(\d+)/;

    const matches = robotRegex.exec(line);
    assert(matches !== null && matches.length === 7);
    const xPos = parseInt(matches[1]);
    const yPos = parseInt(matches[2]);
    const xVelNegative = matches[3] !== "";
    const xVel = parseInt(matches[4]) * (xVelNegative ? -1 : 1);
    const yVelNegative = matches[5] !== "";
    const yVel = parseInt(matches[6]) * (yVelNegative ? -1 : 1);

    return new Robot(locationCreator(yPos, xPos), [xVel, yVel])
}

export function parseInput(input: string, locationFactory: LocationFactory): Robot[] {
    return input.trim().split("\n").map(l => parseRobot(l, locationFactory));
}

class Quadrant {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;

    constructor(xMin: number, width: number, yMin: number, height: number) {
        this.xMin = xMin;
        this.xMax = xMin + width;
        this.yMin = yMin;
        this.yMax = yMin + height;
    }

    contains(loc: Location): boolean {
        return loc.x >= this.xMin && loc.x < this.xMax &&
            loc.y >= this.yMin && loc.y < this.yMax;
    }
}

function getQuadrants(width: number, height: number): Quadrant[] {
    assert(width % 2 !== 0 && height % 2 !== 0);
    const quadrants: Quadrant[] = [];
    const quadWidth = Math.floor(width / 2);
    const quadHeight = Math.floor(height / 2);
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            quadrants.push(new Quadrant(
                quadWidth * i + i,
                quadWidth,
                quadHeight * j + j,
                quadHeight
            ))
        }
    }
    return quadrants;
}

function getRender(robotLocations: Map<Robot, Location>, width: number, height: number): string {
    let output = "";
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let robotCount = 0;
            for (let [robot, location] of robotLocations.entries()) {
                if (location.x == x && location.y == y) {
                    robotCount++;
                }
            }
            if (robotCount > 0) {
                output += `+`;
            } else {
                output += "."
            }
        }
        output += "\n";
    }
    return output;
}

function* iteratePositions(
    locationCreator: LocationFactory,
    robots: Robot[],
    maxSeconds: number,
    width: number,
    height: number): Generator<Map<Robot, Location>> {

    let numSeconds = 0
    while (numSeconds <= maxSeconds) {
        const finalPositions = new Map<Robot, Location>();
        for (let i = 0; i < robots.length; i++) {
            const robot = robots[i];
            const finalPosition = robot.positionAfter(numSeconds, width, height);
            const finalLocation = locationCreator(finalPosition.y, finalPosition.x)

            finalPositions.set(robot, finalLocation)
        }

        yield finalPositions;
        numSeconds += 1
    }
}

export function p1pipeline(input: string, width: number, height: number): number {
    const locationFactory = createCachedGridLocationFactory(height, width);
    const robots = parseInput(input, locationFactory);
    const numSeconds = 100;

    const finalPositions = new Map<Robot, Location>();
    for (let i = 0; i < robots.length; i++) {
        const robot = robots[i];
        const finalPosition = robot.positionAfter(numSeconds, width, height);
        const finalLocation = locationFactory(finalPosition.y, finalPosition.x)

        finalPositions.set(robot, finalLocation)
    }

    const quadrants = getQuadrants(width, height);
    const robotCounts = [0, 0, 0, 0]
    for (let [robot, loc] of finalPositions.entries()) {
        for (let i = 0; i < quadrants.length; i++) {
            const quadrant = quadrants[i];
            if (quadrant.contains(loc)) {
                robotCounts[i] += 1
            }
        }
    }

    return robotCounts.reduce((a, b) => a * b);
}

function isChristmasTree(elapsedSeconds: number): boolean {
    const rawAnswer = readline.question(`Is it a Christmas Tree? (${elapsedSeconds}): `);
    return rawAnswer.trim() === 'y';
}


export function p2pipeline(input: string, width: number, height: number): number {
    const locationFactory = createCachedGridLocationFactory(height, width);
    const robots = parseInput(input, locationFactory);
    const maxSeconds = width * height;

    const positionGenerator = iteratePositions(
        locationFactory,
        robots,
        maxSeconds,
        width,
        height)

    let elapsedSeconds = 0;
    for (let positions of positionGenerator) {
        const output = getRender(positions, width, height);
        if(output.includes("+++++++")) {
            console.log(output);
            if(isChristmasTree(elapsedSeconds)) {
                return elapsedSeconds;
            }
        }
        console.clear();
        elapsedSeconds += 1;
    }
    // manually iterating
    return -1;
}

function part1(): number {
    const width = 101;
    const height = 103;
    return p1pipeline(readPuzzleInput(14), width, height);
}

function part2(): number {
    const width = 101;
    const height = 103;
    return p2pipeline(readPuzzleInput(14), width, height);
}

const day14: Solution = {
    part1: part1,
    part2: part2
}

export default day14;
