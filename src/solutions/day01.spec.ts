import {p1pipeline, p2pipeline} from "./day01";

const exampleInput = `
3   4
4   3
2   5
1   3
3   9
3   3`;

test('day1 part1 example works', () => {

    const result = p1pipeline(exampleInput);

    expect(result).toEqual(11);
})

test('day1 part2 example works', () => {

    const result = p2pipeline(exampleInput);

    expect(result).toEqual(31);
})
