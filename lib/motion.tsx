"use client";

import React from 'react';

// A simple animation implementation that works with or without framer-motion
// This allows us to provide basic animations even without the dependency

type MotionProps = {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  transition?: Record<string, any>;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
};

export const motion = {
  div: React.forwardRef<HTMLDivElement, MotionProps & React.HTMLAttributes<HTMLDivElement>>(
    ({ initial, animate, transition, children, ...props }, ref) => {
      // Basic CSS animation using transition
      const animationStyle: React.CSSProperties = {
        transition: transition ? `all ${transition.duration || 0.3}s ${transition.ease || 'ease'}` : undefined,
        transform: animate?.y ? `translateY(${animate.y}px)` : undefined,
        opacity: animate?.opacity,
      };

      return (
        <div
          ref={ref}
          style={{
            ...props.style,
            ...animationStyle,
          }}
          {...props}
        >
          {children}
        </div>
      );
    }
  ),
};