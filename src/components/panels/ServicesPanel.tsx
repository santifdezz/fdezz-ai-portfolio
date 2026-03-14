"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, LucideIcon } from "lucide-react";
import { PanelBase } from "./PanelBase";
import type { Locale } from "@/lib/portfolio-content";

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string; // icon name from lucide-react
}

interface ServicesPanelProps {
  services: Service[];
  locale?: Locale;
}

export function ServicesPanel({
  services,
  locale = "en",
}: ServicesPanelProps) {
  const isES = locale === "es";

  return (
    <PanelBase
      icon={Briefcase}
      title={isES ? "Servicios" : "Services"}
      accentColor="blue"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-[hsl(var(--secondary)/0.5)] rounded-lg border border-[hsl(var(--border)/0.5)] hover:border-blue-500/50 transition-colors"
          >
            <h4 className="font-semibold text-[hsl(var(--foreground))] mb-2">
              {service.title}
            </h4>
            <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>
    </PanelBase>
  );
}
