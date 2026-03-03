import React from "react";
import { FiEye, FiEyeOff, FiInfo } from "react-icons/fi";
import { useColorblindMode } from "@/hooks/useColorblindMode";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { LanguageSelector } from "@/components/common/LanguageSelector";

interface ShortcutHelpModalProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const ShortcutHelpModal: React.FC<ShortcutHelpModalProps> = ({
    isOpen,
    onOpen,
    onClose,
}) => {
    const { isColorblindMode, toggleColorblindMode } = useColorblindMode();
    const { t } = useAppTranslation();

    const shortcutOptions = [
        t("shortcuts.options.rotate"),
        t("shortcuts.options.config"),
        t("shortcuts.options.help"),
        t("shortcuts.options.closeHelp"),
        t("shortcuts.options.moveBlock"),
        t("shortcuts.options.activateBlock"),
    ];

    return (
        <>
            <div className="fixed right-4 top-4 z-40 flex items-center gap-2">
                <LanguageSelector />

                <button
                    type="button"
                    onClick={toggleColorblindMode}
                    className="rounded-full bg-white p-2 text-zinc-700 shadow-md transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label={isColorblindMode ? t("colorblind.disable") : t("colorblind.enable")}
                    title={isColorblindMode ? t("colorblind.disable") : t("colorblind.enable")}
                >
                    {isColorblindMode ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>

                <button
                    type="button"
                    onClick={onOpen}
                    className="rounded-full bg-white p-2 text-zinc-700 shadow-md transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label={t("shortcuts.infoAria")}
                    title={t("shortcuts.infoTitle")}
                >
                    <FiInfo className="h-5 w-5" />
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4">
                    <div
                        className="w-full max-w-md rounded-lg bg-white p-6 text-left text-black shadow-lg"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="shortcuts-title"
                    >
                        <h2 id="shortcuts-title" className="text-2xl font-bold">{t("shortcuts.heading")}</h2>
                        <ul className="mt-4 space-y-2 text-sm">
                            {shortcutOptions.map((option) => (
                                <li key={option}>
                                    <span>{option}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                        >
                            {t("shortcuts.close")}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
