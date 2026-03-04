"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Jenga from "@/lib/Jenga";
import QuestionModal from "@/lib/QuestionModal";
import { useStore } from "@/store/useStore";
import { useGameShortcuts } from "@/hooks/useGameShortcuts";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { GameStatusPanel } from "@/components/game/GameStatusPanel";
import { ShortcutHelpModal } from "@/components/game/ShortcutHelpModal";

export default function GamePage() {
    const router = useRouter();
    const { t } = useAppTranslation();
    const { lifes, isCorrect } = useStore();
    const [isRightSide, setIsRightSide] = useState(false);

    const handleRotate = useCallback(() => {
        setIsRightSide((prev) => !prev);
    }, []);

    const handleBackToConfig = useCallback(() => {
        router.push("/config");
    }, [router]);

    const handleRestart = useCallback(() => {
        window.location.assign("config");
    }, []);

    const { isShortcutModalOpen, openShortcutModal, closeShortcutModal } = useGameShortcuts({
        onRotate: handleRotate,
        onOpenConfig: handleBackToConfig,
    });

    useEffect(() => {
        openShortcutModal();
    }, [openShortcutModal]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex w-full flex-col items-center justify-center px-4 text-center">
                <ShortcutHelpModal
                    isOpen={isShortcutModalOpen}
                    onOpen={openShortcutModal}
                    onClose={closeShortcutModal}
                />
                <p className="sr-only" aria-live="polite">
                    {t("game.screenReaderHint")}
                </p>
                <div className="relative w-full flex items-center justify-center">
                    <GameStatusPanel
                        lifes={lifes}
                        isRightSide={isRightSide}
                        onRotate={handleRotate}
                        onOpenConfig={handleBackToConfig}
                    />

                    <div className="w-full flex justify-center pt-20 lg:pt-0">
                        <Jenga
                            isRightSide={isRightSide}
                            onAutoRotateToSide={setIsRightSide}
                            disableKeyboardControls={isShortcutModalOpen}
                        />
                    </div>
                </div>
                <QuestionModal />
                {lifes === 0 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="rounded-lg bg-white px-8 py-6 text-center text-black shadow-lg">
                            <h2 className="text-3xl font-bold">{t("game.towerCollapsed")}</h2>
                            <button
                                type="button"
                                onClick={handleRestart}
                                className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                            >
                                {t("game.restart")}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
