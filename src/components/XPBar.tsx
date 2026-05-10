// 1. Define the props this component expects to receive
interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
}

export function XPBar({ currentXP, nextLevelXP }: XPBarProps) {
  // 2. Calculate the width percentage safely
  const percent = Math.min(100, Math.max(0, (currentXP / nextLevelXP) * 100));

  return (
    <div className="mx-6 my-2">
      <div className="flex justify-between text-sm text-gray-300 mb-1">
        <span>XP: {currentXP}</span>
        <span>{nextLevelXP}</span>
      </div>
      <div className="h-2 bg-gray-700 rounded">
        <div 
          className="h-full bg-primary rounded"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}