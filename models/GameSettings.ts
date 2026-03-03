export type DefeatCondition = "oneLife" | "shake";
export type Difficulty = "easy" | "normal" | "hard";

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
