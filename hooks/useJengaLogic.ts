import { useCallback, useEffect, useState } from "react";
import { Cube } from "@/models/Cube";
import { useStore } from "@/store/useStore";
import { JENGA_CONFIG } from "@/lib/appVariables";

const createCubeQuestion = () => {
    const firstNumRandom =
        Math.floor(Math.random() * JENGA_CONFIG.question.maxOperand) + JENGA_CONFIG.question.minOperand;
    let question: string = firstNumRandom.toString();
    let answer: number = firstNumRandom;

    const operationQuantity =
        Math.floor(Math.random() * JENGA_CONFIG.question.maxOperations) + JENGA_CONFIG.question.minOperations;

    for (let index = 0; index < operationQuantity; index++) {
        const opRandom = Math.floor(Math.random() * 2) + 1;
        const numRandom =
            Math.floor(Math.random() * JENGA_CONFIG.question.maxOperand) + JENGA_CONFIG.question.minOperand;

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
    const availableColorIds = Object.keys(JENGA_CONFIG.colorsById).map(Number);

    const tower: Cube[][] = Array.from({ length: 18 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) => {
            const id = row * 3 + col + 1;
            const colorId = availableColorIds[Math.floor(Math.random() * availableColorIds.length)];
            const color = JENGA_CONFIG.colorsById[colorId];
            const cubeQuestion = createCubeQuestion();

            return {
                id,
                color,
                row,
                col,
                shake:
                    Math.floor(
                        Math.random() * (JENGA_CONFIG.shake.maxInitial - JENGA_CONFIG.shake.minInitial + 1),
                    ) + JENGA_CONFIG.shake.minInitial,
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
    const [hoveredCubeKey, setHoveredCubeKey] = useState<string | null>(null);
    const [movedToTopCount, setMovedToTopCount] = useState(0);

    const isProtectedTopRow = useCallback((rowIndex: number, towerHeight: number) => {
        const topRowIndex = towerHeight - 1;
        const protectedFromRow = Math.max(0, topRowIndex - (JENGA_CONFIG.protectedTopRows - 1));
        return rowIndex >= protectedFromRow;
    }, []);

    const shouldCollapseBySupportLogic = useCallback((
        rowBeforeMove: Cube[],
        removedCube: Cube,
        rowIndex: number,
        topRowIndex: number,
    ) => {
        if (rowIndex === topRowIndex) {
            return false;
        }

        const activeColsBeforeMove = rowBeforeMove.filter((block) => !block.isEmpty).map((block) => block.col);
        const isCenterPresent = activeColsBeforeMove.includes(1);
        const isRemovingCenter = removedCube.col === 1;

        if (isRemovingCenter) {
            const hasBothSides = activeColsBeforeMove.includes(0) && activeColsBeforeMove.includes(2);
            return !hasBothSides;
        }

        return !isCenterPresent;
    }, []);

    const getRemovalCollapseChanceOutOf1000 = useCallback((
        rowBeforeMove: Cube[],
        removedCube: Cube,
        rowIndex: number,
        topRowIndex: number,
    ) => {
        if (rowIndex === topRowIndex) {
            return 0;
        }

        const activeColsBeforeMove = rowBeforeMove.filter((block) => !block.isEmpty).map((block) => block.col);
        const isCenterPresent = activeColsBeforeMove.includes(1);
        const isRemovingCenter = removedCube.col === 1;

        if (isRemovingCenter) {
            const hasBothSides = activeColsBeforeMove.includes(0) && activeColsBeforeMove.includes(2);
            return hasBothSides ? 140 : JENGA_CONFIG.collapse.baseScale;
        }

        return isCenterPresent ? 140 : JENGA_CONFIG.collapse.baseScale;
    }, []);

    const handleClick = useCallback((cube?: Cube) => {
        if (cube && !cube.isEmpty) {
            if (jengaTower.length > 0 && isProtectedTopRow(cube.row, jengaTower.length)) {
                return;
            }

            setHoveredCubeKey(`${cube.row}-${cube.col}`);
            setCubeClicked(cube);
            return;
        }

        if (!isCorrect || !cube || !cubeClicked || jengaTower.length === 0) {
            return;
        }

        const sourceRow = cubeClicked.row;
        const sourceRowBeforeMove = jengaTower[sourceRow] ?? [];
        const topRowIndex = jengaTower.length - 1;

        const shouldCollapseByLogic = shouldCollapseBySupportLogic(
            sourceRowBeforeMove,
            cubeClicked,
            sourceRow,
            topRowIndex,
        );

        const collapseChanceOutOf1000 = getRemovalCollapseChanceOutOf1000(
            sourceRowBeforeMove,
            cubeClicked,
            sourceRow,
            topRowIndex,
        );

        const movedCubeQuestion = createCubeQuestion();

        const newTower = jengaTower.map((row) =>
            row.map((currentCube) => {
                if (currentCube.row === cube.row && currentCube.col === cube.col) {
                    return {
                        ...cubeClicked,
                        row: currentCube.row,
                        col: currentCube.col,
                        question: movedCubeQuestion.question,
                        answer: movedCubeQuestion.answer,
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

        if (shouldCollapseByLogic) {
            loseGame();
        } else if (isShakeEnabled) {
            const collapseChanceOutOf1000ToApply = JENGA_CONFIG.forceCollapseOnRemove
                ? JENGA_CONFIG.collapse.baseScale
                : collapseChanceOutOf1000;
            const collapseRoll = Math.floor(Math.random() * JENGA_CONFIG.collapse.baseScale) + 1;
            const didTowerCollapseByRemoval = collapseRoll <= collapseChanceOutOf1000ToApply;

            if (didTowerCollapseByRemoval) {
                loseGame();
            }
        }

        setCubeClicked(null);
        setHoveredCubeKey(null);
        setIsCorrect(false);
    }, [
        cubeClicked,
        getRemovalCollapseChanceOutOf1000,
        isCorrect,
        jengaTower,
        loseGame,
        setCubeClicked,
        setHoveredCubeKey,
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

    }, [isCorrect, jengaTower, needJengaTowerEmptyCubes]);

    const getSideRowColor = useCallback((row: Cube[]) => {
        const firstVisibleCube = row.find((cube) => !cube.isEmpty);
        return firstVisibleCube?.color ?? "white";
    }, []);

    const getShakeAngle = useCallback((shake: number) => {
        const normalizedShake = Math.min(JENGA_CONFIG.shake.maxDynamic, Math.max(0, shake));
        const maxAngle =
            JENGA_CONFIG.shake.maxAngleBase +
            (normalizedShake / JENGA_CONFIG.shake.maxDynamic) * JENGA_CONFIG.shake.maxAngleExtra;
        return `${maxAngle}deg`;
    }, []);

    const getShakeDuration = useCallback((shake: number) => {
        const normalizedShake = Math.min(JENGA_CONFIG.shake.maxDynamic, Math.max(0, shake));
        const durationMs = JENGA_CONFIG.shake.maxDurationMs - normalizedShake * JENGA_CONFIG.shake.durationFactor;
        return `${Math.max(JENGA_CONFIG.shake.minDurationMs, durationMs)}ms`;
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
                dynamicShake: JENGA_CONFIG.shake.maxDynamic,
                collapseChanceOutOf1000: JENGA_CONFIG.collapse.baseScale,
                isHighRisk: true,
            };
        }

        const baseShake = Math.max(0, cube.shake ?? 0);
        const missingBlocks = 3 - activeBlocks;

        const baseIntensity = 20 + (baseShake / 100) * 130;
        const rowBoost = missingBlocks * 70;
        const topBoost = Math.min(220, topMoved * 4);

        const dynamicShake = Math.min(JENGA_CONFIG.shake.maxDynamic, baseIntensity + rowBoost + topBoost);
        const collapseChanceOutOf1000 = Math.min(900, Math.round(dynamicShake * 2.6));
        const isHighRisk = collapseChanceOutOf1000 >= 700;

        return {
            dynamicShake,
            collapseChanceOutOf1000,
            isHighRisk,
        };
    }, []);

    return {
        hoveredCubeKey,
        jengaTower,
        movedToTopCount,
        setHoveredCubeKey,
        handleClick,
        getSideRowColor,
        getShakeAngle,
        getShakeDuration,
        getShakeMetrics,
    };
};
