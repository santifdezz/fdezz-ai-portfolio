"use client";

import { motion } from "framer-motion";

interface StatusDotProps {
  status?: "online" | "away" | "offline";
  size?: "sm" | "md" | "lg";
}

export function StatusDot({ status = "online", size = "md" } : StatusDotProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const colorClasses = {
    online: "bg-[hsl(var(--success))]",
    away: "bg-yellow-500",
    offline: "bg-gray-500",
  };

  const pulseAnimation = status === "online" ? {
    opacity: [1, 0.7, 1],
    scale: [1, 1.1, 1],
  } : {
    opacity: [0.6, 0.6, 0.6],
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${colorClasses[status]} rounded-full`}
      animate={pulseAnimation}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-label={`Status: ${status}`}
    />
  );
}
