"use client";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import type { AppLanguage } from "@/i18n/resources";
import ReactCountryFlag from "react-country-flag";
import { FiChevronDown } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

interface LanguageSelectorProps {
    className?: string;
}

const LANGUAGE_OPTIONS: Array<{ code: AppLanguage; countryCode: string; labelKey: "language.spanish" | "language.english" }> = [
    { code: "es", countryCode: "ES", labelKey: "language.spanish" },
    { code: "en", countryCode: "US", labelKey: "language.english" },
];

export function LanguageSelector({ className }: LanguageSelectorProps) {
    const { t, language, setLanguage } = useAppTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const activeOption = LANGUAGE_OPTIONS.find((option) => option.code === language) ?? LANGUAGE_OPTIONS[0];

    useEffect(() => {
        const onWindowClick = (event: MouseEvent) => {
            if (!containerRef.current) {
                return;
            }

            const target = event.target as Node;
            if (!containerRef.current.contains(target)) {
                setIsOpen(false);
            }
        };

        const onWindowKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("mousedown", onWindowClick);
        window.addEventListener("keydown", onWindowKeyDown);

        return () => {
            window.removeEventListener("mousedown", onWindowClick);
            window.removeEventListener("keydown", onWindowKeyDown);
        };
    }, []);

    return (
        <div ref={containerRef} className={`relative ${className ?? ""}`}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded bg-white px-2 py-2 text-sm text-black shadow-md transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={t("language.label")}
                title={t("language.label")}
            >
                <ReactCountryFlag countryCode={activeOption.countryCode} svg style={{ width: "1.2em", height: "1.2em" }} />
                <span>{t(activeOption.labelKey)}</span>
                <FiChevronDown className="h-4 w-4" />
            </button>

            {isOpen && (
                <div
                    role="listbox"
                    aria-label={t("language.label")}
                    className="absolute right-0 mt-2 w-36 overflow-hidden rounded border border-zinc-300 bg-white text-black shadow-lg"
                >
                    {LANGUAGE_OPTIONS.map((option) => {
                        const isActive = language === option.code;
                        return (
                            <button
                                key={option.code}
                                type="button"
                                role="option"
                                aria-selected={isActive}
                                onClick={() => {
                                    setLanguage(option.code);
                                    setIsOpen(false);
                                }}
                                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-black hover:bg-zinc-100 ${isActive ? "bg-zinc-100 font-semibold" : ""}`}
                            >
                                <ReactCountryFlag countryCode={option.countryCode} svg style={{ width: "1.2em", height: "1.2em" }} />
                                <span>{t(option.labelKey)}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
