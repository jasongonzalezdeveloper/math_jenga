"use client";
import { useEffect, useReducer, useRef, useState, useCallback } from "react";
import { useStore } from "@/store/useStore";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { APP_MODAL, APP_VIEWPORT } from "@/lib/appVariables";
import { getQuestionTimeLimitByDifficulty } from "@/models/GameSettings";

type ModalReadyState = {
  status: "hidden" | "waiting" | "ready";
  cubeKey: string | null;
};

type ModalReadyAction =
  | { type: "HIDE" }
  | { type: "WAIT"; cubeKey: string }
  | { type: "SHOW_NOW"; cubeKey: string }
  | { type: "READY"; cubeKey: string };

const modalReadyReducer = (state: ModalReadyState, action: ModalReadyAction): ModalReadyState => {
  if (action.type === "HIDE") {
    return {
      status: "hidden",
      cubeKey: null,
    };
  }

  if (action.type === "WAIT") {
    return {
      status: "waiting",
      cubeKey: action.cubeKey,
    };
  }

  if (action.type === "SHOW_NOW") {
    return {
      status: "ready",
      cubeKey: action.cubeKey,
    };
  }

  if (state.cubeKey !== action.cubeKey) {
    return state;
  }

  return {
    status: "ready",
    cubeKey: action.cubeKey,
  };
};

const QuestionModal = () => {
  const { t } = useAppTranslation();
  const { cubeClicked, decrease, setIsCorrect, clearCube, lifes, settings } = useStore();
  const { question, answer } = cubeClicked || {};
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [modalReadyState, dispatchModalReady] = useReducer(modalReadyReducer, {
    status: "hidden",
    cubeKey: null,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [dismissedCubeKey, setDismissedCubeKey] = useState<string | null>(null);
  const currentCubeKey = cubeClicked
    ? `${cubeClicked.id}-${cubeClicked.row}-${cubeClicked.col}`
    : null;
  const isDismissedForPlacement =
    currentCubeKey !== null && dismissedCubeKey === currentCubeKey;
  const hasBaseVisibility = Boolean(cubeClicked) && !isDismissedForPlacement && lifes > 0;
  const isShakeEnabled = settings.defeatConditions.includes("shake");
  const isModalReady =
    modalReadyState.status === "ready" && modalReadyState.cubeKey === currentCubeKey;
  const isOpen = hasBaseVisibility && isModalReady;
  const questionTimeLimitSeconds = getQuestionTimeLimitByDifficulty(settings.difficulty);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(questionTimeLimitSeconds);

  useEffect(() => {
    if (!hasBaseVisibility || !currentCubeKey) {
      dispatchModalReady({ type: "HIDE" });
      return;
    }

    const isMobile = window.matchMedia(`(max-width: ${APP_VIEWPORT.mobileMaxWidthPx}px)`).matches;
    const delayMs = isMobile && isShakeEnabled ? APP_MODAL.mobileQuestionDelayMsWithShake : 0;

    if (delayMs === 0) {
      dispatchModalReady({ type: "SHOW_NOW", cubeKey: currentCubeKey });
      return;
    }

    dispatchModalReady({ type: "WAIT", cubeKey: currentCubeKey });
    const timeoutId = window.setTimeout(() => {
      dispatchModalReady({ type: "READY", cubeKey: currentCubeKey });
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
    if (!isOpen) {
      return;
    }

    setTimeLeftSeconds(questionTimeLimitSeconds);
  }, [isOpen, currentCubeKey, questionTimeLimitSeconds]);

  useEffect(() => {
    if (!isOpen || feedback !== null || timeLeftSeconds <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeftSeconds((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isOpen, feedback, timeLeftSeconds]);

  useEffect(() => {
    if (!isOpen || feedback !== null || timeLeftSeconds > 0) {
      return;
    }

    decrease();
    setFeedback("incorrect");
    setIsCorrect(false);
  }, [decrease, feedback, isOpen, setIsCorrect, timeLeftSeconds]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-(--color-foreground)">
      <div className="w-80 rounded-lg border border-secondary/35 bg-(--color-surface) p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center ">
          {t("question.title")}
        </h2>

        <div className="mb-6 rounded bg-info/20 p-4 text-center">
          <p className="text-xl font-semibold ">{question}</p>
        </div>

        <p
          className={`mb-3 text-center text-sm font-semibold ${timeLeftSeconds <= 5
            ? "text-danger"
            : "text-(--color-foreground)"
            }`}
          aria-live="polite"
        >
          {timeLeftSeconds > 0
            ? t("question.timeLeft", { count: timeLeftSeconds })
            : t("question.timeOut")}
        </p>

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
            className="w-full rounded border border-info/35 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-(--color-secondary)"
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
            className="rounded bg-secondary px-3 py-2 text-sm font-semibold text-white transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cambiar signo"
            title="Cambiar signo"
          >
            +/-
          </button>
        </div>

        {feedback && (
          <div
            className={`p-3 rounded mb-4 text-center font-semibold ${feedback === "correct"
              ? "bg-success/25 text-(--color-foreground)"
              : "bg-danger/25 text-(--color-foreground)"
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
                className="flex-1 rounded bg-primary py-2 text-white transition-all hover:brightness-95"
              >
                {t("question.verify")}
              </button>
              <button
                onClick={handleClose}
                className="flex-1 rounded bg-warning py-2 text-white transition-all hover:brightness-95"
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
                  setTimeLeftSeconds(questionTimeLimitSeconds);
                }}
                className="flex-1 rounded bg-primary py-2 text-white transition-all hover:brightness-95"
              >
                {t("question.retry")}
              </button>
              <button
                onClick={handleClose}
                className="flex-1 rounded bg-warning py-2 text-white transition-all hover:brightness-95"
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
