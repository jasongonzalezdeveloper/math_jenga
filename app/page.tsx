"use client";

import Image from "next/image";
import Jenga from "../lib/Jenga";
import { useStore } from "../store/useStore";
import QuestionModal from "../lib/QuestionModal";

export default function Home() {
  const { lifes, increase, decrease, question, answer } = useStore();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full flex-col items-center justify-center px-4 text-center">
        <main className="flex w-full flex-col items-center justify-center px-4 text-center">
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
            <div className="order-1 lg:order-1">
              <div className="text-lg">
                Tienes <span className="font-bold text-2xl">{lifes}</span> vidas
              </div>
            </div>

            <div className="order-2 lg:order-2 w-full flex justify-center">
              <Jenga />
            </div>
          </div>
          <QuestionModal />
        </main>
      </main>
    </div>
  );
}
