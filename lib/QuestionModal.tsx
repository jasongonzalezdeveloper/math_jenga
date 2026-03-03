"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useStore } from "@/store/useStore";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const QuestionModal: React.FC = () => {
  const { t } = useAppTranslation();
  const { cubeClicked, decrease, setIsCorrect, clearCube } = useStore();
  const { question, answer } = cubeClicked || {};
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeForPlacement = useCallback(() => {
    setUserAnswer("");
    setFeedback(null);
    setIsOpen(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsCorrect(false);
    clearCube();
    closeForPlacement();
  }, [clearCube, closeForPlacement, setIsCorrect]);

  const handleSubmit = useCallback(() => {
    const userNum = parseInt(userAnswer, 10);
    if (userNum === answer) {
      setFeedback("correct");
      setIsCorrect(true);
      setTimeout(() => {
        closeForPlacement();
      }, 1000);
    } else {
      decrease();
      setFeedback("incorrect");
      setIsCorrect(false);
    }
  }, [userAnswer, answer, setIsCorrect, decrease, closeForPlacement]);

  useEffect(() => {
    if (cubeClicked) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [cubeClicked]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", onGlobalKeyDown);
    return () => window.removeEventListener("keydown", onGlobalKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-black">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-2xl font-bold mb-4 text-center ">
          {t("question.title")}
        </h2>

        <div className="bg-blue-100 p-4 rounded mb-6 text-center">
          <p className="text-xl font-semibold ">{question}</p>
        </div>

        <input
          ref={inputRef}
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder={t("question.placeholder")}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={feedback !== null}
        />

        {feedback && (
          <div
            className={`p-3 rounded mb-4 text-center font-semibold ${feedback === "correct"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}
          >
            {feedback === "correct"
              ? t("question.correct")
              : t("question.incorrect")}
          </div>
        )}

        <div className="flex gap-2">
          {!feedback ? (
            <>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {t("question.verify")}
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition-colors"
              >
                {t("question.close")}
              </button>
            </>
          ) : feedback === "incorrect" ? (
            <>
              <button
                onClick={() => {
                  setUserAnswer("");
                  setFeedback(null);
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {t("question.retry")}
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition-colors"
              >
                {t("question.close")}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
