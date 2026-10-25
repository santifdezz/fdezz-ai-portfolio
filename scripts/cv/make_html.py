"""Builds the one-page classic CV (ES/EN) as HTML. Render to PDF with topdf.swift (see README.md)."""
import html

CSS = """
@page { size: A4; margin: 0 }
* { box-sizing: border-box; margin: 0; padding: 0 }
body { font-family: Georgia, 'Times New Roman', serif; color: #111; background: #fff; width: 794px; padding: 38px 56px 30px; font-size: 11.9px; line-height: 1.4 }
h1 { font-size: 27px; font-weight: 400; letter-spacing: 0.01em; text-align: center }
.role { text-align: center; font-style: italic; font-size: 13px; margin-top: 2px; color: #333 }
.contact { text-align: center; font-size: 11.4px; margin-top: 7px; color: #222 }
.contact span + span::before { content: "  ·  "; color: #888 }
h2 { font-size: 11.2px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; border-bottom: 0.8px solid #111; padding-bottom: 2px; margin: 13px 0 6px }
.profile { text-align: justify }
.entry { margin-bottom: 8px; break-inside: avoid }
.head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px }
.head b { font-weight: 700 }
.when { white-space: nowrap; font-size: 11.4px }
.org { font-style: italic; color: #222 }
ul { margin: 2px 0 0 15px }
li { margin-bottom: 1.5px; text-align: justify }
.skills p { margin-bottom: 2.5px }
.skills b { font-weight: 700 }
"""

ES = dict(
 lang="es", file="santiago-fernandez-cv-es", role="Data Scientist",
 contact=["Madrid, España", "santifdezseo@gmail.com", "sfseoane.es", "linkedin.com/in/santifdezseo"],
 profile_h="Perfil",
 profile="Data Scientist con experiencia en producción: sistemas RAG, pipelines ETL orquestados con Airflow y modelos de visión, en proyectos con clientes de distintos sectores, incluido un cliente multinacional. Fundador de Makineo, plataforma real con más de 900 experiencias próximas. Trabajo con Python, SQL y TypeScript, y me ocupo de la solución completa: investigación previa, infraestructura y cumplimiento.",
 exp_h="Experiencia profesional",
 exp=[
  ("Data Scientist", "Qaleon Solutions · Consultoría de IA, Madrid", "2025 – Actualidad", [
    "Rol multiproyecto con soluciones para distintos sectores, incluido un cliente multinacional: más de 30.000 documentos y 20M+ de datos procesados.",
    "Desarrollo de sistemas RAG (LangChain, FAISS), pipelines ETL orquestados con Airflow, modelos de visión para detección y clasificación y análisis de sentimiento.",
    "Responsable de la investigación previa y de la búsqueda de los recursos que necesita cada solución; apoyo y mantenimiento de la infraestructura (Docker, entornos de producción) y cumplimiento de ISO 27001.",
    "Optimización de consultas a bases de datos y colaboración directa con clientes."]),
  ("Fundador", "Makineo · Plataforma de música electrónica en España", "Junio 2025 – Actualidad", [
    "Plataforma full-stack para la escena de música electrónica española con más de 900 experiencias próximas, panel de administración propio y app móvil nativa.",
    "Nuxt, Vue, TypeScript, FastAPI, PostgreSQL, Capacitor y pruebas E2E con Playwright."]),
  ("Quality Assurance (prácticas, grado superior)", "Merlin Software", "Abril – Junio 2024", [
    "Pruebas automatizadas con Cypress, Karate, JMeter y Appium; optimización de los flujos de testing e informe detallado de incidencias en tiempo real."]),
  ("Soporte interno", "Qindel Group", "Marzo – Septiembre 2021", [
    "Gestión de incidencias; actualización y configuración de más de 100 servidores de la Universidad de A Coruña, integrándolos en un nuevo sistema de monitorización."]),
 ],
 proj_h="Proyectos",
 proj=[
  ("Punch", "punch.sfseoane.es", "Revisor de UI/UX: mide SEO, accesibilidad y Web Vitals en un navegador real y un modelo de visión anota la captura. FastAPI, Nuxt, PostgreSQL, Playwright."),
  ("CuadroScan", "cuadroscan.sfseoane.es", "De la foto del cuadro eléctrico a la revisión contra el REBT: la IA solo lee y un motor de reglas determinista decide, citando el artículo. FastAPI."),
  ("MakineoBeats", "beats.makineo.es", "Motor procedural de música electrónica: patrones, síntesis propia y mezcla; la misma escena y la misma seed dan siempre el mismo audio. 16 géneros. Python, FastAPI."),
 ],
 edu_h="Formación",
 edu=[
  ("Curso de especialización en Inteligencia Artificial y Big Data", "IES Fernando Wirtz", "2024 – 2025"),
  ("Ciclo Superior en Desarrollo de Aplicaciones Multiplataforma", "CPR Afundación Abanca", "2022 – 2024"),
  ("Ciclo Medio en Sistemas Microinformáticos y Redes", "IES Fernando Wirtz", "2020 – 2021"),
 ],
 skills_h="Competencias técnicas",
 skills=[
  ("Lenguajes y datos", "Python (Pandas, NumPy, Scikit-learn), SQL, TypeScript; PostgreSQL, MySQL, MongoDB, Redis."),
  ("IA y ML", "RAG (LangChain, FAISS, Ollama), visión por computador, modelado predictivo, regresión, clasificación, redes convolucionales."),
  ("Datos e infraestructura", "Apache Airflow, Apache NiFi, Spark, Kafka, Docker; scraping con Requests, BeautifulSoup y Selenium."),
  ("Calidad y visualización", "Cypress, Karate, JMeter, Appium, Playwright; Power BI, Matplotlib, Seaborn. Scrum y Agile."),
 ],
 lang_h="Idiomas", langs="Gallego (nativo) · Español (nativo) · Inglés (B2)",
)

EN = dict(
 lang="en", file="santiago-fernandez-cv-en", role="Data Scientist",
 contact=["Madrid, Spain", "santifdezseo@gmail.com", "sfseoane.es", "linkedin.com/in/santifdezseo"],
 profile_h="Profile",
 profile="Data Scientist with production experience: RAG systems, ETL pipelines orchestrated with Airflow and vision models, on projects for clients across several sectors, including a multinational client. Founder of Makineo, a live platform with over 900 upcoming experiences. I work in Python, SQL and TypeScript and own the whole solution: prior research, infrastructure and compliance.",
 exp_h="Professional experience",
 exp=[
  ("Data Scientist", "Qaleon Solutions · AI Consulting, Madrid", "2025 – Present", [
    "Multi-project role delivering solutions across several sectors, including a multinational client: 30,000+ documents and 20M+ data records processed.",
    "Built RAG systems (LangChain, FAISS), ETL pipelines orchestrated with Airflow, vision models for detection and classification, and sentiment analysis.",
    "Owned the prior research and the sourcing of the resources each solution needs; supported and maintained the infrastructure (Docker, production environments) and ISO 27001 compliance.",
    "Database query optimisation and direct collaboration with clients."]),
  ("Founder", "Makineo · Electronic music platform in Spain", "June 2025 – Present", [
    "Full-stack platform for the Spanish electronic music scene with 900+ upcoming experiences, a custom admin panel and a native mobile app.",
    "Nuxt, Vue, TypeScript, FastAPI, PostgreSQL, Capacitor and end-to-end tests with Playwright."]),
  ("Quality Assurance (internship)", "Merlin Software", "April – June 2024", [
    "Automated tests with Cypress, Karate, JMeter and Appium; streamlined testing flows and real-time incident reporting."]),
  ("Internal Support", "Qindel Group", "March – September 2021", [
    "Incident handling; updated and configured 100+ servers for the University of A Coruña and integrated them into a new monitoring system."]),
 ],
 proj_h="Projects",
 proj=[
  ("Punch", "punch.sfseoane.es", "UI/UX reviewer: measures SEO, accessibility and Web Vitals in a real browser, and a vision model annotates the screenshot. FastAPI, Nuxt, PostgreSQL, Playwright."),
  ("CuadroScan", "cuadroscan.sfseoane.es", "From a photo of an electrical panel to a Spanish REBT compliance review: the AI only reads, a deterministic rules engine decides and cites the article. FastAPI."),
  ("MakineoBeats", "beats.makineo.es", "Procedural electronic-music engine: patterns, own synthesis and mixing; the same scene and seed always render the same audio. 16 genres. Python, FastAPI."),
 ],
 edu_h="Education",
 edu=[
  ("Specialisation course in Artificial Intelligence and Big Data", "IES Fernando Wirtz", "2024 – 2025"),
  ("Higher Technical Diploma in Cross-Platform Application Development", "CPR Afundación Abanca", "2022 – 2024"),
  ("Intermediate Diploma in Microcomputer Systems and Networks", "IES Fernando Wirtz", "2020 – 2021"),
 ],
 skills_h="Technical skills",
 skills=[
  ("Languages and data", "Python (Pandas, NumPy, Scikit-learn), SQL, TypeScript; PostgreSQL, MySQL, MongoDB, Redis."),
  ("AI and ML", "RAG (LangChain, FAISS, Ollama), computer vision, predictive modelling, regression, classification, convolutional networks."),
  ("Data and infrastructure", "Apache Airflow, Apache NiFi, Spark, Kafka, Docker; scraping with Requests, BeautifulSoup and Selenium."),
  ("Quality and visualisation", "Cypress, Karate, JMeter, Appium, Playwright; Power BI, Matplotlib, Seaborn. Scrum and Agile."),
 ],
 lang_h="Languages", langs="Galician (native) · Spanish (native) · English (B2)",
)

e = html.escape


def build(d):
    o = [f'<!doctype html><html lang="{d["lang"]}"><meta charset="utf-8"><title>Santiago Fernández | CV</title><style>{CSS}</style><body>']
    o.append("<h1>Santiago Fernández</h1>")
    o.append(f'<p class="role">{e(d["role"])}</p>')
    o.append('<p class="contact">' + "".join(f"<span>{e(c)}</span>" for c in d["contact"]) + "</p>")
    o.append(f'<h2>{d["profile_h"]}</h2><p class="profile">{e(d["profile"])}</p>')
    o.append(f'<h2>{d["exp_h"]}</h2>')
    for title, org, when, bullets in d["exp"]:
        o.append(f'<div class="entry"><div class="head"><span><b>{e(title)}</b>, <span class="org">{e(org)}</span></span><span class="when">{e(when)}</span></div><ul>' + "".join(f"<li>{e(b)}</li>" for b in bullets) + "</ul></div>")
    o.append(f'<h2>{d["proj_h"]}</h2>')
    for name, url, desc in d["proj"]:
        link = f' <span class="when">({e(url)})</span>' if url else ""
        o.append(f'<div class="entry"><div><b>{e(name)}</b>{link}. {e(desc)}</div></div>')
    o.append(f'<h2>{d["edu_h"]}</h2>')
    for title, org, when in d["edu"]:
        o.append(f'<div class="entry"><div class="head"><span><b>{e(title)}</b>, <span class="org">{e(org)}</span></span><span class="when">{e(when)}</span></div></div>')
    o.append(f'<h2>{d["skills_h"]}</h2><div class="skills">' + "".join(f"<p><b>{e(k)}:</b> {e(v)}</p>" for k, v in d["skills"]) + "</div>")
    o.append(f'<h2>{d["lang_h"]}</h2><p>{e(d["langs"])}</p></body></html>')
    return "\n".join(o)


if __name__ == "__main__":
    for d in (ES, EN):
        open(f'{d["file"]}.html', "w").write(build(d))
    print("ok")
