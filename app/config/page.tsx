"use client";

import { DefeatCondition } from "@/models/GameSettings";
import { useStore } from "@/store/useStore";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export default function ConfigPage() {
    const router = useRouter();
    const { settings, setDefeatConditions, resetLifes } = useStore();

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

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black px-4">
            <main className="w-full max-w-xl rounded-lg bg-white p-6 text-black shadow-lg">
                <h1 className="text-3xl font-bold text-center">Configuración</h1>

                <div className="mt-6 space-y-3 text-left">
                    <div className="rounded border border-zinc-300 bg-zinc-50 p-4">
                        <div className="font-semibold">Configuración por defecto</div>
                        <p className="mt-1 text-sm text-zinc-700">
                            3 vidas, sin posibilidad de perder por derrumbe en torre.
                        </p>
                        <button
                            type="button"
                            onClick={applyDefaultSettings}
                            className="mt-3 rounded bg-zinc-700 px-3 py-2 text-sm text-white hover:bg-zinc-800 transition-colors"
                        >
                            Usar configuración por defecto
                        </button>
                    </div>

                    <div className="rounded border border-zinc-300 p-4">
                        <label className="mb-2 flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={settings.defeatConditions.includes("oneLife")}
                                onChange={() => toggleDefeatCondition("oneLife")}
                            />
                            <span>1 vida</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={settings.defeatConditions.includes("shake")}
                                onChange={() => toggleDefeatCondition("shake")}
                            />
                            <span>Posibilidad de perder</span>
                        </label>
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    className="mt-6 w-full rounded bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 transition-colors"
                >
                    Iniciar partida
                </button>
            </main>
        </div>
    );
}
