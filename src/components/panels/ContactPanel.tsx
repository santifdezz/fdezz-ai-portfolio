"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Copy, Check } from "lucide-react";
import { PanelBase } from "./PanelBase";
import type { Locale } from "@/lib/portfolio-content";

interface ContactLink {
  label: string;
  value: string;
  type: "email" | "phone" | "location" | "website" | "github" | "linkedin";
}

interface ContactPanelProps {
  subtitle?: string;
  description?: string;
  location?: string;
  availability?: string;
  contacts: ContactLink[];
  locale?: Locale;
}

const iconMap = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  website: Globe,
  github: Github,
  linkedin: Linkedin,
};

export function ContactPanel({
  subtitle,
  description,
  location,
  availability,
  contacts,
  locale = "en",
}: ContactPanelProps) {
  const isES = locale === "es";
  const [copiedLabel, setCopiedLabel] = React.useState<string | null>(null);

  const handleCopy = (value: string, label: string) => {
    const text = value.startsWith("http") ? value : value;
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const getContactUrl = (contact: ContactLink): string | null => {
    switch (contact.type) {
      case "email":
        return `mailto:${contact.value}`;
      case "phone":
        return `tel:${contact.value}`;
      case "website":
      case "github":
      case "linkedin":
        return contact.value.startsWith("http")
          ? contact.value
          : `https://${contact.value}`;
      default:
        return null;
    }
  };

  return (
    <PanelBase
      icon={Mail}
      title={isES ? "Contacto" : "Contact"}
      accentColor="purple"
    >
      <div className="space-y-6">
        {/* Header Info */}
        {(subtitle || description) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            {subtitle && (
              <p className="text-sm italic text-purple-300">"{subtitle}"</p>
            )}
            {description && (
              <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                {description}
              </p>
            )}
          </motion.div>
        )}

        {/* Location & Availability Badges */}
        {(location || availability) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {location && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-300">
                <MapPin className="w-3 h-3" />
                {location}
              </div>
            )}
            {availability && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-xs text-green-300">
                <Check className="w-3 h-3" />
                {availability}
              </div>
            )}
          </motion.div>
        )}

        {/* Contact Links */}
        <div className="space-y-3">
          {contacts.map((contact, idx) => {
            const Icon = iconMap[contact.type];
            const url = getContactUrl(contact);

            return (
              <motion.div
                key={contact.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.08 }}
              >
                {url ? (
                  <a
                    href={url}
                    target={contact.type !== "email" && contact.type !== "phone" ? "_blank" : undefined}
                    rel={contact.type !== "email" && contact.type !== "phone" ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[hsl(var(--secondary)/0.5)] border border-[hsl(var(--border)/0.5)] hover:border-purple-500/50 hover:bg-[hsl(var(--secondary)/0.7)] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          {contact.label}
                        </p>
                        <p className="text-sm text-[hsl(var(--foreground))] font-mono">
                          {contact.value}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleCopy(contact.value, contact.label);
                      }}
                      className="p-1.5 hover:bg-purple-500/20 rounded transition-colors shrink-0"
                      title={isES ? "Copiar" : "Copy"}
                    >
                      {copiedLabel === contact.label ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                      )}
                    </button>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--secondary)/0.5)] border border-[hsl(var(--border)/0.5)]">
                    <Icon className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {contact.label}
                      </p>
                      <p className="text-sm text-[hsl(var(--foreground))]">
                        {contact.value}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Quick message CTA */}
        <motion.a
          href="mailto:santifdezseo@gmail.com?subject=Hi%20Santiago%20%E2%80%94%20saw%20your%20portfolio"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600/80 to-purple-500/80 hover:from-purple-500 hover:to-purple-400 text-white text-sm font-semibold transition-all border border-purple-500/40"
        >
          <Mail className="w-4 h-4" />
          {isES ? "Enviar mensaje rápido" : "Send a quick message"}
        </motion.a>

        <p className="text-[10px] text-center text-[hsl(var(--muted-foreground))]">
          {isES ? "Respondo en menos de 24h" : "I reply within 24h"}
        </p>
      </div>
    </PanelBase>
  );
}
