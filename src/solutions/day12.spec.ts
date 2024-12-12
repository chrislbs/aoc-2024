import {p1pipeline, p2pipeline} from "./day12";

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

const p2ExampleInputs = [
    `
EEEEE
EXXXX
EEEEE
EXXXX
EEEEE
    `,
    `
AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`
]

test('day12 part1 example works', () => {
    expect(p1pipeline(exampleInputs[0])).toEqual(140);
    expect(p1pipeline(exampleInputs[1])).toEqual(772);
    expect(p1pipeline(exampleInputs[2])).toEqual(1930);
})

test('day12 part2 example works', () => {
    expect(p2pipeline(exampleInputs[0])).toEqual(80);
    expect(p2pipeline(exampleInputs[1])).toEqual(436);
    expect(p2pipeline(exampleInputs[2])).toEqual(1206);
    expect(p2pipeline(p2ExampleInputs[0])).toEqual(236);
    expect(p2pipeline(p2ExampleInputs[1])).toEqual(368);
})
