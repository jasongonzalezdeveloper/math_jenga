"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Cube } from "@/models/Cube";
import { useStore } from "../store/useStore";

const COLORS: Record<number, string> = {
  1: "#0070f3",
  2: "#388e4a",
  3: "#da3036",
  4: "#f1a10d",
  5: "#a1a1a1",
  6: "#ad1966",
};

interface JengaProps {
  isRightSide: boolean;
}

const Jenga: React.FC<JengaProps> = ({ isRightSide }) => {
  const { cubeClicked, setCubeClicked, isCorrect, setIsCorrect, loseGame } = useStore();

  const [jengaTower, setJengaTower] = useState<Cube[][]>([]);
  const [hoveredCubeId, setHoveredCubeId] = useState<number | null>(null);

  const setCubeQuestion = useCallback(() => {
    const firstNumRandom = Math.floor(Math.random() * 10) + 1;
    let question: string = firstNumRandom.toString();
    let answer: number = firstNumRandom;

    const operationQuantity = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < operationQuantity; i++) {
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
      // if (opRandom === 3) {
      //   question += " * " + numRandom;
      //   answer *= numRandom;
      // }
    }

    return {
      question,
      answer,
    };
  }, []);

  const initializeJenga = useCallback(() => {
    const tower: Cube[][] = Array.from({ length: 18 }, (_, row) =>
      Array.from({ length: 3 }, (_, col) => {
        const id = row * 3 + col + 1;
        const color = COLORS[Math.floor(Math.random() * 6) + 1];
        const cubeQuestion = setCubeQuestion();
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
    setJengaTower(tower);
  }, [setCubeQuestion]);

  useEffect(() => {
    initializeJenga();
  }, [initializeJenga]);

  const handleClick = useCallback((cube?: Cube) => {
    if (cube && !cube.isEmpty) {
      setCubeClicked(cube);
    } else if (isCorrect && cube && cubeClicked) {
      if (jengaTower.length === 0) return;

      const sourceRow = cubeClicked.row;
      const newTower = jengaTower.map((row) =>
        row.map((c) => {
          if (c.row === cube.row && c.col === cube.col) {
            return {
              ...cubeClicked,
              row: c.row,
              col: c.col,
              isEmpty: false,
            };
          }
          if (c.row === cubeClicked.row && c.col === cubeClicked.col) {
            return {
              ...c,
              isEmpty: true,
              color: 'white',
              shake: 0,
            };
          }
          return c;
        })
      );

      setJengaTower(newTower);

      const removedThreeFromSameRow = newTower[sourceRow].every((block) => block.isEmpty);
      if (removedThreeFromSameRow) {
        loseGame();
      }

      setCubeClicked(null);
      setHoveredCubeId(null);
      setIsCorrect(false);
    }
  }, [isCorrect, cubeClicked, setCubeClicked, setIsCorrect, jengaTower, loseGame]);

  const needJengaTowerEmptyCubes = useCallback(() => {
    if (!jengaTower || jengaTower.length === 0) return false;
    const lastRow = jengaTower[jengaTower.length - 1];
    const emptyCubesInLastRow = lastRow.filter(cube => cube.isEmpty).length;
    return emptyCubesInLastRow === 0;
  }, [jengaTower]);

  useEffect(() => {
    if (isCorrect && jengaTower.length > 0 && needJengaTowerEmptyCubes()) {
      const tower: Cube[] = Array.from({ length: 3 }, (_, col) => {
        const id = jengaTower.length * 3 + col + 1;
        const color = 'white';
        return {
          id,
          color,
          row: jengaTower.length,
          col,
          shake: 0,
          question: '',
          answer: 0,
          isEmpty: true,
        };
      });
      setJengaTower((prev) => [...prev, tower]);
    }
  }, [isCorrect, jengaTower, needJengaTowerEmptyCubes]);

  const getSideRowColor = useCallback((row: Cube[]) => {
    const firstVisibleCube = row.find((cube) => !cube.isEmpty);
    return firstVisibleCube?.color ?? "white";
  }, []);

  const getShakeAngle = useCallback((shake: number) => {
    const normalizedShake = Math.min(100, Math.max(0, shake));
    const maxAngle = 2 + (normalizedShake / 100) * 10;
    return `${maxAngle}deg`;
  }, []);

  const getShakeDuration = useCallback((shake: number) => {
    const normalizedShake = Math.min(100, Math.max(0, shake));
    const durationMs = 500 - normalizedShake * 3;
    return `${Math.max(160, durationMs)}ms`;
  }, []);

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
                    const cubeShake = Math.min(100, Math.max(0, cube.shake ?? 0));
                    const isHoveredCube = hoveredCubeId === cube.id && !cube.isEmpty;
                    const cubeStyle: React.CSSProperties & {
                      [key: string]: string | number;
                    } = {
                      backgroundColor: cube.color,
                    };

                    if (isHoveredCube && cubeShake > 0) {
                      cubeStyle.animation = `tilt-shaking ${getShakeDuration(cubeShake)} ease-in-out infinite`;
                      cubeStyle["--shake-angle"] = getShakeAngle(cubeShake);
                    }

                    return (
                      <div
                        key={cube.id}
                        className={`${orientationHorizontal
                          ? "flex items-center justify-center text-white border border-black/20 shadow-sm mx-1 select-none cursor-pointer h-10 w-15 "
                          : "hidden"
                          }`}
                        style={cubeStyle}
                        onClick={() => handleClick(cube)}
                        onMouseEnter={() => setHoveredCubeId(cube.id)}
                        onMouseLeave={() => setHoveredCubeId(null)}
                      >
                        <span className="text-sm font-medium">{cube.id}</span>
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
