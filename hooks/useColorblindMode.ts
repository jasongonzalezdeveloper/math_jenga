import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "colorblind-mode";

const getInitialColorblindMode = () => {
    if (typeof window === "undefined") {
        return false;
    }

    const savedPreference = window.localStorage.getItem(STORAGE_KEY);
    return savedPreference === "true";
};

export const useColorblindMode = () => {
    const [isColorblindMode, setIsColorblindMode] = useState(getInitialColorblindMode);

    useEffect(() => {
        if (isColorblindMode) {
            document.documentElement.classList.add("colorblind-mode");
            return;
        }

        document.documentElement.classList.remove("colorblind-mode");
    }, [isColorblindMode]);

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
