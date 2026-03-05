"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useJengaLogic } from "@/hooks/useJengaLogic";
import { useStore } from "@/store/useStore";
import { APP_DEBUG } from "@/lib/appVariables";
import { JengaTower } from "@/components/game/JengaTower";

interface JengaProps {
  isRightSide: boolean;
  onAutoRotateToSide?: (nextRightSide: boolean) => void;
  disableKeyboardControls?: boolean;
}

const Jenga: React.FC<JengaProps> = ({ isRightSide, onAutoRotateToSide, disableKeyboardControls = false }) => {
  const { settings, isCorrect, cubeClicked } = useStore();
  const isShakeEnabled = settings.defeatConditions.includes("shake");
  const [isKeyboardNavigationActive, setIsKeyboardNavigationActive] = useState(false);

  const {
    hoveredCubeKey,
    jengaTower,
    movedToTopCount,
    setHoveredCubeKey,
    handleClick,
    getSideRowColor,
    getShakeAngle,
    getShakeDuration,
    getShakeMetrics,
  } = useJengaLogic();

  const getCubeHoverKey = useCallback((row: number, col: number) => `${row}-${col}`, []);

  const topRowIndex = jengaTower.length - 1;
  const topRow = useMemo(
    () => (topRowIndex >= 0 ? jengaTower[topRowIndex] : []),
    [jengaTower, topRowIndex],
  );
  const isPlacingCubeOnTop = Boolean(isCorrect && cubeClicked);

  const hoveredCube = useMemo(() => {
    if (!hoveredCubeKey) {
      return null;
    }

    for (const row of jengaTower) {
      for (const cube of row) {
        if (`${cube.row}-${cube.col}` === hoveredCubeKey) {
          return cube;
        }
      }
    }

    return null;
  }, [hoveredCubeKey, jengaTower]);

  const collapseChanceDebug = useMemo(() => {
    if (!isShakeEnabled || !hoveredCube || hoveredCube.isEmpty || jengaTower.length === 0) {
      return 0;
    }

    const row = jengaTower[hoveredCube.row] ?? [];
    const metrics = getShakeMetrics(
      hoveredCube,
      row,
      movedToTopCount,
      hoveredCube.row,
      jengaTower.length - 1,
    );

    return metrics.collapseChanceOutOf1000;
  }, [getShakeMetrics, hoveredCube, isShakeEnabled, jengaTower, movedToTopCount]);

  const keyboardNavigableCubes = useMemo(() => {
    if (isPlacingCubeOnTop && topRow.length > 0) {
      const topIsEven = topRowIndex % 2 === 0;
      const topOrientationHorizontal = isRightSide ? topIsEven : !topIsEven;

      if (!topOrientationHorizontal) {
        return [];
      }

      return topRow
        .filter((cube) => cube.isEmpty)
        .map((cube) => ({
          key: getCubeHoverKey(cube.row, cube.col),
          cube,
        }));
    }

    return jengaTower
      .flatMap((row, rowIndex) => {
        const isEven = rowIndex % 2 === 0;
        const orientationHorizontal = isRightSide ? isEven : !isEven;
        if (!orientationHorizontal) {
          return [];
        }

        const protectedTopStartIndex = Math.max(0, jengaTower.length - 3);
        const isProtectedTopRow = rowIndex >= protectedTopStartIndex;

        return row
          .filter((cube) => !cube.isEmpty && !(isProtectedTopRow && !cube.isEmpty))
          .map((cube) => ({
            key: getCubeHoverKey(cube.row, cube.col),
            cube,
          }));
      });
  }, [getCubeHoverKey, isPlacingCubeOnTop, isRightSide, jengaTower, topRow, topRowIndex]);

  useEffect(() => {
    if (!isPlacingCubeOnTop || topRow.length === 0) {
      return;
    }

    const hasEmptyTopCube = topRow.some((cube) => cube.isEmpty);
    if (!hasEmptyTopCube) {
      return;
    }

    const desiredRightSide = topRowIndex % 2 === 0;
    if (onAutoRotateToSide && isRightSide !== desiredRightSide) {
      onAutoRotateToSide(desiredRightSide);
    }

    if (isKeyboardNavigationActive) {
      const firstEmptyTopCube = topRow.find((cube) => cube.isEmpty);
      if (firstEmptyTopCube) {
        setHoveredCubeKey(getCubeHoverKey(firstEmptyTopCube.row, firstEmptyTopCube.col));
      }
    }
  }, [
    getCubeHoverKey,
    isKeyboardNavigationActive,
    isPlacingCubeOnTop,
    isRightSide,
    onAutoRotateToSide,
    setHoveredCubeKey,
    topRow,
    topRowIndex,
  ]);

  const moveKeyboardSelection = useCallback((delta: number) => {
    if (keyboardNavigableCubes.length === 0) {
      return;
    }

    if (hoveredCubeKey === null) {
      setHoveredCubeKey(keyboardNavigableCubes[0].key);
      return;
    }

    const currentIndex = keyboardNavigableCubes.findIndex((item) => item.key === hoveredCubeKey);
    const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (safeCurrentIndex + delta + keyboardNavigableCubes.length) % keyboardNavigableCubes.length;
    setHoveredCubeKey(keyboardNavigableCubes[nextIndex].key);
  }, [hoveredCubeKey, keyboardNavigableCubes, setHoveredCubeKey]);

  const activateKeyboardSelectedCube = useCallback(() => {
    if (hoveredCubeKey === null) {
      return;
    }

    const selected = keyboardNavigableCubes.find((item) => item.key === hoveredCubeKey);
    if (!selected) {
      return;
    }

    handleClick(selected.cube);
  }, [handleClick, hoveredCubeKey, keyboardNavigableCubes]);

  const handleKeyboardNavigation = useCallback((key: string, preventDefault: () => void) => {
    if (disableKeyboardControls) {
      return;
    }

    setIsKeyboardNavigationActive(true);

    if (key === "ArrowRight" || key === "ArrowUp") {
      preventDefault();
      moveKeyboardSelection(1);
      return;
    }

    if (key === "ArrowLeft" || key === "ArrowDown") {
      preventDefault();
      moveKeyboardSelection(-1);
      return;
    }

    if (key === "Enter" || key === " ") {
      preventDefault();
      activateKeyboardSelectedCube();
    }
  }, [activateKeyboardSelectedCube, disableKeyboardControls, moveKeyboardSelection]);

  const handleBoardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    handleKeyboardNavigation(event.key, () => event.preventDefault());
  };

  useEffect(() => {
    const onWindowKeyDown = (event: KeyboardEvent) => {
      if (disableKeyboardControls) {
        return;
      }

      if (event.defaultPrevented) {
        return;
      }

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

      const isNavigationKey =
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowDown" ||
        event.key === "Enter" ||
        event.key === " ";

      if (!isNavigationKey) {
        return;
      }

      handleKeyboardNavigation(event.key, () => event.preventDefault());
    };

    window.addEventListener("keydown", onWindowKeyDown);
    return () => window.removeEventListener("keydown", onWindowKeyDown);
  }, [disableKeyboardControls, handleKeyboardNavigation]);

  return (
    <div
      data-jenga-board="true"
      className="flex flex-col items-center justify-center"
      role="group"
      tabIndex={0}
      aria-label="Tablero de bloques Jenga. Usa flechas para moverte entre bloques y Enter o Espacio para activar."
      onFocus={() => {
        if (hoveredCubeKey === null && keyboardNavigableCubes.length > 0) {
          setHoveredCubeKey(keyboardNavigableCubes[0].key);
        }
      }}
      onKeyDown={handleBoardKeyDown}
    >
      {APP_DEBUG.showCollapseChanceOverlay && (
        <div className="fixed left-2 top-2 z-50 rounded bg-black/75 px-2 py-1 text-xs font-semibold text-white">
          {APP_DEBUG.collapseChanceLabel}: {collapseChanceDebug}
        </div>
      )}

      <div className="transform-gpu transition-transform duration-500">
        <JengaTower
          jengaTower={jengaTower}
          isRightSide={isRightSide}
          topRowIndex={topRowIndex}
          movedToTopCount={movedToTopCount}
          hoveredCubeKey={hoveredCubeKey}
          isShakeEnabled={isShakeEnabled}
          getCubeHoverKey={getCubeHoverKey}
          getSideRowColor={getSideRowColor}
          getShakeMetrics={getShakeMetrics}
          getShakeDuration={getShakeDuration}
          getShakeAngle={getShakeAngle}
          onCubeHover={(cubeHoverKey) => {
            setIsKeyboardNavigationActive(false);
            setHoveredCubeKey(cubeHoverKey);
          }}
          onCubeLeave={() => setHoveredCubeKey(null)}
          onCubeActivate={handleClick}
        />
      </div>
    </div>
  );
};

export default Jenga;
