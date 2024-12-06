import {program, Option} from "commander";
import {Solution} from "./solutions/solution";
import day1 from "./solutions/day01";
import day2 from "./solutions/day02";
import day3 from "./solutions/day03";
import day4 from "./solutions/day04";
import day5 from "./solutions/day05";
import day6 from "./solutions/day06";

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
let solutionFunc: (() => number) | undefined;
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






