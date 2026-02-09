import React, { useEffect, useState } from "react";
import { Cube } from "@/models/Cube";

const COLORS: Record<number, string> = {
  1: "red",
  2: "blue",
  3: "green",
  4: "yellow",
  5: "orange",
  6: "purble",
};

const Jenga: React.FC = () => {
  const [cube, setCube] = useState<Cube[][]>();

  const setQuestion = () => {
    let question: string = "";
    let answer: number = 0;

    const operationQuantity = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < operationQuantity; i++) {
      const opRandom = Math.floor(Math.random() * 3) + 1;
      const numRandom = Math.floor(Math.random() * 10) + 1;
      if (opRandom == 1) {
        question += "+ " + numRandom;
        answer += numRandom;
      }
      if (opRandom == 2) {
        question += "- " + numRandom;
        answer -= numRandom;
      }
      if (opRandom == 3) {
        question += "* " + numRandom;
        answer *= numRandom;
      }
    }

    return {
      question: question,
      answer: answer,
    };
  };

  const initializeJenga = () => {
    const newCube: Cube[][] = Array.from({ length: 18 }, (_, row) =>
      Array.from({ length: 3 }, (_, col) => {
        const id = row * 3 + col + 1;
        const color = COLORS[Math.floor(Math.random() * 6) + 1];
        const cubeQuestion = setQuestion();
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
    setCube(newCube);
  };

  useEffect(() => {
    initializeJenga();
  }, []);

  const handleClick = () => {};

  return (
    <div>
      {cube &&
        cube.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((block) => (
              <div
                key={block.id}
                className="w-12 h-5 m-0.5 flex justify-center items-center border border-black"
                style={{ backgroundColor: block.color }}
                onClick={handleClick}
              >
                {block.id}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default Jenga;
