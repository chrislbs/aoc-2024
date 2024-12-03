import {parseInputP1, p2pipeline} from "./day03";

const p1ExampleInput = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;

test('day3 part1 example works', () => {
    const result = parseInputP1(p1ExampleInput).reduce(
        (acc, val) => acc + val,
        0);

    expect(result).toEqual(161);
})

const p2ExampleInput = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

test('day3 part2 example works', () => {
    const result = p2pipeline(p2ExampleInput);
    expect(result).toEqual(48)
})