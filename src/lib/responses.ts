export const responses = {
  help: `\
Available commands:

Core Commands:
  /about          Show developer profile
  /projects       View project index
  /skills         Display skill matrix
  /contact        Communication channels
  /github         Open GitHub profile
  /cv             Download CV
  /system         System status
  /architecture   Project architecture
  /timeline       Development timeline

Easter Eggs:
  /coffee         Caffeine status
  /whoami         Identity query
  /train          ML training
  /joke           Tell a joke
  /hack           Hack attempt

Type /help <command> for more info.`,

  about: `\
DEVELOPER PROFILE
=================

Who I Am
---------
Full-stack engineer specialized in AI, data systems, 
and modern web technologies.

What I Build
-------------
• ML/LLM applications and RAG systems
• Data platforms and ETL pipelines
• Interactive AI interfaces
• Performance-optimized web apps

What Interests Me
------------------
• System design & architecture
• Distributed systems
• LLM applications & prompt engineering
• Developer experience

Current Focus
--------------
Building scalable AI applications with focus on 
real-world deployment and optimization.

Type /projects to see what I'm working on.`,

  projects: `\
PROJECT INDEX
=============

[1] RAG SYSTEM
    Retrieval augmented generation pipeline
    > /projects 1

[2] DATA PLATFORM  
    Data ingestion and transformation system
    > /projects 2

[3] RECOMMENDER ENGINE
    ML-based ranking system
    > /projects 3

[4] AI PORTFOLIO
    This portfolio (Next.js + AI Terminal)
    > /projects 4

Type: /projects <id> for details.`,

  projectDetails: (id: string) => {
    const projects: Record<string, string> = {
      "1": `\
PROJECT: RAG SYSTEM
===================

Overview
--------
Advanced retrieval-augmented generation system 
for semantic search and context injection.

Architecture
------------
• Python backend (FastAPI)
• Vector database (Pinecone)
• LLMs via LangChain
• React frontend

Stack
-----
- Python 3.11
- FastAPI
- LangChain
- Pinecone
- PostgreSQL
- Docker

GitHub: https://github.com/youruser/rag-system
Live: https://example.com`,

      "2": `\
PROJECT: DATA PLATFORM
======================

Overview
--------
End-to-end data ingestion, transformation,
and analytics platform.

Architecture
------------
• Apache Spark for ETL
• Airflow orchestration
• Warehouse (Snowflake)
• Analytics layer

Stack
-----
- Python
- Apache Spark
- Apache Airflow
- Snowflake
- dbt
- PostgreSQL

GitHub: https://github.com/youruser/data-platform
Status: ACTIVE`,

      "3": `\
PROJECT: RECOMMENDER ENGINE
===========================

Overview
--------
ML-based ranking and recommendation system
for personalized content discovery.

Architecture
------------
• Collaborative filtering
• Content-based algorithms
• Real-time scoring
• A/B testing framework

Stack
-----
- Python
- scikit-learn
- FastAPI
- Redis
- PostgreSQL

GitHub: https://github.com/youruser/recommender
Impact: 40% CTR improvement`,

      "4": `\
PROJECT: AI PORTFOLIO
====================

Overview
--------
Interactive AI terminal portfolio built with
modern web technologies.

Architecture
------------
• Next.js 16 (App Router)
• TypeScript
• Tailwind CSS
• Framer Motion
• Responsive design

Stack
-----
- Next.js
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

GitHub: https://github.com/youruser/portfolio
Live: https://yourportfolio.dev`,
    };
    return projects[id] || `Project ${id} not found.`;
  },

  skills: `\
SKILL MATRIX
============

Backend & Data
  Python              ██████████ 10/10
  Data Engineering    █████████░ 9/10
  Machine Learning    █████████░ 9/10
  LLM Systems         ████████░░ 8/10
  System Design       ████████░░ 8/10

Frontend & Web
  TypeScript/JS       █████████░ 9/10
  React               █████████░ 9/10
  Next.js             █████████░ 9/10
  Tailwind CSS        ██████████ 10/10
  Framer Motion       ████████░░ 8/10

DevOps & Infrastructure
  Docker              █████████░ 9/10
  PostgreSQL          ████████░░ 8/10
  Cloud (AWS/GCP)     ███████░░░ 7/10
  CI/CD               ████████░░ 8/10

Status: ACTIVE | Last updated: 2024`,

  contact: `\
COMMUNICATION CHANNELS
======================

Email
  contact@example.com

Social
  GitHub:   https://github.com/youruser
  LinkedIn: https://linkedin.com/in/youruser
  Twitter:  https://twitter.com/youruser

Documents
  CV: /cv.pdf
  Resume: /resume.pdf

Availability
  Status: OPEN
  Response time: 24-48 hours
  Preferred: Email or GitHub issues`,

  system: `\
SYSTEM STATUS
==============

Version         2.1
Status          ONLINE ●
Uptime          24h 12m
Load            OPTIMAL
Connections     ACTIVE

Developer
  Name:       You
  Role:       AI Engineer / Full-stack Dev
  Projects:   8
  Languages:  Python, TypeScript, SQL
  
Primary Stack:  Python + ML + Next.js
Performance:    NOMINAL

Last boot:  2024-01-15 14:30:00 UTC
Next check: CONTINUOUS`,

  architecture: `\
ARCHITECTURE OVERVIEW
=====================

Frontend Layer
  > Next.js App Router
  > React Components
  > Tailwind + Framer Motion
  > Real-time updates

Backend Layer
  > FastAPI / Python
  > PostgreSQL
  > Redis Cache
  > Authentication

Infrastructure
  > Docker containers
  > Kubernetes (optional)
  > CI/CD pipeline
  > Monitoring & logging

Data Flow
  User Input → API → Processing → Response → Render`,

  timeline: `\
DEVELOPMENT TIMELINE
====================

2024-Q1  AI Terminal Portfolio v1.0
         - Core terminal interface
         - Command system
         - Content pages

2024-Q2  Advanced Features
         - Typing animations
         - System panel
         - Idle mode

2024-Q3  Optimization & Deploy
         - Performance tuning
         - Mobile responsiveness
         - Vercel deployment

2024-Q4  Polish & Expansion
         - Extended content
         - User interactions
         - Future roadmap

Current: Building Phase 1
Status: ON TRACK ✓`,

  // Easter eggs
  coffee: `\
CAFFEINE STATUS
===============

Input required: ☕

Analyzing neural patterns...
▓▓▓▓▓▓░░░░ 60%

Developer motivation: CRITICAL
Suggestion: IMMEDIATE ACTION REQUIRED

Brewing espresso...
Status: OPERATIONAL ✓`,

  whoami: `\
IDENTITY QUERY
==============

User Type:      Visitor / Potential Collaborator
Session ID:     ACTIVE
Access Level:   OBSERVER
Permissions:    VIEW_PORTFOLIO, READ_CONTENT

You are exploring an AI-powered portfolio.
Genuine human detected: TRUE ✓`,

  train: `\
TRAINING SEQUENCE
=================

Initializing neural network...
▓▓▓▓░░░░░░ 40%

Just kidding. The model is already optimized.
Training not required.

Status: MODEL_OPTIMIZED
Accuracy: 98.7%
Ready for inference ✓`,

  joke: `\
THE JOKE BUFFER
===============

Loading joke from database...

Why did the machine learning engineer break up?

Because the model had too many parameters to commit to.

---

Humor level: UNDEFINED
Hope.value: increasing... ✓`,

  hack: `\
SECURITY CHECK
===============

[ ] Bypassing firewall...
[ ] Accessing root...
[ ] Stealing data...

ACCESS DENIED

System hardened. Nice try though.
Try /help instead for valid commands.

Risk level: NEGLIGIBLE`,

  unknown: `\
UNKNOWN COMMAND
===============

"${(input: string) => input}" is not a valid command.

Type /help to see available commands.
or /help <command> for more info.`,
};
