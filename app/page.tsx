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
        <div className="relative w-full flex items-center justify-center">
          <div className="absolute top-0 left-1/2 z-10 w-full max-w-sm -translate-x-1/2 flex flex-col items-center lg:left-0 lg:top-1/2 lg:max-w-none lg:w-[30%] lg:translate-x-0 lg:-translate-y-1/2">
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

          <div className="w-full flex justify-center pt-40 lg:pt-0">
            <Jenga isRightSide={isRightSide} />
          </div>
        </div>
        <QuestionModal />
        {lifes === 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-lg bg-white px-8 py-6 text-center text-black shadow-lg">
              <h2 className="text-3xl font-bold">Perdiste</h2>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
