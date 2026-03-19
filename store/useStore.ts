import { Cube } from '@/models/Cube';
import { DEFAULT_GAME_SETTINGS, DefeatCondition, Difficulty, GameSettings } from '@/models/GameSettings';
import { create } from 'zustand';

interface StoreState {
    lifes: number;
    increase: () => void;
    decrease: () => void;
    loseGame: () => void;
    settings: GameSettings;
    setDefeatConditions: (defeatConditions: DefeatCondition[]) => void;
    toggleDefeatCondition: (condition: DefeatCondition) => void;
    setDifficulty: (difficulty: Difficulty) => void;
    resetLifes: () => void;
    cubeClicked: Cube | null;
    setCubeClicked: (cube: Cube | null) => void;
    clearCube: () => void;
    isCorrect: boolean;
    setIsCorrect: (isCorrect: boolean) => void;
    resetIsCorrect: () => void;
    score: number;
    addScore: (points: number) => void;
    resetScore: () => void;
}

export const useStore = create<StoreState>((set) => ({
    lifes: 3,
    increase: () => set((state) => ({ lifes: state.lifes + 1 })),
    decrease: () => set((state) => ({ lifes: Math.max(0, state.lifes - 1) })),
    loseGame: () => set({ lifes: 0 }),
    settings: DEFAULT_GAME_SETTINGS,
    setDefeatConditions: (defeatConditions: DefeatCondition[]) => set((state) => ({
        settings: {
            ...state.settings,
            defeatConditions,
        },
    })),
    toggleDefeatCondition: (condition: DefeatCondition) => set((state) => {
        const hasCondition = state.settings.defeatConditions.includes(condition);

        return {
            settings: {
                ...state.settings,
                defeatConditions: hasCondition
                    ? state.settings.defeatConditions.filter((item) => item !== condition)
                    : [...state.settings.defeatConditions, condition],
            },
        };
    }),
    setDifficulty: (difficulty: Difficulty) => set((state) => ({
        settings: {
            ...state.settings,
            difficulty,
        },
    })),
    resetLifes: () => set((state) => ({
        lifes: state.settings.defeatConditions.includes('oneLife') ? 1 : 3,
        cubeClicked: null,
        isCorrect: false,
        score: 0,
    })),
    cubeClicked: null,
    setCubeClicked: (cube: Cube | null) => set({ cubeClicked: cube }),
    clearCube: () => set({ cubeClicked: null }),
    isCorrect: false,
    setIsCorrect: (isCorrect: boolean) => set({ isCorrect }),
    resetIsCorrect: () => set({ isCorrect: false }),
    score: 0,
    addScore: (points: number) => set((state) => ({ score: state.score + points })),
    resetScore: () => set({ score: 0 }),
}));