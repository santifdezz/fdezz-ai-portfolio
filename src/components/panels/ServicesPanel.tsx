"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, ChevronDown, CheckCircle2 } from "lucide-react";
import { PanelBase } from "./PanelBase";
import type { Locale } from "@/lib/portfolio-content";

interface Service {
  id: string;
  title: string;
  description: string;
  features?: string[];
  technologies?: string[];
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
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  return (
    <PanelBase
      icon={Briefcase}
      title={isES ? "Servicios" : "Services"}
      accentColor="purple"
    >
      <div className="space-y-4">
        {services.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="bg-[hsl(var(--secondary)/0.5)] rounded-lg border border-[hsl(var(--border)/0.5)] hover:border-purple-500/50 transition-all overflow-hidden"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() =>
                setExpandedId(expandedId === service.id ? null : service.id)
              }
              className="p-4 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-[hsl(var(--foreground))]">
                    {service.title}
                  </h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed mt-1">
                    {service.description}
                  </p>
                </div>
                {(service.features?.length || 0) > 0 && (
                  <motion.div
                    animate={{
                      rotate: expandedId === service.id ? 180 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="text-purple-400 flex-shrink-0"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Features & Technologies */}
            {((service.features?.length || 0) > 0 || (service.technologies?.length || 0) > 0) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: expandedId === service.id ? "auto" : 0,
                  opacity: expandedId === service.id ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-[hsl(var(--border)/0.3)]"
              >
                <div className="p-3 space-y-3 bg-[hsl(var(--secondary)/0.3)]">
                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase font-semibold text-purple-400 tracking-wider">
                        {isES ? "Características" : "Features"}
                      </p>
                      <div className="space-y-1">
                        {service.features.map((feature, fidx) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: fidx * 0.05 }}
                            className="flex items-start gap-2 text-xs text-[hsl(var(--muted-foreground))]"
                          >
                            <CheckCircle2 className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  {service.technologies && service.technologies.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase font-semibold text-purple-400 tracking-wider">
                        {isES ? "Tecnologías" : "Technologies"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-xs bg-purple-500/10 text-purple-300 rounded border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </PanelBase>
  );
}
