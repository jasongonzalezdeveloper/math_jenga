"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useStore } from "@/store/useStore";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { APP_MODAL, APP_VIEWPORT } from "@/lib/appVariables";

const QuestionModal: React.FC = () => {
  const { t } = useAppTranslation();
  const { cubeClicked, decrease, setIsCorrect, clearCube, lifes, settings } = useStore();
  const { question, answer } = cubeClicked || {};
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [isModalReady, setIsModalReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dismissedCubeKey, setDismissedCubeKey] = useState<string | null>(null);
  const currentCubeKey = cubeClicked
    ? `${cubeClicked.id}-${cubeClicked.row}-${cubeClicked.col}`
    : null;
  const isDismissedForPlacement =
    currentCubeKey !== null && dismissedCubeKey === currentCubeKey;
  const hasBaseVisibility = Boolean(cubeClicked) && !isDismissedForPlacement && lifes > 0;
  const isShakeEnabled = settings.defeatConditions.includes("shake");
  const isOpen = hasBaseVisibility && isModalReady;

  useEffect(() => {
    if (!hasBaseVisibility) {
      setIsModalReady(false);
      return;
    }

    const isMobile = window.matchMedia(`(max-width: ${APP_VIEWPORT.mobileMaxWidthPx}px)`).matches;
    const delayMs = isMobile && isShakeEnabled ? APP_MODAL.mobileQuestionDelayMsWithShake : 0;

    if (delayMs === 0) {
      setIsModalReady(true);
      return;
    }

    setIsModalReady(false);
    const timeoutId = window.setTimeout(() => {
      setIsModalReady(true);
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [hasBaseVisibility, isShakeEnabled, currentCubeKey]);

  const closeForPlacement = useCallback(() => {
    setUserAnswer("");
    setFeedback(null);
    setDismissedCubeKey(currentCubeKey ?? null);
  }, [currentCubeKey]);

  const handleClose = useCallback(() => {
    setIsCorrect(false);
    clearCube();
    setUserAnswer("");
    setFeedback(null);
    setDismissedCubeKey(null);
  }, [clearCube, setIsCorrect]);

  const handleSubmit = useCallback(() => {
    const normalizedAnswer = userAnswer.trim();
    if (normalizedAnswer === "" || normalizedAnswer === "-") {
      return;
    }

    const userNum = parseInt(normalizedAnswer, 10);
    if (Number.isNaN(userNum)) {
      return;
    }

    if (userNum === answer) {
      setFeedback("correct");
      setIsCorrect(true);
      const isMobile = window.matchMedia(`(max-width: ${APP_VIEWPORT.mobileMaxWidthPx}px)`).matches;
      if (APP_MODAL.scrollOnCorrectInMobile && isMobile) {
        window.scrollTo({ top: 0, behavior: APP_MODAL.scrollBehaviorOnCorrect });
      }
      setTimeout(() => {
        closeForPlacement();
      }, APP_MODAL.closeAfterCorrectMs);
    } else {
      decrease();
      setFeedback("incorrect");
      setIsCorrect(false);
    }
  }, [userAnswer, answer, setIsCorrect, decrease, closeForPlacement]);

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

        <div className="mb-4 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="-?[0-9]*"
            value={userAnswer}
            onChange={(e) => {
              const nextValue = e.target.value.replace(/[^0-9-]/g, "");
              const normalizedValue = nextValue
                .replace(/(?!^)-/g, "")
                .replace(/-{2,}/g, "-");
              setUserAnswer(normalizedValue);
            }}
            placeholder={t("question.placeholder")}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            disabled={feedback !== null}
          />
          <button
            type="button"
            onClick={() => {
              if (feedback !== null) {
                return;
              }

              setUserAnswer((prev) => {
                if (prev.trim() === "") {
                  return "-";
                }

                return prev.startsWith("-") ? prev.slice(1) : `-${prev}`;
              });
            }}
            disabled={feedback !== null}
            className="rounded border border-gray-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cambiar signo"
            title="Cambiar signo"
          >
            +/-
          </button>
        </div>

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
