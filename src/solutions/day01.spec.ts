import {pipeline} from "./day01";

test('day1 example works', () => {

    let exampleInput = `
3   4
4   3
2   5
1   3
3   9
3   3`;

    const result = pipeline(exampleInput);

    expect(result).toEqual(11);
})