import QuestionModal from "@/lib/QuestionModal";
import { DEFAULT_GAME_SETTINGS } from "@/models/GameSettings";
import { useStore } from "@/store/useStore";
import { fireEvent, render, screen } from "@testing-library/react";

describe("QuestionModal answer flow", () => {
    beforeEach(() => {
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
});
