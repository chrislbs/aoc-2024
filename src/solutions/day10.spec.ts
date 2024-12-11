import {p1pipeline, p2pipeline} from "./day10";

const examples = [
    `
0123
1234
8765
9876
`,
    `
...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`,
    `
..90..9
...1.98
...2..7
6543456
765.987
876....
987....
    `,
`
10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01
`,
`
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`
]

const p2Examples = [
    `
.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9....
    `
]

test('day10 part1 example works', () => {
    expect(p1pipeline(examples[0])).toEqual(1)
    expect(p1pipeline(examples[1])).toEqual(2)
    expect(p1pipeline(examples[2])).toEqual(4)
    expect(p1pipeline(examples[3])).toEqual(3)
    expect(p1pipeline(examples[4])).toEqual(36)
})

test('day10 part2 example works', () => {
    expect(p2pipeline(p2Examples[0])).toEqual(3)
    expect(p2pipeline(examples[4])).toEqual(81)
})
