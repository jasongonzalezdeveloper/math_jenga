import { useGameShortcuts } from "@/hooks/useGameShortcuts";
import { act, renderHook } from "@testing-library/react";

describe("useGameShortcuts", () => {
    it("handles rotate and config shortcuts", () => {
        const onRotate = jest.fn();
        const onOpenConfig = jest.fn();

        renderHook(() => useGameShortcuts({ onRotate, onOpenConfig }));

        act(() => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "r" }));
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "c" }));
        });

        expect(onRotate).toHaveBeenCalledTimes(1);
        expect(onOpenConfig).toHaveBeenCalledTimes(1);
    });

    it("opens shortcut modal with I and blocks rotate while modal is open", () => {
        const onRotate = jest.fn();
        const onOpenConfig = jest.fn();

        const { result } = renderHook(() => useGameShortcuts({ onRotate, onOpenConfig }));

        act(() => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "i" }));
        });

        expect(result.current.isShortcutModalOpen).toBe(true);

        act(() => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "r" }));
        });

        expect(onRotate).not.toHaveBeenCalled();
    });
});
