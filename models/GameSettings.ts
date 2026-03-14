export type DefeatCondition = "oneLife" | "shake";
export type Difficulty = "easy" | "normal" | "hard";

export const QUESTION_TIME_LIMIT_BY_DIFFICULTY: Record<Difficulty, number> = {
    easy: 45,
    normal: 30,
    hard: 15,
};

export const getQuestionTimeLimitByDifficulty = (difficulty: Difficulty): number => {
    return QUESTION_TIME_LIMIT_BY_DIFFICULTY[difficulty];
};

export interface GameSettings {
    defeatConditions: DefeatCondition[];
    suddenDeath: boolean;
    multiplayerEnabled: boolean;
    difficulty: Difficulty;
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
    defeatConditions: [],
    suddenDeath: false,
    multiplayerEnabled: false,
    difficulty: "normal",
};
