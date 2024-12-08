import {p1pipeline, p2pipeline} from "./day07";

const exampleInput = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`;

test('day7 part1 example works', () => {
    expect(p1pipeline(exampleInput)).toBe(3749);
})

test('day7 part2 example works', () => {
    expect(p2pipeline(exampleInput)).toBe(11387);
})
