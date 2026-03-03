"use client";

import "@/i18n/client";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { AppLanguage } from "@/i18n/resources";

export const useAppTranslation = () => {
    const { t, i18n } = useTranslation();

    const language: AppLanguage = i18n.resolvedLanguage?.startsWith("en") ? "en" : "es";

    const setLanguage = useCallback((nextLanguage: AppLanguage) => {
        void i18n.changeLanguage(nextLanguage);
    }, [i18n]);

    return {
        t,
        language,
        setLanguage,
    };
};
