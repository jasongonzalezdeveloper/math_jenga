export interface Cube {
    id: number,
    color: string,
    row: number,
    col: number,
    shake: number,
    question: string,
    answer: number,
    isEmpty?: boolean,
}

export const createCube = (cube: Cube): Cube => {
    return {
        ...cube
    };
};