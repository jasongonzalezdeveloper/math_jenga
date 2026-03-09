import { FiEye, FiEyeOff, FiInfo } from "react-icons/fi";
import {
    BsArrowDownSquare,
    BsArrowLeftSquare,
    BsArrowRightSquare,
    BsArrowUpSquare,
} from "react-icons/bs";
import { HiOutlineArrowTurnDownLeft } from "react-icons/hi2";
import { MdSpaceBar } from "react-icons/md";
import { useColorblindMode } from "@/hooks/useColorblindMode";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { LanguageSelector } from "@/components/common/LanguageSelector";

interface ShortcutHelpModalProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export function ShortcutHelpModal({
    isOpen,
    onOpen,
    onClose,
}: ShortcutHelpModalProps) {
    const { isColorblindMode, toggleColorblindMode } = useColorblindMode();
    const { t } = useAppTranslation();

    const iconClassName = "h-4 w-4";
    const keyClassName =
        "inline-flex items-center gap-1 rounded border border-info/35 bg-background px-2 py-1 text-xs font-semibold";

    const shortcutOptions = [
        {
            id: "rotate",
            keys: <span className={keyClassName}>R</span>,
            action: t("shortcuts.options.rotate"),
        },
        {
            id: "config",
            keys: <span className={keyClassName}>C</span>,
            action: t("shortcuts.options.config"),
        },
        {
            id: "help",
            keys: <span className={keyClassName}>I</span>,
            action: t("shortcuts.options.help"),
        },
        {
            id: "closeHelp",
            keys: (
                <span className={keyClassName}>
                    ESC
                </span>
            ),
            action: t("shortcuts.options.closeHelp"),
        },
        {
            id: "moveBlock",
            keys: (
                <span className={keyClassName}>
                    <BsArrowLeftSquare className={iconClassName} aria-hidden="true" />
                    <BsArrowRightSquare className={iconClassName} aria-hidden="true" />
                    <BsArrowUpSquare className={iconClassName} aria-hidden="true" />
                    <BsArrowDownSquare className={iconClassName} aria-hidden="true" />
                </span>
            ),
            action: t("shortcuts.options.moveBlock"),
        },
        {
            id: "activateBlock",
            keys: (
                <span className={keyClassName}>
                    <HiOutlineArrowTurnDownLeft className={iconClassName} aria-hidden="true" />
                    <MdSpaceBar className={iconClassName} aria-hidden="true" />
                </span>
            ),
            action: t("shortcuts.options.activateBlock"),
        },
    ];

    const gameInstructions = [
        t("shortcuts.instructions.move"),
        t("shortcuts.instructions.activate"),
        t("shortcuts.instructions.answer"),
        t("shortcuts.instructions.sign"),
        t("shortcuts.instructions.goal"),
    ];

    return (
        <>
            <div className="fixed right-4 top-4 z-40 flex items-center gap-2">
                <LanguageSelector />

                <button
                    type="button"
                    onClick={toggleColorblindMode}
                    className="cursor-pointer rounded-full border border-secondary/35 bg-surface p-2 text-foreground shadow-md transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    aria-label={isColorblindMode ? t("colorblind.disable") : t("colorblind.enable")}
                    title={isColorblindMode ? t("colorblind.disable") : t("colorblind.enable")}
                >
                    {isColorblindMode ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>

                <button
                    type="button"
                    onClick={onOpen}
                    className="cursor-pointer rounded-full border border-secondary/35 bg-surface p-2 text-foreground shadow-md transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    aria-label={t("shortcuts.infoAria")}
                    title={t("shortcuts.infoTitle")}
                >
                    <FiInfo className="h-5 w-5" />
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4">
                    <div
                        className="w-full max-w-md rounded-lg border border-secondary/35 bg-surface p-6 text-left text-foreground shadow-lg"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="shortcuts-title"
                    >
                        <h2 id="shortcuts-title" className="text-2xl font-bold">{t("shortcuts.heading")}</h2>
                        <div className="mt-4 space-y-4 text-sm">
                            <section>
                                <h3 className="text-base font-semibold">{t("shortcuts.instructionsHeading")}</h3>
                                <ul className="mt-2 space-y-2">
                                    {gameInstructions.map((instruction) => (
                                        <li key={instruction}>
                                            <span>{instruction}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="hidden md:block">
                                <h3 className="text-base font-semibold">{t("shortcuts.shortcutsHeading")}</h3>
                                <ul className="mt-2 space-y-2">
                                    {shortcutOptions.map((option) => (
                                        <li key={option.id} className="flex items-center gap-2">
                                            <span aria-hidden="true">{option.keys}</span>
                                            <span>{option.action}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer mt-6 rounded bg-primary px-4 py-2 text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                        >
                            {t("shortcuts.accept")}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
