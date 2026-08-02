import React from "react";

interface ReasoningGaugeProps {
  groundedCount: number;
  totalCount: number;
}

const CX = 100;
const CY = 96;
const R = 78;
const STROKE = 16;

// angle=180 is the left tip of the semicircle, angle=0 is the right tip,
// angle=90 is the top — standard math convention, SVG's y-axis handled here.
const point = (angleDeg: number) => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + R * Math.cos(rad), y: CY - R * Math.sin(rad) };
};

// A single arc segment never spans more than 90 degrees here, which sidesteps
// the ambiguous-at-exactly-180-degrees SVG arc bug entirely.
const arcSegment = (fromAngle: number, toAngle: number) => {
  const start = point(fromAngle);
  const end = point(toAngle);
  return `M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y}`;
};

const buildPath = (fromAngle: number, toAngle: number): string => {
  if (fromAngle > 90 && toAngle < 90) {
    return `${arcSegment(fromAngle, 90)} ${arcSegment(90, toAngle)}`;
  }
  return arcSegment(fromAngle, toAngle);
};

export const ReasoningGauge: React.FC<ReasoningGaugeProps> = ({ groundedCount, totalCount }) => {
  const ratio = totalCount > 0 ? Math.min(1, Math.max(0, groundedCount / totalCount)) : 0;
  const valueAngle = 180 - ratio * 180;
  const needle = point(valueAngle);

  return (
    <div>
      <svg viewBox="0 0 200 118" className="w-full h-auto">
        <path d={buildPath(180, 0)} fill="none" stroke="currentColor" strokeOpacity={0.08} strokeWidth={STROKE} strokeLinecap="round" />
        {ratio > 0 && (
          <path d={buildPath(180, Math.max(0.5, valueAngle))} fill="none" stroke="#00CC44" strokeWidth={STROKE} strokeLinecap="round" />
        )}
        <line x1={CX} y1={CY} x2={needle.x} y2={needle.y} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        <circle cx={CX} cy={CY} r={4} fill="currentColor" />
        <text x={CX - R - STROKE / 2} y={CY + 18} fontFamily="var(--font-mono)" fontSize={9} fontWeight={700} textAnchor="start" fill="currentColor" opacity={0.5} letterSpacing="0.05em">HANDLE</text>
        <text x={CX + R + STROKE / 2} y={CY + 18} fontFamily="var(--font-mono)" fontSize={9} fontWeight={700} textAnchor="end" fill="currentColor" opacity={0.5} letterSpacing="0.05em">CONCEPT</text>
      </svg>
    </div>
  );
};
