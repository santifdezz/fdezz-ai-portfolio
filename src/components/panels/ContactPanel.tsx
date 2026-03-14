"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { PanelBase } from "./PanelBase";
import type { Locale } from "@/lib/portfolio-content";

interface ContactLink {
  label: string;
  value: string;
  type: "email" | "phone" | "location" | "website" | "github" | "linkedin";
}

interface ContactPanelProps {
  contacts: ContactLink[];
  locale?: Locale;
}

const iconMap = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  website: Globe,
  github: Globe,
  linkedin: Globe,
};

export function ContactPanel({
  contacts,
  locale = "en",
}: ContactPanelProps) {
  const isES = locale === "es";

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
      <div className="space-y-3">
        {contacts.map((contact, idx) => {
          const Icon = iconMap[contact.type];
          const url = getContactUrl(contact);

          return (
            <motion.div
              key={contact.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              {url ? (
                <a
                  href={url}
                  target={contact.type !== "email" && contact.type !== "phone" ? "_blank" : undefined}
                  rel={contact.type !== "email" && contact.type !== "phone" ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--secondary)/0.5)] border border-[hsl(var(--border)/0.5)] hover:border-purple-500/50 transition-colors cursor-pointer group"
                >
                  <Icon className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {contact.label}
                    </p>
                    <p className="text-sm text-[hsl(var(--foreground))] font-mono break-all">
                      {contact.value}
                    </p>
                  </div>
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
    </PanelBase>
  );
}
