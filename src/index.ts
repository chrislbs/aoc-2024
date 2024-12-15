import {program, Option} from "commander";
import {Solution} from "./solutions/solution";
import day1 from "./solutions/day01";
import day2 from "./solutions/day02";
import day3 from "./solutions/day03";
import day4 from "./solutions/day04";
import day5 from "./solutions/day05";
import day6 from "./solutions/day06";
import day7 from "./solutions/day07";
import day8 from "./solutions/day08";
import day9 from "./solutions/day09";
import day10 from "./solutions/day10";
import day11 from "./solutions/day11";
import day12 from "./solutions/day12";
import day13 from "./solutions/day13";

program.option('-d, --day <number>', 'day')
program.addOption(new Option('-p, --part <number>', 'part').choices(['1', '2']))
program.parse(process.argv);

const options = program.opts();

const solutions = new Map<number, Solution>([
    [1, day1],
    [2, day2],
    [3, day3],
    [4, day4],
    [5, day5],
    [6, day6],
    [7, day7],
    [8, day8],
    [9, day9],
    [10, day10],
    [11, day11],
    [12, day12],
    [13, day13],
]);

let selectedDay : number | undefined;
if(options.day) {
    selectedDay = parseInt(options.day);
} else {
    selectedDay = Array.from(solutions.keys()).pop()
}

let solution : Solution | undefined;
if(selectedDay !== undefined) {
    solution = solutions.get(selectedDay);
} else {
    console.log(`Must specify a valid day`);
    process.exit(1);
}

if(solution === undefined) {
    console.log(`No solution registered for day ${selectedDay}`);
    process.exit(1);
}

let part = options.part;
let solutionFunc: (() => number | bigint) | undefined;
if(part === undefined) {
    if(solution.part2 === undefined) {
        solutionFunc = solution.part1;
        part = 1
    } else {
        solutionFunc = solution.part2;
        part = 2
    }
} else if(part == "1") {
    solutionFunc = solution.part1;
} else {
    solutionFunc = solution.part2
}

if(solutionFunc === undefined) {
    console.log(`No solution has been registered for part ${part} of day ${selectedDay}.`);
    process.exit(1);
}

console.log(`Running day ${selectedDay} part ${part}:`);

console.log(solutionFunc());






