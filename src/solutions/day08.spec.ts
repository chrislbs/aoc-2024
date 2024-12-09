import {p1pipeline, p2pipeline} from "./day08";

const exampleInput = `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`;

const exampleP2Input = `
T....#....
...T......
.T....#...
.........#
..#.......
..........
...#......
..........
....#.....
..........
`

test('day8 part1 example works', () => {
    expect(p1pipeline(exampleInput)).toEqual(14);
})

test('day8 part2 example works', () => {
    expect(p2pipeline(exampleP2Input)).toEqual(9);
    expect(p2pipeline(exampleInput)).toEqual(34);
})