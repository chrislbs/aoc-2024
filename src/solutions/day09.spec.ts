import {p1pipeline, p2pipeline, parseInput} from "./day09";

const exampleInput = `2333133121414131402`;

test('day9 part1 example works', () => {
    expect(p1pipeline(exampleInput)).toEqual(1928n);
})

test('day9 part2 example works', () => {
    expect(p2pipeline(exampleInput)).toEqual(2858n);
    // expect(p2pipeline("12345")).toEqual(2858n);
})
