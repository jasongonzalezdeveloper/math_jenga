"use client";

import { useStore } from "@/store/useStore";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { useCallback, useEffect, useMemo, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import type { Difficulty } from "@/models/GameSettings";

export default function ConfigPage() {
    const router = useRouter();
    const { t } = useAppTranslation();
    const { settings, setDefeatConditions, toggleDefeatCondition, setDifficulty, resetLifes } = useStore();
    const defaultSettingsRef = useRef<HTMLInputElement>(null);
    const oneLifeRef = useRef<HTMLInputElement>(null);
    const shakeRef = useRef<HTMLInputElement>(null);
    const optionRefs = useMemo(() => [defaultSettingsRef, oneLifeRef, shakeRef], []);

    useEffect(() => {
        defaultSettingsRef.current?.focus();
    }, []);

    const handleStart = useCallback(() => {
        resetLifes();
        router.push("/game");
    }, [resetLifes, router]);

    const applyDefaultSettings = useCallback(() => {
        setDefeatConditions([]);
    }, [setDefeatConditions]);

    const isDefaultSelected = settings.defeatConditions.length === 0;

    const focusOptionByIndex = useCallback((index: number) => {
        const total = optionRefs.length;
        if (total === 0) {
            return;
        }

        const wrapped = (index + total) % total;
        optionRefs[wrapped].current?.focus();
    }, [optionRefs]);

    const handleOptionArrowNavigation = useCallback((event: ReactKeyboardEvent<HTMLElement>, currentIndex: number) => {
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            event.preventDefault();
            focusOptionByIndex(currentIndex + 1);
            return;
        }

        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            event.preventDefault();
            focusOptionByIndex(currentIndex - 1);
        }
    }, [focusOptionByIndex]);

    useEffect(() => {
        const onGlobalKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const tagName = target?.tagName?.toLowerCase();
            const inputType = target instanceof HTMLInputElement ? target.type : null;
            const isCheckboxInput = tagName === "input" && inputType === "checkbox";
            const isTypingContext =
                (tagName === "input" && !isCheckboxInput) ||
                tagName === "textarea" ||
                tagName === "select" ||
                target?.isContentEditable;

            if (isTypingContext) {
                return;
            }

            if (event.key === "Enter" || event.key === "NumpadEnter") {
                event.preventDefault();
                handleStart();
            }
        };

        window.addEventListener("keydown", onGlobalKeyDown);
        return () => window.removeEventListener("keydown", onGlobalKeyDown);
    }, [handleStart]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-(--color-background) px-4 font-sans text-(--color-foreground)">
            <main className="w-full max-w-xl rounded-lg border border-secondary/30 bg-(--color-surface) p-6 text-(--color-foreground) shadow-lg">
                <div className="mb-4 flex justify-end">
                    <LanguageSelector />
                </div>

                <h1 className="text-3xl font-bold text-center">{t("config.title")}</h1>

                <div className="mt-6 space-y-3 text-left">
                    <div className="rounded border border-info/35 bg-(--color-background) p-4">
                        <div className="font-semibold">{t("config.defaultTitle")}</div>
                        <p className="mt-1 text-sm text-(--color-foreground)">
                            {t("config.defaultDescription")}
                        </p>
                        <label className="mb-2 flex items-center gap-2">
                            <input
                                ref={defaultSettingsRef}
                                type="checkbox"
                                className="accent-(--color-primary)"
                                checked={isDefaultSelected}
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        applyDefaultSettings();
                                    }
                                }}
                                onKeyDown={(event) => handleOptionArrowNavigation(event, 0)}
                            />
                            <span>{t("config.useDefault")}</span>
                        </label>

                        <label className="mb-2 flex items-center gap-2">
                            <input
                                ref={oneLifeRef}
                                type="checkbox"
                                className="accent-(--color-primary)"
                                checked={settings.defeatConditions.includes("oneLife")}
                                onChange={() => toggleDefeatCondition("oneLife")}
                                onKeyDown={(event) => handleOptionArrowNavigation(event, 1)}
                            />
                            <span>{t("config.oneLife")}</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                ref={shakeRef}
                                type="checkbox"
                                className="accent-(--color-primary)"
                                checked={settings.defeatConditions.includes("shake")}
                                onChange={() => toggleDefeatCondition("shake")}
                                onKeyDown={(event) => handleOptionArrowNavigation(event, 2)}
                            />
                            <span>{t("config.loseChance")}</span>
                        </label>

                        <div className="mt-4">
                            <label className="mb-1 block font-semibold" htmlFor="difficulty-selector">
                                {t("config.difficultyLabel")}
                            </label>
                            <select
                                id="difficulty-selector"
                                className="w-full rounded border border-info/35 bg-(--color-surface) px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-secondary)"
                                value={settings.difficulty}
                                onChange={(event) => {
                                    setDifficulty(event.target.value as Difficulty);
                                }}
                            >
                                <option value="easy">{t("config.difficultyEasy")}</option>
                                <option value="normal">{t("config.difficultyNormal")}</option>
                                <option value="hard">{t("config.difficultyHard")}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    className="mt-6 w-full rounded bg-primary px-4 py-3 text-white transition-all hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                >
                    {t("config.startGame")}
                </button>
            </main>
        </div>
    );
}
