import { useJengaLogic } from "@/hooks/useJengaLogic";
import { DEFAULT_GAME_SETTINGS } from "@/models/GameSettings";
import { useStore } from "@/store/useStore";
import { act, renderHook, waitFor } from "@testing-library/react";

describe("useJengaLogic collapse by probability", () => {
    beforeEach(() => {
        useStore.setState({
            lifes: 3,
            settings: { ...DEFAULT_GAME_SETTINGS, defeatConditions: ["shake"] },
            cubeClicked: null,
            isCorrect: false,
        });
    });

    it("loses the game by probability when shake is enabled", async () => {
        const { result } = renderHook(() => useJengaLogic());

        const sourceCube = result.current.jengaTower[0][0];

        act(() => {
            result.current.handleClick(sourceCube);
            useStore.getState().setIsCorrect(true);
        });

        await waitFor(() => {
            const topRow = result.current.jengaTower[result.current.jengaTower.length - 1];
            expect(topRow.every((cube) => cube.isEmpty)).toBe(true);
        });

        const destinationCube = result.current.jengaTower[result.current.jengaTower.length - 1][0];

        const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0);

        act(() => {
            result.current.handleClick(destinationCube);
        });

        expect(useStore.getState().lifes).toBe(0);

        randomSpy.mockRestore();
    });

    it("assigns a new question-answer pair when placing a moved block on top", async () => {
        useStore.setState((state) => ({
            ...state,
            lifes: 3,
            settings: { ...DEFAULT_GAME_SETTINGS, defeatConditions: [] },
            cubeClicked: null,
            isCorrect: false,
        }));

        const { result } = renderHook(() => useJengaLogic());

        const sourceCube = result.current.jengaTower[0][0];

        act(() => {
            result.current.handleClick(sourceCube);
            useStore.getState().setIsCorrect(true);
        });

        await waitFor(() => {
            const topRow = result.current.jengaTower[result.current.jengaTower.length - 1];
            expect(topRow.every((cube) => cube.isEmpty)).toBe(true);
        });

        const destinationCube = result.current.jengaTower[result.current.jengaTower.length - 1][0];

        const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0);

        act(() => {
            result.current.handleClick(destinationCube);
        });

        const updatedDestinationCube = result.current.jengaTower[result.current.jengaTower.length - 1][0];
        expect(updatedDestinationCube.question).toBe("1 + 1");
        expect(updatedDestinationCube.answer).toBe(2);

        randomSpy.mockRestore();
    });
});
