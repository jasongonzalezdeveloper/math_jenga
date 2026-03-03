import { useCallback, useEffect, useState } from "react";
import { Cube } from "@/models/Cube";
import { useStore } from "@/store/useStore";

const COLORS: Record<number, string> = {
    1: "#0070f3",
    2: "#388e4a",
    3: "#da3036",
    4: "#f1a10d",
    5: "#a1a1a1",
    6: "#ad1966",
};

const FORCE_COLLAPSE_ON_REMOVE = false;
const PROTECTED_TOP_ROWS = 3;

const createCubeQuestion = () => {
    const firstNumRandom = Math.floor(Math.random() * 10) + 1;
    let question: string = firstNumRandom.toString();
    let answer: number = firstNumRandom;

    const operationQuantity = Math.floor(Math.random() * 2) + 1;

    for (let index = 0; index < operationQuantity; index++) {
        const opRandom = Math.floor(Math.random() * 2) + 1;
        const numRandom = Math.floor(Math.random() * 10) + 1;

        if (opRandom === 1) {
            question += " + " + numRandom;
            answer += numRandom;
        }

        if (opRandom === 2) {
            question += " - " + numRandom;
            answer -= numRandom;
        }
    }

    return {
        question,
        answer,
    };
};

const createInitialTower = () => {
    const tower: Cube[][] = Array.from({ length: 18 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) => {
            const id = row * 3 + col + 1;
            const color = COLORS[Math.floor(Math.random() * 6) + 1];
            const cubeQuestion = createCubeQuestion();

            return {
                id,
                color,
                row,
                col,
                shake: Math.floor(Math.random() * 81) + 20,
                question: cubeQuestion.question,
                answer: cubeQuestion.answer,
            };
        }),
    );

    return tower;
};

export const useJengaLogic = () => {
    const { cubeClicked, setCubeClicked, isCorrect, setIsCorrect, loseGame, settings } = useStore();
    const isShakeEnabled = settings.defeatConditions.includes("shake");

    const [jengaTower, setJengaTower] = useState<Cube[][]>(createInitialTower);
    const [hoveredCubeId, setHoveredCubeId] = useState<number | null>(null);
    const [movedToTopCount, setMovedToTopCount] = useState(0);

    const isProtectedTopRow = useCallback((rowIndex: number, towerHeight: number) => {
        const topRowIndex = towerHeight - 1;
        const protectedFromRow = Math.max(0, topRowIndex - (PROTECTED_TOP_ROWS - 1));
        return rowIndex >= protectedFromRow;
    }, []);

    const shouldCollapseBySupportLogic = useCallback((row: Cube[], rowIndex: number, topRowIndex: number) => {
        if (rowIndex === topRowIndex) {
            return false;
        }

        const activeCols = row.filter((block) => !block.isEmpty).map((block) => block.col);

        if (activeCols.length === 0) {
            return true;
        }

        if (activeCols.length === 1) {
            return activeCols[0] !== 1;
        }

        return false;
    }, []);

    const getRemovalCollapseChanceOutOf1000 = useCallback((row: Cube[], rowIndex: number, topRowIndex: number) => {
        if (rowIndex === topRowIndex) {
            return 0;
        }

        const activeCols = row.filter((block) => !block.isEmpty).map((block) => block.col);

        if (activeCols.length <= 1) {
            return 1000;
        }

        if (activeCols.length === 2) {
            const hasCenter = activeCols.includes(1);
            return hasCenter ? 140 : 260;
        }

        return 60;
    }, []);

    const handleClick = useCallback((cube?: Cube) => {
        if (cube && !cube.isEmpty) {
            if (jengaTower.length > 0 && isProtectedTopRow(cube.row, jengaTower.length)) {
                return;
            }

            setCubeClicked(cube);
            return;
        }

        if (!isCorrect || !cube || !cubeClicked || jengaTower.length === 0) {
            return;
        }

        const sourceRow = cubeClicked.row;
        const newTower = jengaTower.map((row) =>
            row.map((currentCube) => {
                if (currentCube.row === cube.row && currentCube.col === cube.col) {
                    return {
                        ...cubeClicked,
                        row: currentCube.row,
                        col: currentCube.col,
                        isEmpty: false,
                    };
                }

                if (currentCube.row === cubeClicked.row && currentCube.col === cubeClicked.col) {
                    return {
                        ...currentCube,
                        isEmpty: true,
                        color: "white",
                        shake: 0,
                    };
                }

                return currentCube;
            }),
        );

        setJengaTower(newTower);
        setMovedToTopCount((prev) => prev + 1);

        const topRowIndex = newTower.length - 1;
        const sourceRowAfterMove = newTower[sourceRow] ?? [];

        const shouldCollapseByLogic = shouldCollapseBySupportLogic(
            sourceRowAfterMove,
            sourceRow,
            topRowIndex,
        );

        if (shouldCollapseByLogic) {
            loseGame();
        } else if (isShakeEnabled) {
            const collapseChanceOutOf1000 = FORCE_COLLAPSE_ON_REMOVE
                ? 1000
                : getRemovalCollapseChanceOutOf1000(
                    sourceRowAfterMove,
                    sourceRow,
                    topRowIndex,
                );
            const collapseRoll = Math.floor(Math.random() * 1000) + 1;
            const didTowerCollapseByRemoval = collapseRoll <= collapseChanceOutOf1000;

            if (didTowerCollapseByRemoval) {
                loseGame();
            }
        }

        setCubeClicked(null);
        setHoveredCubeId(null);
        setIsCorrect(false);
    }, [
        cubeClicked,
        getRemovalCollapseChanceOutOf1000,
        isCorrect,
        jengaTower,
        loseGame,
        setCubeClicked,
        setIsCorrect,
        isProtectedTopRow,
        isShakeEnabled,
        shouldCollapseBySupportLogic,
    ]);

    const needJengaTowerEmptyCubes = useCallback(() => {
        if (!jengaTower || jengaTower.length === 0) {
            return false;
        }

        const lastRow = jengaTower[jengaTower.length - 1];
        const emptyCubesInLastRow = lastRow.filter((cube) => cube.isEmpty).length;
        return emptyCubesInLastRow === 0;
    }, [jengaTower]);

    useEffect(() => {
        if (isCorrect && jengaTower.length > 0 && needJengaTowerEmptyCubes()) {
            const tower: Cube[] = Array.from({ length: 3 }, (_, col) => {
                const id = jengaTower.length * 3 + col + 1;

                return {
                    id,
                    color: "white",
                    row: jengaTower.length,
                    col,
                    shake: 0,
                    question: "",
                    answer: 0,
                    isEmpty: true,
                };
            });

            const animationFrameId = window.requestAnimationFrame(() => {
                setJengaTower((prev) => [...prev, tower]);
            });

            return () => window.cancelAnimationFrame(animationFrameId);
        }

        return undefined;
    }, [isCorrect, jengaTower, needJengaTowerEmptyCubes]);

    const getSideRowColor = useCallback((row: Cube[]) => {
        const firstVisibleCube = row.find((cube) => !cube.isEmpty);
        return firstVisibleCube?.color ?? "white";
    }, []);

    const getShakeAngle = useCallback((shake: number) => {
        const normalizedShake = Math.min(320, Math.max(0, shake));
        const maxAngle = 2 + (normalizedShake / 320) * 24;
        return `${maxAngle}deg`;
    }, []);

    const getShakeDuration = useCallback((shake: number) => {
        const normalizedShake = Math.min(320, Math.max(0, shake));
        const durationMs = 560 - normalizedShake * 1.8;
        return `${Math.max(80, durationMs)}ms`;
    }, []);

    const getShakeMetrics = useCallback((cube: Cube, row: Cube[], topMoved: number, rowIndex: number, topRowIndex: number) => {
        const isTopRow = rowIndex === topRowIndex;
        if (isTopRow) {
            return {
                dynamicShake: 0,
                collapseChanceOutOf1000: 0,
                isHighRisk: false,
            };
        }

        const activeBlocks = row.filter((block) => !block.isEmpty).length;
        const isLastCubeInRow = activeBlocks <= 1;

        if (isLastCubeInRow) {
            return {
                dynamicShake: 320,
                collapseChanceOutOf1000: 1000,
                isHighRisk: true,
            };
        }

        const baseShake = Math.max(0, cube.shake ?? 0);
        const missingBlocks = 3 - activeBlocks;

        const baseIntensity = 20 + (baseShake / 100) * 130;
        const rowBoost = missingBlocks * 70;
        const topBoost = Math.min(220, topMoved * 4);

        const dynamicShake = Math.min(320, baseIntensity + rowBoost + topBoost);
        const collapseChanceOutOf1000 = Math.min(900, Math.round(dynamicShake * 2.6));
        const isHighRisk = collapseChanceOutOf1000 >= 700;

        return {
            dynamicShake,
            collapseChanceOutOf1000,
            isHighRisk,
        };
    }, []);

    return {
        hoveredCubeId,
        jengaTower,
        movedToTopCount,
        setHoveredCubeId,
        handleClick,
        getSideRowColor,
        getShakeAngle,
        getShakeDuration,
        getShakeMetrics,
    };
};
