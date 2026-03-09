import type { CSSProperties } from "react";
import type { Cube } from "@/models/Cube";

interface JengaTowerProps {
    jengaTower: Cube[][];
    isRightSide: boolean;
    topRowIndex: number;
    movedToTopCount: number;
    hoveredCubeKey: string | null;
    isShakeEnabled: boolean;
    getCubeHoverKey: (row: number, col: number) => string;
    getSideRowColor: (row: Cube[]) => string;
    getShakeMetrics: (
        cube: Cube,
        row: Cube[],
        topMoved: number,
        rowIndex: number,
        topRowIndex: number,
    ) => {
        dynamicShake: number;
        collapseChanceOutOf1000: number;
        isHighRisk: boolean;
    };
    getShakeDuration: (shake: number) => string;
    getShakeAngle: (shake: number) => string;
    onCubeHover: (cubeHoverKey: string) => void;
    onCubeLeave: () => void;
    onCubeActivate: (cube: Cube) => void;
}

export function JengaTower({
    jengaTower,
    isRightSide,
    topRowIndex,
    movedToTopCount,
    hoveredCubeKey,
    isShakeEnabled,
    getCubeHoverKey,
    getSideRowColor,
    getShakeMetrics,
    getShakeDuration,
    getShakeAngle,
    onCubeHover,
    onCubeLeave,
    onCubeActivate,
}: JengaTowerProps) {
    return (
        <>
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
                                    const cubeStyle: CSSProperties & {
                                        [key: string]: string | number;
                                    } = {
                                        backgroundColor: cube.color,
                                    };

                                    if (isShakeEnabled && isHoveredNonEmptyCube && cubeShake > 0) {
                                        cubeStyle.animation = `tilt-shaking ${getShakeDuration(cubeShake)} ease-in-out infinite`;
                                        cubeStyle["--shake-angle"] = getShakeAngle(cubeShake);
                                    }

                                    if (!orientationHorizontal) {
                                        return (
                                            <div
                                                key={cubeHoverKey}
                                                data-protected-row={isProtectedTopRow ? "true" : "false"}
                                                className="hidden"
                                                aria-hidden="true"
                                            />
                                        );
                                    }

                                    return (
                                        <button
                                            key={cubeHoverKey}
                                            type="button"
                                            data-protected-row={isProtectedTopRow ? "true" : "false"}
                                            disabled={isCubeSelectionBlocked}
                                            aria-label={`${cube.isEmpty ? "Espacio vacio" : `Bloque ${cube.id}`}, fila ${actualRowIndex + 1}, columna ${cube.col + 1}${isCubeSelectionBlocked ? ", no seleccionable" : ""}${isShakeEnabled && isHighRisk ? ", riesgo alto" : ""}`}
                                            className={`relative mx-1 flex h-10 w-15 select-none items-center justify-center border border-black/20 text-white shadow-sm ${isCubeSelectionBlocked ? "cursor-not-allowed" : "cursor-pointer"} ${isHoveredHighlightCube ? "ring-2 ring-secondary ring-offset-2" : ""} ${isShakeEnabled && isHoveredNonEmptyCube && isHighRisk ? "animate-pulse ring-2 ring-danger" : ""}`}
                                            style={cubeStyle}
                                            onClick={() => onCubeActivate(cube)}
                                            onMouseEnter={() => onCubeHover(cubeHoverKey)}
                                            onMouseLeave={onCubeLeave}
                                        >
                                            {!cube.isEmpty && <span className="text-sm font-medium">{cube.id}</span>}
                                            {isShakeEnabled && isHoveredNonEmptyCube && isHighRisk && (
                                                <span className="absolute -right-2 -top-2 rounded bg-danger px-1 text-[10px] font-bold text-white">
                                                    !
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })}
        </>
    );
}
