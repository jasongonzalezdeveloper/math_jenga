"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "@/i18n/resources";

const LANGUAGE_STORAGE_KEY = "app-language";

if (!i18n.isInitialized) {
    i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: "es",
            fallbackLng: "es",
            supportedLngs: ["es", "en"],
            interpolation: {
                escapeValue: false,
            },
        });
}

export { LANGUAGE_STORAGE_KEY };
