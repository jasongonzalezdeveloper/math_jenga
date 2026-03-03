"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useJengaLogic } from "@/hooks/useJengaLogic";
import { useStore } from "@/store/useStore";

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
      <div className="transform-gpu transition-transform duration-500">
        {jengaTower.length > 0 &&
          jengaTower
            .slice()
            .reverse()
            .map((row, revIndex) => {
              const actualRowIndex = jengaTower.length - 1 - revIndex;
              const protectedTopStartIndex = Math.max(0, jengaTower.length - 3);
              const isProtectedTopRow = actualRowIndex >= protectedTopStartIndex;
              const isEven = actualRowIndex % 2 === 0;
              const orientationHorizontal = isRightSide ? isEven : !isEven;
              return (
                <div
                  key={actualRowIndex}
                  className={`flex items-center justify-center my-1 h-10 ${isEven ? "px-1" : ""}`}
                  style={
                    !orientationHorizontal
                      ? {
                        backgroundColor: getSideRowColor(row),
                      }
                      : {}
                  }
                >
                  {row.map((cube) => {
                    const isCubeSelectionBlocked = !cube.isEmpty && isProtectedTopRow;
                    const isTopEmptyCube = cube.isEmpty && actualRowIndex === topRowIndex;
                    const { dynamicShake, isHighRisk } = getShakeMetrics(
                      cube,
                      row,
                      movedToTopCount,
                      actualRowIndex,
                      jengaTower.length - 1,
                    );
                    const cubeShake = Math.min(320, Math.max(0, dynamicShake));
                    const cubeHoverKey = getCubeHoverKey(cube.row, cube.col);
                    const isHoveredNonEmptyCube = hoveredCubeKey === cubeHoverKey && !cube.isEmpty;
                    const isHoveredHighlightCube = hoveredCubeKey === cubeHoverKey && (!cube.isEmpty || isTopEmptyCube);
                    const cubeStyle: React.CSSProperties & {
                      [key: string]: string | number;
                    } = {
                      backgroundColor: cube.color,
                    };

                    if (isShakeEnabled && isHoveredNonEmptyCube && cubeShake > 0) {
                      cubeStyle.animation = `tilt-shaking ${getShakeDuration(cubeShake)} ease-in-out infinite`;
                      cubeStyle["--shake-angle"] = getShakeAngle(cubeShake);
                    }

                    return (
                      <div
                        key={cubeHoverKey}
                        data-protected-row={isProtectedTopRow ? "true" : "false"}
                        role={orientationHorizontal ? "button" : undefined}
                        tabIndex={-1}
                        aria-disabled={isCubeSelectionBlocked}
                        aria-label={`${cube.isEmpty ? "Espacio vacío" : `Bloque ${cube.id}`}, fila ${actualRowIndex + 1}, columna ${cube.col + 1}${isCubeSelectionBlocked ? ", no seleccionable" : ""}${isShakeEnabled && isHighRisk ? ", riesgo alto" : ""}`}
                        className={`${orientationHorizontal
                          ? `relative flex items-center justify-center text-white border border-black/20 shadow-sm mx-1 select-none h-10 w-15 ${isCubeSelectionBlocked ? "cursor-not-allowed" : "cursor-pointer"} ${isHoveredHighlightCube ? "ring-2 ring-blue-600 ring-offset-2" : ""} ${isShakeEnabled && isHoveredNonEmptyCube && isHighRisk ? "animate-pulse ring-2 ring-red-600" : ""}`
                          : "hidden"
                          }`}
                        style={cubeStyle}
                        onClick={() => handleClick(cube)}
                        onMouseEnter={() => {
                          setIsKeyboardNavigationActive(false);
                          setHoveredCubeKey(cubeHoverKey);
                        }}
                        onMouseLeave={() => setHoveredCubeKey(null)}
                      >
                        {!cube.isEmpty && <span className="text-sm font-medium">{cube.id}</span>}
                        {isShakeEnabled && isHoveredNonEmptyCube && isHighRisk && (
                          <span className="absolute -top-2 -right-2 rounded bg-red-600 px-1 text-[10px] font-bold text-white">
                            !
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Jenga;
