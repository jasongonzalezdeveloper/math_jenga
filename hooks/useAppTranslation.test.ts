import { useAppTranslation } from "@/hooks/useAppTranslation";
import { LANGUAGE_STORAGE_KEY } from "@/i18n/client";
import { act, renderHook, waitFor } from "@testing-library/react";

const changeLanguage = jest.fn();
let resolvedLanguage = "es";

jest.mock("react-i18next", () => {
    const actual = jest.requireActual("react-i18next");

    return {
        ...actual,
        useTranslation: () => ({
            t: (key: string) => key,
            i18n: {
                get resolvedLanguage() {
                    return resolvedLanguage;
                },
                changeLanguage,
            },
        }),
    };
});

describe("useAppTranslation", () => {
    beforeEach(() => {
        window.localStorage.clear();
        changeLanguage.mockClear();
        resolvedLanguage = "es";
    });

    it("syncs language from localStorage when it differs", async () => {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "en");

        renderHook(() => useAppTranslation());

        await waitFor(() => {
            expect(changeLanguage).toHaveBeenCalledWith("en");
        });
    });

    it("setLanguage persists the selected language", () => {
        const { result } = renderHook(() => useAppTranslation());

        act(() => {
            result.current.setLanguage("en");
        });

        expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("en");
        expect(changeLanguage).toHaveBeenCalledWith("en");
    });
});
