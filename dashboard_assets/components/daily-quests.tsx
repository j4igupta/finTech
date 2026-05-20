"use client";

import { CheckCircle2, Circle, Gift, Flame, Target, Clock } from "lucide-react";

interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  total: number;
  completed: boolean;
  icon: "flame" | "target" | "gift" | "clock";
}

const iconMap = {
  flame: Flame,
  target: Target,
  gift: Gift,
  clock: Clock,
};

interface DailyQuestsProps {
  quests: Quest[];
}

export function DailyQuests({ quests }: DailyQuestsProps) {
  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Daily Quests</h3>
          <p className="text-xs text-muted-foreground">
            {completedCount}/{quests.length} completed
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[#FF69B4]/10 px-3 py-1.5">
          <Flame className="h-4 w-4 text-[#FF69B4]" />
          <span className="text-xs font-medium text-[#FF69B4]">3 day streak</span>
        </div>
      </div>

      <div className="space-y-3">
        {quests.map((quest) => {
          const Icon = iconMap[quest.icon];
          return (
            <div
              key={quest.id}
              className={`group relative rounded-lg border p-3 transition-all ${
                quest.completed
                  ? "border-[#00FFAA]/30 bg-[#00FFAA]/5"
                  : "border-border bg-secondary/30 hover:border-[#1E90FF]/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                    quest.completed
                      ? "bg-[#00FFAA]/20 text-[#00FFAA]"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-sm font-medium ${
                        quest.completed ? "text-[#00FFAA]" : ""
                      }`}
                    >
                      {quest.title}
                    </p>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {quest.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-[#00FFAA]" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {quest.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex-1 mr-3">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full transition-all ${
                            quest.completed
                              ? "bg-[#00FFAA]"
                              : "bg-gradient-to-r from-[#1E90FF] to-[#FF69B4]"
                          }`}
                          style={{
                            width: `${(quest.progress / quest.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#FF69B4]">
                      +{quest.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
