import { Cube } from '@/models/Cube';
import { create } from 'zustand';

interface StoreState {
    lifes: number;
    increase: () => void;
    decrease: () => void;
    cubeClicked: Cube | null;
    setCubeClicked: (cube: Cube | null) => void;
    clearCube: () => void;
    isCorrect: boolean;
    setIsCorrect: (isCorrect: boolean) => void;
    resetIsCorrect: () => void;
}

export const useStore = create<StoreState>((set) => ({
    lifes: 3,
    increase: () => set((state) => ({ lifes: state.lifes + 1 })),
    decrease: () => set((state) => ({ lifes: Math.max(0, state.lifes - 1) })),
    cubeClicked: null,
    setCubeClicked: (cube: Cube | null) => set({ cubeClicked: cube }),
    clearCube: () => set({ cubeClicked: null }),
    isCorrect: false,
    setIsCorrect: (isCorrect: boolean) => set({ isCorrect }),
    resetIsCorrect: () => set({ isCorrect: false }),
}));