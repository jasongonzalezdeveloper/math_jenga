"use client";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

interface GameStatusPanelProps {
    lifes: number;
    score: number;
    isRightSide: boolean;
    onRotate: () => void;
}

export function GameStatusPanel({
    lifes,
    score,
    isRightSide,
    onRotate,
}: GameStatusPanelProps) {
    const { t } = useAppTranslation();

    return (
        <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-3 pt-2 lg:inset-x-auto lg:bottom-auto lg:top-4 lg:left-4 lg:justify-start lg:px-0 lg:pb-0 lg:pt-0">
            <div className="relative w-full max-w-sm rounded border border-info/35 bg-surface p-3 text-left text-foreground shadow-sm lg:max-w-xs lg:p-4">
                <div className="flex items-center justify-between gap-2 lg:block">
                    <div className="text-sm font-medium lg:pr-10 lg:text-lg" role="status" aria-live="polite" aria-atomic="true">
                        {t("statusPanel.lifesText", { count: lifes })}
                    </div>
                    <div className="text-sm font-medium lg:mt-1 lg:text-base" role="status" aria-live="polite" aria-atomic="true">
                        {t("statusPanel.scoreText", { count: score })}
                    </div>

                    <button
                        type="button"
                        onClick={onRotate}
                        className="cursor-pointer inline-flex shrink-0 items-center gap-1 rounded bg-info px-3 py-1.5 text-sm text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-info/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 lg:mt-4 lg:gap-2 lg:px-4 lg:py-2"
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
