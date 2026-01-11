import { useEffect, useState } from 'react';

export default function TrustScoreGauge({ score, size = 200 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = (s) => {
    if (s < 40) return { main: '#ef4444', light: '#fef2f2', label: 'HIGH RISK' };
    if (s < 75) return { main: '#f59e0b', light: '#fffbeb', label: 'NEEDS REVIEW' };
    return { main: '#10b981', light: '#ecfdf5', label: 'TRANSPARENT' };
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 200 200">
          <circle
            cx="100" cy="100" r="80"
            fill="none" stroke="#e2e8f0" strokeWidth="16"
          />
          <circle
            cx="100" cy="100" r="80"
            fill="none" stroke={color.main} strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold" style={{ color: color.main }}>
            {Math.round(animatedScore)}
          </span>
          <span className="text-gray-500 text-sm">Trust Score</span>
        </div>
      </div>
      <div 
        className="mt-4 px-4 py-2 rounded-full text-white font-semibold text-sm"
        style={{ backgroundColor: color.main }}
      >
        {color.label}
      </div>
    </div>
  );
}
