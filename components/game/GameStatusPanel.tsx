"use client";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { FiArrowLeft, FiArrowRight, FiSettings } from "react-icons/fi";

interface GameStatusPanelProps {
    lifes: number;
    isRightSide: boolean;
    onRotate: () => void;
    onOpenConfig: () => void;
}

export function GameStatusPanel({
    lifes,
    isRightSide,
    onRotate,
    onOpenConfig,
}: GameStatusPanelProps) {
    const { t } = useAppTranslation();

    return (
        <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-3 pt-2 lg:absolute lg:top-1/2 lg:left-0 lg:inset-x-auto lg:bottom-auto lg:w-[30%] lg:-translate-y-1/2 lg:justify-start lg:px-0 lg:pb-0 lg:pt-0">
            <div className="relative w-full max-w-sm rounded border border-info/35 bg-surface p-3 text-left text-foreground shadow-sm lg:max-w-xs lg:p-4">
                <button
                    type="button"
                    onClick={onOpenConfig}
                    className="absolute right-2 top-2 rounded p-2 text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    aria-label={t("statusPanel.settingsAria")}
                    title={t("statusPanel.settingsTitle")}
                >
                    <FiSettings className="h-5 w-5" />
                </button>

                <div className="flex items-center justify-between gap-2 pr-10 lg:block lg:pr-0">
                    <div className="text-sm font-medium lg:pr-10 lg:text-lg" role="status" aria-live="polite" aria-atomic="true">
                        {t("statusPanel.lifesText", { count: lifes })}
                    </div>

                    <button
                        type="button"
                        onClick={onRotate}
                        className="inline-flex shrink-0 items-center gap-1 rounded bg-info px-3 py-1.5 text-sm text-white transition-all hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 lg:mt-4 lg:gap-2 lg:px-4 lg:py-2"
                        aria-label={isRightSide ? t("statusPanel.rotateLeftAria") : t("statusPanel.rotateRightAria")}
                        title={t("statusPanel.rotateTitle")}
                    >
                        {isRightSide ? (
                            <>
                                <FiArrowLeft className="h-4 w-4" />
                                {t("statusPanel.rotateLeft")}
                            </>
                        ) : (
                            <>
                                <FiArrowRight className="h-4 w-4" />
                                {t("statusPanel.rotateRight")}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
