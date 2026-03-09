import { DEFAULT_GAME_SETTINGS } from "@/models/GameSettings";
import { useStore } from "@/store/useStore";

describe("useStore settings and lives", () => {
    beforeEach(() => {
        useStore.setState({
            lifes: 3,
            settings: DEFAULT_GAME_SETTINGS,
            cubeClicked: null,
            isCorrect: false,
        });
    });

    it("sets defeat conditions and keeps configuration in sync", () => {
        useStore.getState().setDefeatConditions(["oneLife", "shake"]);

        expect(useStore.getState().settings.defeatConditions).toEqual(["oneLife", "shake"]);

        useStore.getState().toggleDefeatCondition("shake");
        expect(useStore.getState().settings.defeatConditions).toEqual(["oneLife"]);

        useStore.getState().toggleDefeatCondition("shake");
        expect(useStore.getState().settings.defeatConditions).toEqual(["oneLife", "shake"]);
    });

    it("resets lives to 1 when oneLife is selected", () => {
        useStore.getState().setDefeatConditions(["oneLife"]);

        useStore.getState().resetLifes();

        expect(useStore.getState().lifes).toBe(1);
    });

    it("resets lives to 3 with default configuration", () => {
        useStore.getState().setDefeatConditions([]);

        useStore.getState().resetLifes();

        expect(useStore.getState().lifes).toBe(3);
    });
});
