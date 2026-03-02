import { HTMLAttributes } from 'react';

interface SunIconProps extends HTMLAttributes<SVGElement> {
  className?: string;
  size?: number;
}

export function SunIcon({ className = '', size = 24, ...props }: SunIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* 太阳圆圈 - 加大半径 */}
      <circle
        cx="12"
        cy="12"
        r="7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 光芒 - 使用小点，半径减小 */}
      <circle cx="12" cy="3" r="0.75" fill="currentColor" />
      <circle cx="12" cy="21" r="0.75" fill="currentColor" />
      <circle cx="3" cy="12" r="0.75" fill="currentColor" />
      <circle cx="21" cy="12" r="0.75" fill="currentColor" />
      <circle cx="5.64" cy="5.64" r="0.75" fill="currentColor" />
      <circle cx="18.36" cy="18.36" r="0.75" fill="currentColor" />
      <circle cx="5.64" cy="18.36" r="0.75" fill="currentColor" />
      <circle cx="18.36" cy="5.64" r="0.75" fill="currentColor" />
    </svg>
  );
}
