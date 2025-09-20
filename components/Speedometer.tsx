
import React from 'react';

interface SpeedometerProps {
  speed: number;
}

const Speedometer: React.FC<SpeedometerProps> = ({ speed }) => {
  const maxSpeed = 200;
  const clampedSpeed = Math.min(Math.max(speed, 0), maxSpeed);
  const angle = (clampedSpeed / maxSpeed) * 270 - 135;

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Gauge Background */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="#1f2937" strokeWidth="12" />

        {/* Gauge Progress */}
        <defs>
          <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <path
          d="M 29.29 170.71 A 90 90 0 1 1 170.71 170.71"
          fill="none"
          stroke="url(#speedGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="636"
          strokeDashoffset={636 - (clampedSpeed / maxSpeed) * 636}
          style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
        />

        {/* Ticks */}
        {Array.from({ length: 11 }).map((_, i) => {
          const tickAngle = i * (270 / 10) - 135;
          const isMajor = i % 2 === 0;
          return (
            <line
              key={i}
              x1={100 + (isMajor ? 78 : 82) * Math.cos(tickAngle * Math.PI / 180)}
              y1={100 + (isMajor ? 78 : 82) * Math.sin(tickAngle * Math.PI / 180)}
              x2={100 + 85 * Math.cos(tickAngle * Math.PI / 180)}
              y2={100 + 85 * Math.sin(tickAngle * Math.PI / 180)}
              stroke={isMajor ? "#f9fafb" : "#6b7280"}
              strokeWidth={isMajor ? "2" : "1"}
            />
          );
        })}

        {/* Needle */}
        <g transform={`rotate(${angle} 100 100)`} style={{ transition: 'transform 0.3s ease-out' }}>
          <polygon points="100,15 102,100 98,100" fill="#f43f5e" />
          <circle cx="100" cy="100" r="6" fill="#f43f5e" stroke="white" strokeWidth="2" />
        </g>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-7xl font-mono font-bold text-white tracking-tighter">
          {Math.round(clampedSpeed)}
        </span>
        <span className="text-lg font-medium text-gray-400 -mt-1">km/h</span>
      </div>
    </div>
  );
};

export default Speedometer;
