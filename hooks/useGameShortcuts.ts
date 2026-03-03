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

    const toggleShortcutModal = useCallback(() => {
        setIsShortcutModalOpen((prev) => !prev);
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

            if (key === "escape" && isShortcutModalOpen) {
                event.preventDefault();
                closeShortcutModal();
                return;
            }

            if (key === "i") {
                event.preventDefault();
                toggleShortcutModal();
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
    }, [closeShortcutModal, isShortcutModalOpen, onOpenConfig, onRotate, toggleShortcutModal]);

    return {
        isShortcutModalOpen,
        openShortcutModal,
        closeShortcutModal,
        toggleShortcutModal,
    };
};
