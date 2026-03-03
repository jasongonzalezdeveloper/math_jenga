"use client";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { resources } from "@/i18n/resources";

const LANGUAGE_STORAGE_KEY = "app-language";

if (!i18n.isInitialized) {
    i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources,
            fallbackLng: "es",
            supportedLngs: ["es", "en"],
            interpolation: {
                escapeValue: false,
            },
            detection: {
                order: ["localStorage", "navigator"],
                caches: ["localStorage"],
                lookupLocalStorage: LANGUAGE_STORAGE_KEY,
            },
        });
}

const normalizedLanguage = i18n.resolvedLanguage?.startsWith("en") ? "en" : "es";
if (typeof document !== "undefined") {
    document.documentElement.lang = normalizedLanguage;
}

i18n.on("languageChanged", (language) => {
    const normalized = language.startsWith("en") ? "en" : "es";
    if (typeof document !== "undefined") {
        document.documentElement.lang = normalized;
    }
});

export { i18n, LANGUAGE_STORAGE_KEY };
