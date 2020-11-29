export function Zeros(dimensions: number[]): number[][] {
    const array: number[][] = [];

    for (let i = 0; i < dimensions[0]; i++) {
        array[i] = []
        for (let j = 0; j < dimensions[1]; j++) {
            array[i][j] = 0;
        }
    }

    return array;
}

export function findNextOrMissing(numberList: number[]): number {
    numberList.sort();
    for (let i=0; i<Math.max(...numberList); i++) {
        if (numberList[i] !== i) {
            return i;
        }
    }
    return numberList.length;
}
