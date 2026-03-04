import { useCallback, useEffect, useState } from "react";

interface UseGameShortcutsParams {
    onRotate: () => void;
    onOpenConfig: () => void;
}

export const useGameShortcuts = ({ onRotate, onOpenConfig }: UseGameShortcutsParams) => {
    const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);

    const openShortcutModal = useCallback(() => {
        setIsShortcutModalOpen(true);
    }, []);

    const closeShortcutModal = useCallback(() => {
        setIsShortcutModalOpen(false);
    }, []);

    useEffect(() => {
        const onGlobalKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const tagName = target?.tagName?.toLowerCase();
            const isTypingContext =
                tagName === "input" ||
                tagName === "textarea" ||
                tagName === "select" ||
                target?.isContentEditable;

            if (isTypingContext) {
                return;
            }

            const key = event.key.toLowerCase();

            if (key === "i") {
                event.preventDefault();
                if (!isShortcutModalOpen) {
                    openShortcutModal();
                }
                return;
            }

            if (isShortcutModalOpen) {
                return;
            }

            if (key === "r") {
                event.preventDefault();
                onRotate();
                return;
            }

            if (key === "c") {
                event.preventDefault();
                onOpenConfig();
                return;
            }
        };

        window.addEventListener("keydown", onGlobalKeyDown);
        return () => window.removeEventListener("keydown", onGlobalKeyDown);
    }, [isShortcutModalOpen, onOpenConfig, onRotate, openShortcutModal]);

    return {
        isShortcutModalOpen,
        openShortcutModal,
        closeShortcutModal,
    };
};
