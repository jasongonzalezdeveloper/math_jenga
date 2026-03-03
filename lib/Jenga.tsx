"use client";
import React from "react";
import { useJengaLogic } from "@/hooks/useJengaLogic";
import { useStore } from "../store/useStore";

interface JengaProps {
  isRightSide: boolean;
}

const Jenga: React.FC<JengaProps> = ({ isRightSide }) => {
  const { settings } = useStore();
  const isShakeEnabled = settings.defeatConditions.includes("shake");

  const {
    hoveredCubeId,
    jengaTower,
    movedToTopCount,
    setHoveredCubeId,
    handleClick,
    getSideRowColor,
    getShakeAngle,
    getShakeDuration,
    getShakeMetrics,
  } = useJengaLogic();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="transform-gpu transition-transform duration-500">
        {jengaTower.length > 0 &&
          jengaTower
            .slice()
            .reverse()
            .map((row, revIndex) => {
              const actualRowIndex = jengaTower.length - 1 - revIndex;
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
                    const { dynamicShake, isHighRisk } = getShakeMetrics(
                      cube,
                      row,
                      movedToTopCount,
                      actualRowIndex,
                      jengaTower.length - 1,
                    );
                    const cubeShake = Math.min(320, Math.max(0, dynamicShake));
                    const isHoveredCube = hoveredCubeId === cube.id && !cube.isEmpty;
                    const cubeStyle: React.CSSProperties & {
                      [key: string]: string | number;
                    } = {
                      backgroundColor: cube.color,
                    };

                    if (isShakeEnabled && isHoveredCube && cubeShake > 0) {
                      cubeStyle.animation = `tilt-shaking ${getShakeDuration(cubeShake)} ease-in-out infinite`;
                      cubeStyle["--shake-angle"] = getShakeAngle(cubeShake);
                    }

                    return (
                      <div
                        key={cube.id}
                        className={`${orientationHorizontal
                          ? `relative flex items-center justify-center text-white border border-black/20 shadow-sm mx-1 select-none cursor-pointer h-10 w-15 ${isShakeEnabled && isHoveredCube && isHighRisk ? "animate-pulse ring-2 ring-red-600" : ""}`
                          : "hidden"
                          }`}
                        style={cubeStyle}
                        onClick={() => handleClick(cube)}
                        onMouseEnter={() => setHoveredCubeId(cube.id)}
                        onMouseLeave={() => setHoveredCubeId(null)}
                      >
                        <span className="text-sm font-medium">{cube.id}</span>
                        {isShakeEnabled && isHoveredCube && isHighRisk && (
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
