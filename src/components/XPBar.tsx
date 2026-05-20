// 1. Define the props this component expects to receive
interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
}

export function XPBar({ currentXP, nextLevelXP }: XPBarProps) {
  // 2. Calculate the width percentage safely, preventing division by zero
  const percent = nextLevelXP > 0 
    ? Math.min(100, Math.max(0, (currentXP / nextLevelXP) * 100))
    : 100; // or 0, depending on what you want to show when max level is reached

  return (
    <div className="mx-6 my-2">
      <div className="flex justify-between text-sm text-gray-300 mb-1">
        <span>XP: {currentXP}</span>
        <span>{nextLevelXP}</span>
      </div>
      <div className="h-2 bg-gray-700 rounded overflow-hidden">
        <div 
          className="h-full bg-primary"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}