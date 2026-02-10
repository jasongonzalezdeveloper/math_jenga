"use client";
import React, { useEffect, useState } from "react";
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

const Jenga: React.FC = () => {
  const { setQuestion, setAnswer } = useStore();

  const [jengaTower, setJengaTower] = useState<Cube[][]>();
  const [isRightSide, setIsRightSide] = useState(false);

  const setCubeQuestion = () => {
    const firstNumRandom = Math.floor(Math.random() * 10) + 1;
    let question: string = firstNumRandom.toString();
    let answer: number = firstNumRandom;

    const operationQuantity = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < operationQuantity; i++) {
      const opRandom = Math.floor(Math.random() * 2) + 1;
      const numRandom = Math.floor(Math.random() * 10) + 1;
      if (opRandom == 1) {
        question += " + " + numRandom;
        answer += numRandom;
      }
      if (opRandom == 2) {
        question += " - " + numRandom;
        answer -= numRandom;
      }
      // if (opRandom == 3) {
      //   question += " * " + numRandom;
      //   answer *= numRandom;
      // }
    }

    return {
      question: question,
      answer: answer,
    };
  };

  const initializeJenga = () => {
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
          isAnswerCorrect: function (userAnswer: number) {
            return userAnswer === this.answer;
          },
        };
      }),
    );
    setJengaTower(tower);
  };

  useEffect(() => {
    initializeJenga();
  }, []);

  const handleClick = (block?: Cube) => {
    if (block) {
      setQuestion(block.question);
      setAnswer(block.answer);
    }
  };

  const handleRotate = () => {
    setIsRightSide((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="transform-gpu transition-transform duration-500">
        {jengaTower &&
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
                  {row.map((block) => (
                    <div
                      key={block.id}
                      className={`${
                        orientationHorizontal
                          ? "flex items-center justify-center text-white border border-black/20 shadow-sm mx-1 select-none cursor-pointer h-10 w-15 "
                          : "hidden"
                      }`}
                      style={{ backgroundColor: block.color }}
                      onClick={() => handleClick(block)}
                    >
                      <span className="text-sm font-medium">{block.id}</span>
                    </div>
                  ))}
                </div>
              );
            })}
      </div>

      <button
        onClick={handleRotate}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
      >
        {isRightSide ? "Girar a la izquierda" : "Girar a la derecha"}
      </button>
    </div>
  );
};

export default Jenga;
