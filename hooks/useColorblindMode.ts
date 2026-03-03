import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "colorblind-mode";

export const useColorblindMode = () => {
    const [isColorblindMode, setIsColorblindMode] = useState(false);

    useEffect(() => {
        const savedPreference = window.localStorage.getItem(STORAGE_KEY);
        const enabled = savedPreference === "true";
        setIsColorblindMode(enabled);

        if (enabled) {
            document.documentElement.classList.add("colorblind-mode");
            return;
        }

        document.documentElement.classList.remove("colorblind-mode");
    }, []);

    const toggleColorblindMode = useCallback(() => {
        setIsColorblindMode((prev) => {
            const next = !prev;
            window.localStorage.setItem(STORAGE_KEY, String(next));

            if (next) {
                document.documentElement.classList.add("colorblind-mode");
            } else {
                document.documentElement.classList.remove("colorblind-mode");
            }

            return next;
        });
    }, []);

    return {
        isColorblindMode,
        toggleColorblindMode,
    };
};
