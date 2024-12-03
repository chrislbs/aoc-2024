import {parseInput} from "./day03";

const exampleInput = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;

test('day3 part1 example works', () => {
    const result = parseInput(exampleInput).map(pair => pair[0] * pair[1]).reduce(
        (acc, val) => acc + val,
        0);

    expect(result).toEqual(161);
})

test('day3 part2 example works', () => {
})