# fdezz — AI Terminal Portfolio

An interactive terminal-interface portfolio built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

## Features

✨ **Interactive Terminal UI** — Navigate via typed commands
🌍 **Bilingual** — English & Spanish with `/lang en|es`
🎨 **Dark Terminal Aesthetic** — Cyan/neon theme inspired by classic terminals
⚡ **Fast & Static** — No external APIs, 100% frontend
🐳 **Containerized** — Docker for consistent development
📱 **Responsive** — Works on desktop and mobile

## Quick Start

### With Docker (recommended)

```bash
# Development
make dev
# or: docker-compose up

# Production
make prod
# or: docker-compose -f docker-compose.prod.yml up -d

# Build production image
make build
```

Then open [http://localhost:3000](http://localhost:3000).

### Without Docker

```bash
npm install
npm run dev
```

## Commands

Try typing these in the terminal:

| Command | Description |
|---------|-------------|
| `/help` | List all commands |
| `/about` | Developer profile |
| `/projects` | Browse projects |
| `/skills` | Skill matrix |
| `/contact` | Contact channels |
| `/system` | System status |
| `/clear` | Clear terminal |
| `/lang en\|es` | Switch language |

**Easter eggs:** `/coffee`, `/whoami`, `/train`, `/joke`, `/hack`

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home (terminal)
│   ├── layout.tsx            # Root layout
│   ├── about/page.tsx        # About page
│   ├── projects/page.tsx     # Projects listing
│   ├── projects/[id]/page.tsx# Project detail
│   ├── skills/page.tsx       # Skills matrix
│   ├── contact/page.tsx      # Contact
│   └── timeline/page.tsx     # Timeline
├── components/
│   ├── terminal/
│   │   ├── Terminal.tsx      # Main terminal component
│   │   ├── TerminalInput.tsx
│   │   ├── TerminalHistory.tsx
│   │   ├── TypingLine.tsx
│   │   └── CommandSuggestions.tsx
│   └── layouts/
│       └── PageLayout.tsx    # Page wrapper
└── lib/
    ├── terminalTypes.ts      # TypeScript types
    ├── commands.ts           # Command parsing
    ├── responses.ts          # Response generation
    ├── useCommandHandler.ts  # Command hook
    ├── projects.ts           # Project data
    └── content/
        ├── en.ts             # English strings
        └── es.ts             # Spanish strings
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Containerization:** Docker & Docker Compose
- **Font:** JetBrains Mono

## Development

### With Make

```bash
make dev              # Start dev server
make dev-build       # Rebuild dev container
make lint            # Run ESLint
make type-check      # Run TypeScript check
make logs            # View logs
make clean           # Remove containers & volumes
```

### With docker-compose

```bash
docker-compose up              # Start dev
docker-compose down            # Stop
docker-compose logs -f web     # Logs
docker-compose exec web npm run lint
```

## Customization

### Change developer name

1. Update `src/app/layout.tsx` — metadata title
2. Update `src/components/terminal/Terminal.tsx` — header and prompt
3. Update `src/lib/content/en.ts` and `es.ts` — responses and links
4. Update `src/app/about/page.tsx` — profile content
5. Update `src/lib/projects.ts` — your projects

### Add new projects

Edit `src/lib/projects.ts` and add entries to the `projects` array:

```typescript
{
  id: "my-project",
  name: "My Project",
  description: "Short description",
  overview: "Detailed overview",
  architecture: "Tech details",
  stack: ["Tech1", "Tech2"],
  tags: ["tag1", "tag2"],
  github: "https://github.com/fdezz/my-project",
  year: 2025,
}
```

### Change colors

Edit `src/app/globals.css` — CSS variables at `:root`.

## Deployment

### Production Docker Image

```bash
docker-compose -f docker-compose.prod.yml up -d
# or: make prod
```

### To a VPS

```bash
# Build the image
make build

# Push to registry (e.g., Docker Hub)
docker tag fdezz-ai-portfolio:latest your-registry/fdezz:latest
docker push your-registry/fdezz:latest

# On server
docker pull your-registry/fdezz:latest
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Container won't start
```bash
make clean
make dev-build
```

### Port 3000 already in use
```bash
docker-compose down
# Change port in docker-compose.yml and try again
```

### Changes not showing
```bash
docker-compose down
docker volume prune
make dev
```

## License

MIT — Use freely for your portfolio.

---

**Built with ❤️ using Next.js 16, React 19, and TypeScript 5.**

Made by **fdezz** — [GitHub](https://github.com/fdezz) • [Email](mailto:hello@fdezz.dev)
