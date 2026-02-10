import { create } from 'zustand';

interface StoreState {
    lifes: number;
    increase: () => void;
    decrease: () => void;
    question: string;
    answer: number;
    setQuestion: (question: string) => void;
    setAnswer: (answer: number) => void;
    clearQuestion: () => void;

}

export const useStore = create<StoreState>((set) => ({
    lifes: 3,
    increase: () => set((state) => ({ lifes: state.lifes + 1 })),
    decrease: () => set((state) => ({ lifes: Math.max(0, state.lifes - 1) })),
    question: "",
    answer: 0,
    setQuestion: (question: string) => set({ question }),
    setAnswer: (answer: number) => set({ answer }),
    clearQuestion: () => set({ question: '', answer: 0 }),

}));