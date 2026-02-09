export interface Cube {
    id: number,
    color: string,
    row: number,
    col: number,
    shake: number,
    question: string,
    answer: number,

    isAnswerCorrect(userAnswer: number): boolean;
}

export const createCube = (cube: Cube): Cube => {
    return {
        ...cube,
        isAnswerCorrect: function (userAnswer: number) {
            return userAnswer === this.answer;
        }
    };
};