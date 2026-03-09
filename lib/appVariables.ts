export const APP_VIEWPORT = {
    mobileMaxWidthPx: 767,
} as const;

export const APP_MODAL = {
    mobileQuestionDelayMsWithShake: 450,
    closeAfterCorrectMs: 1000,
    scrollOnCorrectInMobile: true,
    scrollBehaviorOnCorrect: "smooth" as ScrollBehavior,
} as const;

export const APP_DEBUG = {
    showCollapseChanceOverlay: false,
    collapseChanceLabel: "Caída",
} as const;

export const JENGA_CONFIG = {
    forceCollapseOnRemove: false,
    protectedTopRows: 3,
    collapse: {
        baseScale: 1000,
    },
    colorsById: {
        1: "#0052cc",
        2: "#007f8c",
        3: "#b95f00",
        4: "#6a3fb8",
        5: "#1c7c54",
        6: "#b02a37",
    } as Record<number, string>,
    question: {
        minOperand: 1,
        maxOperand: 10,
        minOperations: 1,
        maxOperations: 2,
    },
    shake: {
        minInitial: 20,
        maxInitial: 100,
        maxDynamic: 320,
        minDurationMs: 80,
        maxDurationMs: 560,
        durationFactor: 1.8,
        maxAngleBase: 2,
        maxAngleExtra: 24,
    },
} as const;
