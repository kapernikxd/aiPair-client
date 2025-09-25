import React from "react";

type SpacerProps = {
  size?: number; // px
  horizontal?: boolean; // если true — отступ по ширине, иначе по высоте
  className?: string;
};

export function Spacer({ size = 16, horizontal = false, className = "" }: SpacerProps) {
  return (
    <div
      className={className}
      style={{
        [horizontal ? "width" : "height"]: size,
        [horizontal ? "height" : "width"]: "1px", // чтобы занимал место в потоке
        flexShrink: 0, // чтобы не схлопывался
      }}
    />
  );
}
