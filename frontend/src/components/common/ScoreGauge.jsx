import React from 'react';

const ScoreGauge = ({ score = 0, title = "Score", size = "normal" }) => {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const radius = size === "small" ? 36 : 48;
  const strokeWidth = size === "small" ? 6 : 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Determine color based on score value
  let strokeColor = "#ef4444"; // Red (<60)
  if (normalizedScore >= 80) strokeColor = "#10b981"; // Emerald green (>=80)
  else if (normalizedScore >= 65) strokeColor = "#06b6d4"; // Cyan (>=65)
  else if (normalizedScore >= 50) strokeColor = "#f59e0b"; // Amber (>=50)

  const widthHeight = size === "small" ? 90 : 120;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg width={widthHeight} height={widthHeight} className="transform -rotate-90">
          {/* Background Track Circle */}
          <circle
            cx={widthHeight / 2}
            cy={widthHeight / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-800/80"
            fill="transparent"
          />
          {/* Animated Value Arc */}
          <circle
            cx={widthHeight / 2}
            cy={widthHeight / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`font-extrabold text-slate-900 dark:text-slate-100 ${size === "small" ? "text-lg" : "text-2xl"}`}>
            {normalizedScore}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">/ 100</span>
        </div>
      </div>
      {title && (
        <span className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">
          {title}
        </span>
      )}
    </div>
  );
};

export default ScoreGauge;
