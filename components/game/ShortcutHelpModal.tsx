import React from "react";
import { FiInfo } from "react-icons/fi";

interface ShortcutHelpModalProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const shortcutOptions = [
    "R: girar la torre",
    "C: abrir configuración",
    "I: abrir/cerrar esta ayuda",
    "Esc: cerrar ayuda",
    "Flechas: mover selector de bloque",
    "Enter / Espacio: activar bloque enfocado",
];

export const ShortcutHelpModal: React.FC<ShortcutHelpModalProps> = ({
    isOpen,
    onOpen,
    onClose,
}) => {
    return (
        <>
            <button
                type="button"
                onClick={onOpen}
                className="fixed right-4 top-4 z-40 rounded-full bg-white p-2 text-zinc-700 shadow-md transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label="Información de atajos"
                title="Atajos de teclado"
            >
                <FiInfo className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4">
                    <div
                        className="w-full max-w-md rounded-lg bg-white p-6 text-left text-black shadow-lg"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="shortcuts-title"
                    >
                        <h2 id="shortcuts-title" className="text-2xl font-bold">Atajos de teclado</h2>
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
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
