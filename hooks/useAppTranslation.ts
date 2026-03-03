"use client";

import "@/i18n/client";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGE_STORAGE_KEY } from "@/i18n/client";
import type { AppLanguage } from "@/i18n/resources";

export const useAppTranslation = () => {
    const { t, i18n } = useTranslation();

    const language: AppLanguage = i18n.resolvedLanguage?.startsWith("en") ? "en" : "es";

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        const normalizedStoredLanguage: AppLanguage = storedLanguage?.startsWith("en") ? "en" : "es";

        if (normalizedStoredLanguage !== language) {
            void i18n.changeLanguage(normalizedStoredLanguage);
        }
    }, [i18n, language]);

    useEffect(() => {
        if (typeof document === "undefined") {
            return;
        }

        document.documentElement.lang = language;
    }, [language]);

    const setLanguage = useCallback((nextLanguage: AppLanguage) => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
        }

        void i18n.changeLanguage(nextLanguage);
    }, [i18n]);

    return {
        t,
        language,
        setLanguage,
    };
};
