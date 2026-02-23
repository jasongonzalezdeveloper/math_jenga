"use client";

import { useCallback, useState } from "react";
import Jenga from "../lib/Jenga";
import { useStore } from "../store/useStore";
import QuestionModal from "../lib/QuestionModal";

export default function Home() {
  const { lifes, isCorrect } = useStore();
  const [isRightSide, setIsRightSide] = useState(false);

  const handleRotate = useCallback(() => {
    setIsRightSide((prev) => !prev);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full flex-col items-center justify-center px-4 text-center">
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-4">
          <div className="w-full lg:w-[30%] flex flex-col items-center">
            {isCorrect === true && (
              <div className="mb-4 text-green-600 font-bold text-lg wrap-break-word overflow-hidden">
                ¡DEBES COLOCAR EL CUBO EN LA CIMA DE LA TORRE, ESCOGE UNO DE LOS CUBOS BLANCOS DISPONIBLES!
              </div>
            )}
            <div className="text-lg">
              Tienes <span className="font-bold text-2xl">{lifes}</span> vidas
            </div>

            <button
              onClick={handleRotate}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
            >
              {isRightSide ? "Girar a la izquierda" : "Girar a la derecha"}
            </button>
          </div>

          <div className="w-full lg:w-[70%] flex justify-center">
            <Jenga isRightSide={isRightSide} />
          </div>
        </div>
        <QuestionModal />
      </main>
    </div>
  );
}
