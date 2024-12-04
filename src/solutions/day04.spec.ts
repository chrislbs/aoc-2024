// import {parseInputP1, p2pipeline} from "./day04";

import {p1pipeline, p2pipeline} from "./day04";

const exampleInput = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`;

test('day4 part1 example works', () => {
    expect(p1pipeline(exampleInput)).toEqual(18)
})

test('day4 part2 example works', () => {
    expect(p2pipeline(exampleInput)).toEqual(9)
})