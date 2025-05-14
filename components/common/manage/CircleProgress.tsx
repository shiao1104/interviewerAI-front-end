import React from "react";

type Props = {
  score: number;
  label: string;
  color: string;
  size: number;
};

export default function CircleProgress({
  score,
  label,
  color,
  size = 150,
}: Props) {
  const radius = size * 0.4;
  const strokeWidth = size * 0.05;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference * (1 - score / 100);

  return (
    <div className="relative inline-block">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 背景圓環 */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="white"
          stroke="#ddd"
          strokeWidth={strokeWidth}
        />

        {/* 進度圓環 */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          transform={`rotate(-90, ${center}, ${center})`}
        />

        {/* 中心文字 */}
        <text
          x={center}
          y={center - size * 0.05}
          fontSize={size * 0.09}
          fill="#666"
          textAnchor="middle"
        >
          {label}
        </text>
        <text
          x={center}
          y={center + size * 0.08}
          fontSize={size * 0.18}
          fontWeight="bold"
          fill="#333"
          textAnchor="middle"
        >
          {score}
        </text>
      </svg>
    </div>
  );
}
