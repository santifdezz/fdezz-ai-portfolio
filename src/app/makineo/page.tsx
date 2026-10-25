import type { Metadata } from "next";
import { CaseStudy } from "@/components/editorial/CaseStudy";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cómo está hecho Makineo | Santiago Fernández",
  description: "Arquitectura, datos, pruebas y estado de Makineo, la plataforma de la escena de música electrónica en España. Sin código: el repositorio es privado.",
  alternates: { canonical: `${SITE_URL}/makineo` },
};

export default function MakineoCaseStudy() {
  return <CaseStudy />;
}
