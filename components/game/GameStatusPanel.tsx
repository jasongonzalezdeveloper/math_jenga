"use client";

import { useAppTranslation } from "@/hooks/useAppTranslation";
import { FiArrowLeft, FiArrowRight, FiSettings } from "react-icons/fi";

interface GameStatusPanelProps {
    lifes: number;
    isCorrect: boolean;
    isRightSide: boolean;
    onRotate: () => void;
    onOpenConfig: () => void;
}

export const GameStatusPanel: React.FC<GameStatusPanelProps> = ({
    lifes,
    isCorrect,
    isRightSide,
    onRotate,
    onOpenConfig,
}) => {
    const { t } = useAppTranslation();

    return (
        <div className="absolute top-0 left-1/2 z-10 w-full max-w-sm -translate-x-1/2 flex flex-col items-center lg:left-0 lg:top-1/2 lg:max-w-none lg:w-[30%] lg:translate-x-0 lg:-translate-y-1/2">
            {isCorrect && (
                <div className="mb-4 text-green-600 font-bold text-lg wrap-break-word overflow-hidden" role="status" aria-live="assertive">
                    {t("statusPanel.placeOnTop")}
                </div>
            )}

            <div className="relative w-full max-w-xs rounded border border-zinc-300 bg-white p-4 text-left text-black shadow-sm">
                <button
                    type="button"
                    onClick={onOpenConfig}
                    className="absolute right-2 top-2 rounded p-2 text-zinc-700 hover:bg-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label={t("statusPanel.settingsAria")}
                    title={t("statusPanel.settingsTitle")}
                >
                    <FiSettings className="h-5 w-5" />
                </button>

                <div className="pr-10 text-lg" role="status" aria-live="polite" aria-atomic="true">
                    {t("statusPanel.lifesText", { count: lifes })}
                </div>

                <button
                    type="button"
                    onClick={onRotate}
                    className="mt-4 inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
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
    );
};
