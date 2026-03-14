# AI Terminal Portfolio

An interactive, modern portfolio website built like an AI terminal interface. 100% frontend with Next.js, TypeScript, Tailwind CSS, and Framer Motion. No external APIs or LLM dependencies.

## 🎯 Features

- **Interactive Terminal Interface** — Command-based interaction with real-time responses
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations** — Powered by Framer Motion for fluid UI transitions
- **Boot Sequence** — Realistic system initialization with loading states
- **Command Suggestions** — Auto-complete for available commands
- **Idle Mode** — System messages appear after inactivity
- **Dark Theme** — Cyberpunk-inspired cyan/blue color scheme
- **Multiple Content Pages** — About, Skills, Projects, Contact pages

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (current: v22.22.0)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/devalentineomonya/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (terminal)
│   ├── globals.css              # Global styles
│   ├── about/page.tsx           # About page
│   ├── skills/page.tsx          # Skills page
│   ├── projects/page.tsx        # Projects listing
│   └── projects/[id]/page.tsx   # Project details
├── components/
│   ├── terminal/
│   │   ├── Terminal.tsx         # Main terminal component
│   │   ├── TerminalHistory.tsx  # Message history display
│   │   ├── TerminalInput.tsx    # Input field & suggestions
│   │   ├── CommandSuggestions.tsx
│   │   └── TypingLine.tsx       # Character-by-character typing
│   ├── BootScreen.tsx           # Initial boot sequence
│   ├── SystemPanel.tsx          # System status display
│   └── ContentPanel.tsx         # Reusable content layout
└── lib/
    ├── commands.ts              # Command definitions
    ├── responses.ts             # Command responses & content
    ├── terminalTypes.ts         # TypeScript types
    └── useCommandHandler.ts     # Command handling logic

```

## 🎮 Available Commands

### Core Commands

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/about` | View developer profile |
| `/projects` | Browse all projects |
| `/project <id>` | View specific project details |
| `/skills` | Display skill matrix |
| `/contact` | Communication channels |
| `/github` | Open GitHub profile |
| `/cv` | Download CV |
| `/system` | System status |
| `/architecture` | Project architecture |
| `/timeline` | Development timeline |

### Easter Eggs

| Command | Effect |
|---------|--------|
| `/coffee` | Caffeine status |
| `/whoami` | Identity query |
| `/train` | ML training sequence |
| `/joke` | Random developer joke |
| `/hack` | Hack attempt (denied) |

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) — React with server-side capabilities
- **Language**: [TypeScript](https://www.typescriptlang.org/) — Type-safe development
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) — Utility-first CSS
- **Animations**: [Framer Motion 12](https://www.framer.com/motion/) — Advanced motion library
- **Utilities**: [clsx](https://www.npmjs.com/package/clsx) — Class name utilities
- **Deployment**: [Vercel](https://vercel.com/) — Optimized Next.js hosting

## 📝 Architecture

### Component Hierarchy

```
<Terminal>
├── <BootScreen>              (Initial display)
├── <SystemPanel>             (Status information)
└── <Terminal Box>
    ├── <TerminalHistory>
    │   ├── Terminal Messages (animated)
    │   └── Idle Message (when inactive)
    └── <TerminalInput>
        ├── <CommandSuggestions>
        └── Input Field
```

### Command Flow

1. User types command in input
2. `useCommandHandler` parses and validates
3. Command router determines response type
4. Response appears in history with animation
5. Navigation commands trigger Next.js routing

### State Management

- **Local State**: React hooks (useState) for UI state
- **No External State**: All data is deterministic and client-side
- **History Tracking**: Command history for arrow key navigation

## 🎨 Styling & Theme

The portfolio uses a cyberpunk-inspired color scheme:

- **Background**: Pure black (#000000)
- **Primary**: Cyan (#00f2ff, #06b6d4)
- **Secondary**: Lime/Emerald for status
- **Accents**: Cyan with glow effects

### Key Tailwind Classes

- `text-cyan-*` — Text colors
- `border-cyan-*` — Border styling
- `bg-cyan-*` — Background with opacity
- `shadow-[0_0_30px_rgba(0,242,255,0.15)]` — Glow effect

## ⚡ Performance

- **Next.js Optimization**: Image optimization, code splitting, dynamic imports
- **CSS-in-JS**: Tailwind with PostCSS for efficient bundling
- **Animation**: Framer Motion handles GPU-accelerated transforms
- **Responsive**: Mobile-first design with adaptive layouts

### Build Output

```bash
npm run build
```

Creates optimized production build in `.next/` directory.

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy directly from GitHub
1. Push code to GitHub
2. Connect repository to Vercel
3. Auto-deploys on every push
```

### Manual Deployment

```bash
npm run build
npm start
```

## 📱 Mobile Responsive

- **Mobile**: Optimized touch input, smaller fonts
- **Tablet**: Medium layout adjustments
- **Desktop**: Full-width layout with enhanced visuals

Breakpoints: `md` (768px), `lg` (1024px)

## 🔧 Development

### Hot Reload

Changes to files automatically reload the dev server:

```bash
npm run dev
```

### Building

```bash
# Development build (fast)
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

## 📖 Customization

### Adding Commands

1. Add to `lib/commands.ts`:
```typescript
export type CommandKey = "..." | "/newcommand";
```

2. Add response to `lib/responses.ts`:
```typescript
export const responses = {
  "/newcommand": "Your response here"
};
```

### Adding Projects

Edit `lib/responses.ts` `projectDetails()` function or `projects/page.tsx` data.

### Changing Colors

Update Tailwind classes throughout components, or modify CSS variables in `globals.css`:

```css
:root {
  --background: #000000;
  --foreground: #e6f7ff;
  --cyan-glow: 0 0 30px rgba(0, 242, 255, 0.15);
}
```

## 📊 Features Breakdown

### Batch 0: Setup ✅
- Next.js with TypeScript
- Tailwind CSS + Framer Motion
- Project structure

### Batch 1: Terminal Core ✅
- Message types & state
- Command parser
- Response engine
- CommandHandler hook

### Batch 2: UI & UX ✅
- Terminal styling (cyan theme)
- Command suggestions
- Typing effect component
- Animation utilities

### Batch 3: Content Pages ✅
- /about page
- /skills page with matrix
- /projects listing
- /projects/[id] details
- /contact page

### Batch 4: Advanced Features ✅
- Boot screen sequence
- System status panel
- Idle mode (30s timeout)
- Framer Motion animations
- Responsive design

### Batch 5: Finalization ✅
- Code cleanup
- Documentation (README)
- Deploy preparation
- Performance optimization

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Guide](https://www.framer.com/motion//)
- [React Hooks Reference](https://react.dev/reference/react/hooks)

## 📝 License

This project is open source under the MIT License. Feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Submit a pull request

## 📧 Contact

For questions or suggestions:

- **Email**: contact@example.com
- **GitHub**: [@devalentineomonya](https://github.com/devalentineomonya)
- **LinkedIn**: [devalentineomonya](https://linkedin.com/in/devalentineomonya)

---

Built with ❤️ using Next.js, TypeScript, and Framer Motion.
