"use client";

import { DefeatCondition } from "@/models/GameSettings";
import { useStore } from "@/store/useStore";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ConfigPage() {
    const router = useRouter();
    const { t } = useAppTranslation();
    const { settings, setDefeatConditions, resetLifes } = useStore();
    const defaultSettingsRef = useRef<HTMLInputElement>(null);
    const oneLifeRef = useRef<HTMLInputElement>(null);
    const shakeRef = useRef<HTMLInputElement>(null);
    const optionRefs = useMemo(() => [defaultSettingsRef, oneLifeRef, shakeRef], []);

    useEffect(() => {
        defaultSettingsRef.current?.focus();
    }, []);

    const toggleDefeatCondition = useCallback((condition: DefeatCondition) => {
        const hasCondition = settings.defeatConditions.includes(condition);
        if (hasCondition) {
            setDefeatConditions(settings.defeatConditions.filter((item) => item !== condition));
            return;
        }

        setDefeatConditions([...settings.defeatConditions, condition]);
    }, [settings.defeatConditions, setDefeatConditions]);

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

    const handleOptionArrowNavigation = useCallback((event: React.KeyboardEvent<HTMLElement>, currentIndex: number) => {
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
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black px-4">
            <main className="w-full max-w-xl rounded-lg bg-white p-6 text-black shadow-lg">
                <div className="mb-4 flex justify-end">
                    <LanguageSelector />
                </div>

                <h1 className="text-3xl font-bold text-center">{t("config.title")}</h1>

                <div className="mt-6 space-y-3 text-left">
                    <div className="rounded border border-zinc-300 p-4">
                        <div className="font-semibold">{t("config.defaultTitle")}</div>
                        <p className="mt-1 text-sm text-zinc-700">
                            {t("config.defaultDescription")}
                        </p>
                        <label className="mb-2 flex items-center gap-2">
                            <input
                                ref={defaultSettingsRef}
                                type="checkbox"
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
                                checked={settings.defeatConditions.includes("shake")}
                                onChange={() => toggleDefeatCondition("shake")}
                                onKeyDown={(event) => handleOptionArrowNavigation(event, 2)}
                            />
                            <span>{t("config.loseChance")}</span>
                        </label>
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    className="mt-6 w-full rounded bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 transition-colors"
                >
                    {t("config.startGame")}
                </button>
            </main>
        </div>
    );
}
