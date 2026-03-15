"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, ChevronDown, CheckCircle2, ArrowRight } from "lucide-react";
import { PanelBase } from "./PanelBase";
import type { Locale } from "@/lib/portfolio-content";

interface Service {
  id: string;
  title: string;
  description: string;
  features?: string[];
  technologies?: string[];
}

interface ServicesPanelProps {
  services: Service[];
  locale?: Locale;
}

const VALUE_TABLE: Record<Locale, { need: string; can: string }[]> = {
  en: [
    { need: "You need to process millions of records reliably", can: "I build production-grade ETL pipelines with Airflow" },
    { need: "Your team needs AI that actually works in prod", can: "I deploy RAG systems and ML models end-to-end" },
    { need: "You need insights from unstructured data fast", can: "I build NLP pipelines and sentiment analysis systems" },
    { need: "You want smarter search or document retrieval", can: "I implement vector search with FAISS + LangChain" },
    { need: "You need quality gates before shipping code", can: "I automate test suites (E2E, API, regression)" },
  ],
  es: [
    { need: "Necesitas procesar millones de registros de forma fiable", can: "Construyo pipelines ETL de producción con Airflow" },
    { need: "Tu equipo necesita IA que funcione en producción", can: "Despliego sistemas RAG y modelos ML de extremo a extremo" },
    { need: "Necesitas insights de datos no estructurados rápido", can: "Construyo pipelines NLP y análisis de sentimiento" },
    { need: "Quieres búsqueda semántica o recuperación de documentos", can: "Implemento búsqueda vectorial con FAISS + LangChain" },
    { need: "Necesitas control de calidad antes de publicar código", can: "Automatizo suites de tests (E2E, API, regresión)" },
  ],
};

export function ServicesPanel({ services, locale = "en" }: ServicesPanelProps) {
  const isES = locale === "es";
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const rows = VALUE_TABLE[locale];

  return (
    <PanelBase
      icon={Briefcase}
      title={isES ? "Servicios" : "Services"}
      accentColor="purple"
    >
      <div className="space-y-6">
        {/* Value table */}
        <div>
          <p className="text-[10px] uppercase font-semibold text-purple-400 tracking-wider mb-3">
            {isES ? "Si necesitas / Yo puedo" : "You need / I deliver"}
          </p>
          <div className="space-y-2">
            {rows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="grid grid-cols-[1fr_auto_1fr] gap-2 items-start text-xs bg-[hsl(var(--secondary)/0.4)] rounded-lg px-3 py-2.5 border border-[hsl(var(--border)/0.4)]"
              >
                <span className="text-[hsl(var(--muted-foreground))] leading-snug">{row.need}</span>
                <ArrowRight className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />
                <span className="text-purple-300 leading-snug font-medium">{row.can}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Service cards */}
        <div>
          <p className="text-[10px] uppercase font-semibold text-purple-400 tracking-wider mb-3">
            {isES ? "Áreas de servicio" : "Service areas"}
          </p>
          <div className="space-y-2">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + idx * 0.07 }}
                className="bg-[hsl(var(--secondary)/0.5)] rounded-lg border border-[hsl(var(--border)/0.5)] hover:border-purple-500/40 transition-all overflow-hidden"
              >
                <motion.div
                  whileHover={{ scale: 1.005 }}
                  onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
                  className="p-3 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">{service.title}</h4>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed mt-0.5">
                        {service.description}
                      </p>
                    </div>
                    {(service.features?.length ?? 0) > 0 && (
                      <motion.div
                        animate={{ rotate: expandedId === service.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-purple-400 shrink-0 mt-0.5"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {((service.features?.length ?? 0) > 0 || (service.technologies?.length ?? 0) > 0) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: expandedId === service.id ? "auto" : 0, opacity: expandedId === service.id ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-[hsl(var(--border)/0.3)]"
                  >
                    <div className="p-3 space-y-3 bg-[hsl(var(--secondary)/0.3)]">
                      {service.features && service.features.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] uppercase font-semibold text-purple-400 tracking-wider">
                            {isES ? "Características" : "Features"}
                          </p>
                          {service.features.map((f, fi) => (
                            <motion.div
                              key={f}
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: fi * 0.05 }}
                              className="flex items-start gap-2 text-xs text-[hsl(var(--muted-foreground))]"
                            >
                              <CheckCircle2 className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />
                              <span>{f}</span>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      {service.technologies && service.technologies.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] uppercase font-semibold text-purple-400 tracking-wider">
                            {isES ? "Tecnologías" : "Technologies"}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {service.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 text-xs bg-purple-500/10 text-purple-300 rounded border border-purple-500/30"
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
        </div>
      </div>
    </PanelBase>
  );
}
