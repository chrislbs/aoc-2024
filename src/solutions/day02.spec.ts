import {p1pipeline, p2pipeline} from "./day02";

const exampleInput = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

test('day2 part1 example works', () => {

    const result = p1pipeline(exampleInput);

    expect(result).toEqual(2);
})

test('day2 part2 example works', () => {

    const result = p2pipeline(exampleInput);

    expect(result).toEqual(4);
})