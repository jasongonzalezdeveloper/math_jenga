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
  const { cubeClicked, setCubeClicked, isCorrect, setIsCorrect } = useStore();

  const [jengaTower, setJengaTower] = useState<Cube[][]>([]);

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
          shake: 0,
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
      setJengaTower((prev) => {
        if (prev.length === 0) return prev;

        const newTower = prev.map((row) =>
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
              };
            }
            return c;
          })
        );

        return newTower;
      });
      setCubeClicked(null);
      setIsCorrect(false);
    }
  }, [isCorrect, cubeClicked, setCubeClicked, setIsCorrect]);

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
                        backgroundColor:
                          row[0].color || row[1].color || row[2].color,
                      }
                      : {}
                  }
                >
                  {row.map((cube) => (
                    <div
                      key={cube.id}
                      className={`${orientationHorizontal
                        ? "flex items-center justify-center text-white border border-black/20 shadow-sm mx-1 select-none cursor-pointer h-10 w-15 "
                        : "hidden"
                        }`}
                      style={{ backgroundColor: cube.color }}
                      onClick={() => handleClick(cube)}
                    >
                      <span className="text-sm font-medium">{cube.id}</span>
                    </div>
                  ))}
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Jenga;
