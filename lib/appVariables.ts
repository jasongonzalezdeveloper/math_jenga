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
        1: "#0070f3",
        2: "#388e4a",
        3: "#da3036",
        4: "#f1a10d",
        5: "#a1a1a1",
        6: "#ad1966",
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
