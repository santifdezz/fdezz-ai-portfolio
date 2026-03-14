"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PanelBaseProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  children: React.ReactNode;
  accentColor?: "cyan" | "purple" | "blue" | "green";
  className?: string;
}

const accentClasses = {
  cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30",
  purple: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
  blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
  green: "from-green-500/20 to-green-500/5 border-green-500/30",
};

const iconColorClasses = {
  cyan: "text-cyan-400",
  purple: "text-purple-400",
  blue: "text-blue-400",
  green: "text-green-400",
};

export function PanelBase({
  icon: IconComponent,
  title,
  description,
  children,
  accentColor = "cyan",
  className = "",
}: PanelBaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`w-full space-y-4 p-6 bg-gradient-to-b ${accentClasses[accentColor]} border rounded-xl shadow-lg ${className}`}
    >
      {/* Header */}
      {(IconComponent || title) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="space-y-2"
        >
          {IconComponent && (
            <IconComponent className={`w-6 h-6 ${iconColorClasses[accentColor]}`} />
          )}
          {title && (
            <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {description}
            </p>
          )}
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
