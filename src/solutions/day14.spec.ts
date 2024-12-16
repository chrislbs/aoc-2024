import {p1pipeline} from "./day14";

const exampleInput = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`;

test('day14 part1 example works', () => {
    const width = 11;
    const height = 7;

    console.log(300 % 11)

    expect(p1pipeline(exampleInput, width, height)).toEqual(12)
})

test('day14 part2 example works', () => {
})
