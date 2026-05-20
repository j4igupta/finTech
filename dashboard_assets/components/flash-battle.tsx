"use client";

import { useState, useEffect } from "react";
import { Zap, Clock, Trophy, Flame, Check, X } from "lucide-react";

interface Player {
  username: string;
  avatar: string;
  level: number;
  score: number;
  answered?: boolean;
  correct?: boolean;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  category: string;
}

interface FlashBattleProps {
  player1: Player;
  player2: Player;
  question: Question;
  timeLimit?: number;
  roundNumber?: number;
  totalRounds?: number;
}

export function FlashBattle({
  player1,
  player2,
  question,
  timeLimit = 15,
  roundNumber = 1,
  totalRounds = 5,
}: FlashBattleProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isTimerCritical, setIsTimerCritical] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setShowResult(true);
      return;
    }

    if (timeLeft <= 5) {
      setIsTimerCritical(true);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const getAnswerStyle = (index: number) => {
    if (!showResult) {
      if (selectedAnswer === index) {
        return "border-[#1E90FF] bg-[#1E90FF]/20 ring-2 ring-[#1E90FF]/50";
      }
      return "border-border bg-secondary/30 hover:border-[#1E90FF]/50 hover:bg-secondary/50 cursor-pointer";
    }

    if (index === question.correctIndex) {
      return "border-[#00FFAA] bg-[#00FFAA]/20 ring-2 ring-[#00FFAA]/50";
    }

    if (selectedAnswer === index && index !== question.correctIndex) {
      return "border-red-500 bg-red-500/20 ring-2 ring-red-500/50";
    }

    return "border-border bg-secondary/30 opacity-50";
  };

  const formatTime = (seconds: number) => {
    return seconds.toString().padStart(2, "0");
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF69B4] to-[#1E90FF]">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold">Flash Battle</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-[#FF69B4]/10 px-3 py-1">
            <Trophy className="h-3.5 w-3.5 text-[#FF69B4]" />
            <span className="text-xs font-medium text-[#FF69B4]">
              +500 XP
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Round {roundNumber}/{totalRounds}
          </span>
        </div>
      </div>

      {/* Player Arena */}
      <div className="relative px-6 py-8">
        {/* Background glow effects */}
        <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-[#1E90FF]/20 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-[#FF69B4]/20 blur-3xl" />

        <div className="relative flex items-center justify-center gap-4 sm:gap-8">
          {/* Player 1 */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {/* Avatar ring */}
              <div
                className={`absolute -inset-1 rounded-full bg-gradient-to-br from-[#1E90FF] to-[#1E90FF]/50 ${
                  player1.answered && player1.correct ? "animate-pulse" : ""
                }`}
              />
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-background bg-gradient-to-br from-[#1E90FF]/20 to-[#1E90FF]/5 flex items-center justify-center overflow-hidden">
                <span className="text-2xl sm:text-3xl font-bold text-[#1E90FF]">
                  {player1.username.charAt(0)}
                </span>
              </div>
              {/* Level badge */}
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-[#1E90FF] text-xs font-bold text-white">
                {player1.level}
              </div>
              {/* Answer indicator */}
              {player1.answered && (
                <div
                  className={`absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full ${
                    player1.correct ? "bg-[#00FFAA]" : "bg-red-500"
                  }`}
                >
                  {player1.correct ? (
                    <Check className="h-3.5 w-3.5 text-black" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm sm:text-base">{player1.username}</p>
              <p className="text-lg sm:text-xl font-bold text-[#1E90FF]">
                {player1.score}
              </p>
            </div>
          </div>

          {/* VS Badge */}
          <div className="relative flex flex-col items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF69B4] to-[#1E90FF] blur-lg opacity-50" />
              <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-[#FF69B4]/50 bg-gradient-to-br from-[#FF69B4]/20 to-[#1E90FF]/20 backdrop-blur-sm">
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-br from-[#FF69B4] to-[#1E90FF] bg-clip-text text-transparent">
                  VS
                </span>
              </div>
            </div>
            {/* Timer */}
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                isTimerCritical
                  ? "bg-red-500/20 border border-red-500/50"
                  : "bg-secondary/50 border border-border"
              }`}
            >
              <Clock
                className={`h-4 w-4 ${
                  isTimerCritical ? "text-red-500 animate-pulse" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-lg font-mono font-bold ${
                  isTimerCritical ? "text-red-500" : "text-foreground"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Player 2 */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {/* Avatar ring */}
              <div
                className={`absolute -inset-1 rounded-full bg-gradient-to-br from-[#FF69B4] to-[#FF69B4]/50 ${
                  player2.answered && player2.correct ? "animate-pulse" : ""
                }`}
              />
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-background bg-gradient-to-br from-[#FF69B4]/20 to-[#FF69B4]/5 flex items-center justify-center overflow-hidden">
                <span className="text-2xl sm:text-3xl font-bold text-[#FF69B4]">
                  {player2.username.charAt(0)}
                </span>
              </div>
              {/* Level badge */}
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-[#FF69B4] text-xs font-bold text-white">
                {player2.level}
              </div>
              {/* Answer indicator */}
              {player2.answered && (
                <div
                  className={`absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full ${
                    player2.correct ? "bg-[#00FFAA]" : "bg-red-500"
                  }`}
                >
                  {player2.correct ? (
                    <Check className="h-3.5 w-3.5 text-black" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm sm:text-base">{player2.username}</p>
              <p className="text-lg sm:text-xl font-bold text-[#FF69B4]">
                {player2.score}
              </p>
            </div>
          </div>
        </div>

        {/* Streak indicator */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5">
          <Flame className="h-3 w-3 text-orange-500" />
          <span className="text-xs font-medium text-orange-500">3 Streak</span>
        </div>
      </div>

      {/* Question Panel */}
      <div className="border-t border-border bg-secondary/20 p-4 sm:p-6">
        {/* Category */}
        <div className="mb-3 flex items-center justify-center">
          <span className="rounded-full bg-[#1E90FF]/10 px-3 py-1 text-xs font-medium text-[#1E90FF]">
            {question.category}
          </span>
        </div>

        {/* Question text */}
        <p className="mb-5 text-center text-base sm:text-lg font-medium text-balance">
          {question.text}
        </p>

        {/* Answer options */}
        <div className="grid gap-3 sm:grid-cols-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={`relative flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${getAnswerStyle(
                index
              )}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                  showResult && index === question.correctIndex
                    ? "bg-[#00FFAA] text-black"
                    : showResult && selectedAnswer === index && index !== question.correctIndex
                    ? "bg-red-500 text-white"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-sm font-medium">{option}</span>
              {showResult && index === question.correctIndex && (
                <Check className="ml-auto h-5 w-5 text-[#00FFAA]" />
              )}
              {showResult &&
                selectedAnswer === index &&
                index !== question.correctIndex && (
                  <X className="ml-auto h-5 w-5 text-red-500" />
                )}
            </button>
          ))}
        </div>

        {/* Result message */}
        {showResult && (
          <div className="mt-4 text-center">
            {selectedAnswer === question.correctIndex ? (
              <p className="text-[#00FFAA] font-semibold">
                Correct! +100 XP
              </p>
            ) : selectedAnswer !== null ? (
              <p className="text-red-500 font-semibold">
                Wrong answer!
              </p>
            ) : (
              <p className="text-muted-foreground font-semibold">
                Time&apos;s up!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
