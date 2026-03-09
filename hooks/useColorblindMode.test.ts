import { useColorblindMode } from "@/hooks/useColorblindMode";
import { act, renderHook } from "@testing-library/react";

describe("useColorblindMode", () => {
    beforeEach(() => {
        window.localStorage.clear();
        document.documentElement.classList.remove("colorblind-mode");
    });

    it("toggles class and persists preference", () => {
        const { result } = renderHook(() => useColorblindMode());

        expect(result.current.isColorblindMode).toBe(false);

        act(() => {
            result.current.toggleColorblindMode();
        });

        expect(result.current.isColorblindMode).toBe(true);
        expect(document.documentElement.classList.contains("colorblind-mode")).toBe(true);
        expect(window.localStorage.getItem("colorblind-mode")).toBe("true");
    });
});
