import {p1pipeline} from "./day12";

const exampleInputs = [
`
AAAA
BBCD
BBCC
EEEC
`,
`
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO
`,
`
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`
];

test('day12 part1 example works', () => {
    expect(p1pipeline(exampleInputs[0])).toEqual(140);
    expect(p1pipeline(exampleInputs[1])).toEqual(772);
    expect(p1pipeline(exampleInputs[2])).toEqual(1930);
})

test('day12 part2 example works', () => {
})
