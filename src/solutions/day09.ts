import {readPuzzleInput} from "../utils/files";
import {Solution} from "./solution";

const FREE_BLOCK = -1

class Block {
    index: number;
    fileId: number;

    constructor(index: number, fileId: number) {
        this.index = index;
        this.fileId = fileId;
    }
}

type FreeBlockSegment = {
    index: number;
    length: number;
}

class FileSystem {
    _blocks: Block[];

    constructor(fsDefinition: string) {

        this._blocks = new Array<Block>();

        const diskMap = fsDefinition.trim().split("");
        let fileId = 0;
        let blockIdx = 0;
        for (let i = 0; i < diskMap.length; i++) {

            const fileBlocks = new Array<Block>();
            const lengthFileBlock = parseInt(diskMap[i]);
            for(let blockNum = 0; blockNum < lengthFileBlock; blockNum++) {
                const fileBlock = new Block(blockIdx, fileId);
                fileBlocks.push(fileBlock);
                blockIdx++;
            }
            this._blocks.push(...fileBlocks);

            let lengthFreeBlock = 0;
            if (i + 1 < diskMap.length) {
                i++;
                lengthFreeBlock = parseInt(diskMap[i]);
            }

            const freeBlocks = new Array<Block>();
            if (lengthFreeBlock != 0) {
                for (let blockNum = 0; blockNum < lengthFreeBlock; blockNum++) {
                    const freeBlock = new Block(blockIdx, FREE_BLOCK);
                    freeBlocks.push(freeBlock);
                    blockIdx++;
                }
            }
            this._blocks.push(...freeBlocks);

            fileId++;
        }
    }

    render():string {
        let output = "";
        for(let i = 0; i < this._blocks.length; i++) {
            const block = this._blocks[i];
            if(block.fileId != FREE_BLOCK) {
                output += `[${block.fileId}]`;
            } else {
                output += "[.]";
            }
        }
        return output;
    }

    compressBlocks() {
        let lastTestedFreeBlockIdx = 0;
        for(let lastBlockIdx = this._blocks.length - 1; lastBlockIdx >= 0; lastBlockIdx--) {
            const block = this._blocks[lastBlockIdx];
            if(block.fileId === FREE_BLOCK) {
                continue;
            }
            const fileBlock = block;

            let lastFreeBlock = this._blocks[lastTestedFreeBlockIdx];
            while(lastFreeBlock.fileId !== FREE_BLOCK && lastTestedFreeBlockIdx < fileBlock.index) {
                lastTestedFreeBlockIdx++;
                lastFreeBlock = this._blocks[lastTestedFreeBlockIdx];
            }

            if(lastFreeBlock.index > fileBlock.index) {
                break;
            }

            // swap
            const fileId = fileBlock.fileId;
            fileBlock.fileId = FREE_BLOCK;
            lastFreeBlock.fileId = fileId;
        }
    }

    defrag() {

        // We could just do some maintenance of free blocks here while iterating.
        // For now brute force and only recall the
        // Build the free blocks array up front
        let freeBlockSegments = new Array<FreeBlockSegment>();

        let lastFreeBlockIndex: number | undefined = undefined;
        for(let i = 0; i < this._blocks.length; i++) {
            const block = this._blocks[i];
            if(block.fileId === FREE_BLOCK) {
                if(lastFreeBlockIndex === undefined) {
                    lastFreeBlockIndex = i;
                }
            } else {
                if(lastFreeBlockIndex !== undefined) {
                    const freeBlockSegment = {
                        index: lastFreeBlockIndex,
                        length: i - lastFreeBlockIndex,
                    }
                    freeBlockSegments.push(freeBlockSegment);
                    lastFreeBlockIndex = undefined;
                }
            }
        }

        let visitedFiles = new Set<number>();
        for(let lastBlockIndex = this._blocks.length - 1; lastBlockIndex >= 0; lastBlockIndex--) {

            const lastBlock = this._blocks[lastBlockIndex];
            if(lastBlock.fileId === FREE_BLOCK) {
                continue;
            } else if (visitedFiles.has(lastBlock.fileId)) {
                continue;
            }

            const fileBlocks = new Array<Block>();
            let lastFileBlock = lastBlock;
            const fileId = lastFileBlock.fileId;
            visitedFiles.add(fileId);
            while(lastBlockIndex >= 0 && lastFileBlock.fileId === fileId) {
                // TODO: fix array out of bounds
                fileBlocks.push(lastFileBlock);
                lastBlockIndex--;
                if(lastBlockIndex >= 0) {
                    lastFileBlock = this._blocks[lastBlockIndex];
                }
            }
            // sort them for when we do our "swapping" later
            fileBlocks.sort((a, b) => a.index - b.index);
            // when we exit this while loop, we will have incremented beyond where we should have so add one back
            lastBlockIndex++;

            const fileLength = fileBlocks.length;

            const freeBlockSegmentIndex = freeBlockSegments.findIndex(fb => fb.length >= fileLength && fb.index < fileBlocks[0].index);
            if(freeBlockSegmentIndex == -1) {
                // console.log(`no free space for file ${fileId}`)
                continue;
            }
            const freeSegment = freeBlockSegments[freeBlockSegmentIndex];
            // console.log(`found free space of length ${freeSegment.length} at index ${freeSegment.index} for file ${fileId}`)

            // swap all the blocks
            // create a new free segment with all the swapped blocks
            for(let blockOffset= 0; blockOffset < fileLength; blockOffset++) {
                const fileBlock = fileBlocks[blockOffset];
                const freeBlock = this._blocks[freeSegment.index + blockOffset];

                const fileId = fileBlock.fileId;
                fileBlock.fileId = FREE_BLOCK;
                freeBlock.fileId = fileId;
            }
            // need to shrink or remove the free segment altogether
            if(freeSegment.length === fileLength) {
                freeBlockSegments.splice(freeBlockSegmentIndex, 1)
            } else {
                freeSegment.index += fileLength;
                freeSegment.length -= fileLength;
            }

            let newFreeSegment: FreeBlockSegment = {
                index: fileBlocks[0].index,
                length: fileLength,
            }
            // need to insert the new free segment back to the right location
            let prevSegmentIndex = freeBlockSegments.findLastIndex(fb => fb.index < newFreeSegment.index)
            if(prevSegmentIndex === -1) {
                prevSegmentIndex = freeBlockSegments.length - 1
            }

            // if the previous segment abuts the new one, merge them
            const prevSegment = freeBlockSegments[prevSegmentIndex];
            if(prevSegment.index + prevSegment.length === newFreeSegment.index) {
                prevSegment.length += newFreeSegment.length;
                newFreeSegment = prevSegment;
            }

            // if the new segment abuts to the one in front of it, we should merge it as well
            let nextSegmentIndex = prevSegmentIndex + 1;
            if(nextSegmentIndex < freeBlockSegments.length) {
                const nextFreeSegment = freeBlockSegments[nextSegmentIndex];

                if(newFreeSegment.index + newFreeSegment.length === nextFreeSegment.index) {
                    newFreeSegment.length += nextFreeSegment.length;
                }
                freeBlockSegments.splice(nextSegmentIndex, 1);
            }

            // if we didn't merge segments, add it
            if(prevSegment !== newFreeSegment) {
                freeBlockSegments.splice(prevSegmentIndex + 1, 0, newFreeSegment)
            }
        }
    }

    checksum(): bigint {
        let checksum = 0n;
        for(let i = 0; i < this._blocks.length; i++) {
            const block = this._blocks[i];
            if(block.fileId !== FREE_BLOCK) {
                checksum += BigInt(block.index * block.fileId);
            }
        }
        return checksum;
    }
}

export function parseInput(input: string): FileSystem {
    return new FileSystem(input);
}

export function p1pipeline(input: string): bigint {
    const filesystem = parseInput(input);
    // console.log(filesystem.render());
    filesystem.compressBlocks()
    // console.log(filesystem.render());
    return filesystem.checksum();
}


export function p2pipeline(input: string): bigint {
    const filesystem = parseInput(input);

    // console.log(filesystem.render())
    filesystem.defrag()
    console.log(filesystem.render())
    return filesystem.checksum();
}

function part1(): bigint {
    return p1pipeline(readPuzzleInput(9));
}

function part2(): bigint {
    return p2pipeline(readPuzzleInput(9));
}

const day9: Solution = {
    part1: part1,
    part2: part2
}

export default day9;
