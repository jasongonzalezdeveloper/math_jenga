import QuestionModal from "@/lib/QuestionModal";
import { DEFAULT_GAME_SETTINGS } from "@/models/GameSettings";
import { useStore } from "@/store/useStore";
import { act, fireEvent, render, screen } from "@testing-library/react";

describe("QuestionModal answer flow", () => {
    beforeEach(() => {
        jest.useRealTimers();
        useStore.setState({
            lifes: 3,
            settings: DEFAULT_GAME_SETTINGS,
            cubeClicked: {
                id: 1,
                color: "#0052cc",
                row: 0,
                col: 0,
                shake: 30,
                question: "2 + 2",
                answer: 4,
            },
            isCorrect: false,
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("marks answer as correct without decreasing lives", () => {
        render(<QuestionModal />);

        fireEvent.change(screen.getByPlaceholderText("Escribe tu respuesta"), {
            target: { value: "4" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Verificar" }));

        expect(screen.getByText("¡Correcto!")).toBeInTheDocument();
        expect(useStore.getState().isCorrect).toBe(true);
        expect(useStore.getState().lifes).toBe(3);
    });

    it("marks answer as incorrect and decreases one life", () => {
        render(<QuestionModal />);

        fireEvent.change(screen.getByPlaceholderText("Escribe tu respuesta"), {
            target: { value: "5" },
        });
        fireEvent.click(screen.getByRole("button", { name: "Verificar" }));

        expect(screen.getByText("Incorrecto, intenta de nuevo")).toBeInTheDocument();
        expect(useStore.getState().isCorrect).toBe(false);
        expect(useStore.getState().lifes).toBe(2);
    });

    it("uses medium difficulty timer by default (30s)", () => {
        render(<QuestionModal />);

        expect(screen.getByText("Tiempo restante: 30s")).toBeInTheDocument();
    });

    it("uses easy timer when easy difficulty is selected (45s)", () => {
        useStore.setState((state) => ({
            settings: {
                ...state.settings,
                difficulty: "easy",
            },
        }));

        render(<QuestionModal />);

        expect(screen.getByText("Tiempo restante: 45s")).toBeInTheDocument();
    });

    it("decreases one life when timer reaches zero", () => {
        jest.useFakeTimers();
        useStore.setState((state) => ({
            settings: {
                ...state.settings,
                difficulty: "hard",
            },
        }));

        render(<QuestionModal />);

        act(() => {
            jest.advanceTimersByTime(15000);
        });

        expect(screen.getByText("Se acabó el tiempo")).toBeInTheDocument();
        expect(screen.getByText("Incorrecto, intenta de nuevo")).toBeInTheDocument();
        expect(useStore.getState().lifes).toBe(2);
    });
});
