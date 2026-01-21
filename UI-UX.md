# Sports Fest 2026 - Complete UI/UX Documentation

> **A comprehensive guide to replicate the exact UI/UX design of the Rishihood Sports Fest 2026 web application.**

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Library](#component-library)
6. [Animation System](#animation-system)
7. [Page Sections](#page-sections)
8. [Special Effects](#special-effects)
9. [Responsive Design](#responsive-design)
10. [Dependencies & Tech Stack](#dependencies--tech-stack)
11. [CSS Variables Reference](#css-variables-reference)
12. [Implementation Code Examples](#implementation-code-examples)

---

## Design Philosophy

### Core Principles

1. **Dark Premium Theme** - Deep black backgrounds with warm cream/gold accents
2. **Sports-Inspired Energy** - Bold typography, dynamic animations, competitive aesthetics
3. **Glassmorphism Elements** - Frosted glass effects with blur and transparency
4. **Motion Design** - Smooth, physics-based animations using Framer Motion
5. **Grid-Based Layouts** - Subtle grid patterns for visual structure
6. **Micro-interactions** - Hover effects, scale transitions, and glow effects

### Visual Identity

- **Brand Colors**: Deep Red (#b20e38) + Cream (#ffe5cd)
- **Mood**: Premium, energetic, competitive, modern
- **Style**: Dark mode with warm accents, sports/athletic aesthetic

---

## Color System

### Primary Palette

```css
:root {
  /* ═══════════════════════════════════════════════════════════
     SPORTS FEST 2026 - PREMIUM THEME
     Primary: Deep Red #b20e38 | Secondary: Cream #ffe5cd
     ═══════════════════════════════════════════════════════════ */

  /* Base Colors */
  --background: #0a0a0b;
  --background-secondary: #111113;
  --foreground: #ffe5cd;
  --card-bg: #131315;
  --card-bg-hover: #1a1a1d;
  --card-border: #252528;

  /* Primary - Deep Red */
  --accent-primary: #b20e38;
  --accent-primary-hover: #d41145;
  --accent-primary-light: #e8456d;
  --accent-primary-dim: rgba(178, 14, 56, 0.15);
  --accent-primary-glow: rgba(178, 14, 56, 0.4);

  /* Secondary - Cream */
  --accent-secondary: #ffe5cd;
  --accent-secondary-hover: #fff0e1;
  --accent-secondary-dim: rgba(255, 229, 205, 0.1);
  --accent-secondary-dark: #d4b896;

  /* Tertiary - Gold accent */
  --accent-tertiary: #f59e0b;
  --accent-tertiary-hover: #d97706;
  --accent-tertiary-dim: rgba(245, 158, 11, 0.2);

  /* Status Colors */
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;

  /* Text Colors */
  --text-primary: #ffe5cd;
  --text-secondary: #c9b8a8;
  --text-muted: #7a7069;
  --text-inverse: #0a0a0b;
}
```

### Gradient Definitions

```css
/* Gradient Variants */
--gradient-primary: linear-gradient(135deg, #b20e38 0%, #8b0a2c 100%);
--gradient-secondary: linear-gradient(135deg, #ffe5cd 0%, #f5d5b5 100%);
--gradient-accent: linear-gradient(135deg, #b20e38 0%, #ffe5cd 100%);
--gradient-hero: linear-gradient(135deg, rgba(178, 14, 56, 0.3) 0%, rgba(255, 229, 205, 0.05) 50%, transparent 100%);
```

### Sport-Specific Colors (for cards)

```typescript
const sportsColors = {
  football: { gradient: "from-emerald-500 to-emerald-700", accent: "#22c55e" },
  basketball: { gradient: "from-orange-500 to-orange-700", accent: "#f97316" },
  badminton: { gradient: "from-violet-500 to-violet-700", accent: "#8b5cf6" },
  cricket: { gradient: "from-blue-500 to-blue-700", accent: "#3b82f6" },
};
```

---

## Typography

### Font Stack

```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

/* Font Variables */
--font-sans: 'Inter', system-ui, sans-serif;        /* Body text */
--font-display: 'Bebas Neue', sans-serif;           /* Headlines */
--font-mono: 'Space Grotesk', monospace;            /* Numbers/Stats */
```

### Typography Classes

```css
/* Display Font (Headlines) */
.font-display {
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Monospace Font (Numbers) */
.font-mono {
  font-family: 'Space Grotesk', monospace;
}

/* Scoreboard-style numbers */
.numbers-display {
  font-family: 'Space Grotesk', monospace;
  font-weight: 700;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
}
```

### Heading Sizes

| Level | Class | Size | Usage |
|-------|-------|------|-------|
| H1 | `text-[clamp(3rem,12vw,10rem)]` | Responsive 48-160px | Hero titles |
| H2 | `text-5xl sm:text-6xl lg:text-7xl` | 48-72px | Section headings |
| H3 | `text-xl lg:text-2xl` | 20-24px | Card titles |
| Body | `text-base` | 16px | Paragraphs |
| Small | `text-sm` | 14px | Labels, captions |
| XS | `text-xs` | 12px | Badges, tags |

### Gradient Text Effects

```css
.text-gradient {
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-gradient-primary {
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Spacing & Layout

### Container Widths

```css
.max-w-7xl { max-width: 80rem; }  /* 1280px - Main container */
.max-w-2xl { max-width: 42rem; }  /* 672px - Content sections */
.max-w-md { max-width: 28rem; }   /* 448px - Small modals */
```

### Standard Padding

```css
/* Container Padding */
.px-4 sm:px-6 lg:px-8  /* Horizontal: 16px → 24px → 32px */

/* Section Padding */
.py-32  /* Vertical: 128px per section */

/* Card Padding */
.p-6 lg:p-8  /* 24px → 32px */
```

### Grid Systems

```css
/* Sports Card Grid */
.grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8

/* Stats Grid */
.grid grid-cols-3 gap-8

/* How It Works */
.grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6

/* Footer Grid */
.grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12
```

### Border Radius Scale

```css
rounded-lg     /* 8px - Buttons, inputs */
rounded-xl     /* 12px - Cards, dropdowns */
rounded-2xl    /* 16px - Large cards */
rounded-3xl    /* 24px - Hero cards */
rounded-full   /* Circular - Badges, avatars */
```

---

## Component Library

### 1. Button Component

```tsx
// Variants: primary, secondary, tertiary, ghost, danger
// Sizes: sm, md, lg

const variants = {
  primary: "bg-[var(--accent-primary)] text-[var(--accent-secondary)] hover:bg-[var(--accent-primary-hover)] hover:shadow-lg hover:shadow-[var(--accent-primary-glow)]",
  secondary: "bg-transparent text-[var(--accent-secondary)] border-2 border-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] hover:text-[var(--background)]",
  tertiary: "bg-[var(--accent-tertiary)] text-white hover:bg-[var(--accent-tertiary-hover)]",
  ghost: "bg-transparent text-[var(--text-secondary)] hover:text-[var(--accent-secondary)] hover:bg-[var(--accent-primary-dim)]",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

// Features:
// - Shimmer effect on hover (gradient overlay)
// - Scale animation on tap (0.98)
// - Y-axis hover lift (-2px)
// - Loading spinner state
// - Icon support (left position)
// - Uppercase text with letter-spacing: 0.08em
```

### 2. Card Component

```tsx
// Base styles
"bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden relative"

// Hover effects
whileHover={{ y: -8, scale: 1.01 }}
"hover:shadow-[0_25px_50px_rgba(0,0,0,0.4)]"
"hover:border-[var(--accent-primary-dim)]"

// Glow variant
"hover:border-[var(--accent-primary)] hover:shadow-[0_0_40px_rgba(178,14,56,0.15)]"

// Gradient overlay on hover
<div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/0 to-transparent opacity-0 hover:opacity-5" />
```

### 3. Input Component

```tsx
// Base styles
"w-full bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-[var(--foreground)] rounded-xl px-4 py-3"

// Focus states
"focus:outline-none focus:border-[var(--accent-primary)] focus:ring-4 focus:ring-[var(--accent-primary-dim)]"

// Hover state
"hover:border-[var(--accent-primary-dim)]"

// Features:
// - Label with required indicator (red asterisk)
// - Icon support (left/right position) with pl-14 or pr-14
// - Error state with animated reveal
// - Disabled state (opacity-50 cursor-not-allowed)
```

### 4. Badge Component

```tsx
// Base styles
"inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border"
"transition-all duration-200 hover:scale-105"

// Variants
const variants = {
  default: "bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--card-border)]",
  primary: "bg-[var(--accent-primary-dim)] text-[var(--accent-primary-light)] border-[var(--accent-primary)]",
  secondary: "bg-[var(--accent-secondary-dim)] text-[var(--accent-secondary)] border-[var(--accent-secondary-dark)]",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  error: "bg-red-500/15 text-red-400 border-red-500/30",
  individual: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  team: "bg-orange-500/15 text-orange-400 border-orange-500/30",
};
```

### 5. Modal Component

```tsx
// Backdrop
"fixed inset-0 bg-black/80 backdrop-blur-sm z-50"

// Modal container
"bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-2xl"

// Animation
initial={{ opacity: 0, scale: 0.95, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.95, y: 20 }}
transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}

// Features:
// - ESC key to close
// - Focus trap
// - Body scroll lock
// - Size variants: sm (max-w-md), md (max-w-lg), lg (max-w-2xl), xl (max-w-4xl)
```

### 6. Select/Dropdown Component

```tsx
// Trigger button
"w-full bg-[var(--input-bg)] border border-[var(--input-border)] text-white rounded-xl px-4 py-3 pr-12"

// Dropdown
"absolute z-50 w-full mt-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-xl"

// Dropdown animation
"transition-all duration-200 origin-top"
isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"

// Option states
"px-4 py-2.5 text-sm cursor-pointer"
highlighted && "bg-[var(--accent-primary)]/10"
selected && "text-[var(--accent-primary)] font-medium"
```

### 7. Progress Bar

```tsx
// Track
"w-full bg-[var(--card-border)] rounded-full overflow-hidden h-2"

// Fill
"h-full bg-[var(--accent-primary)] rounded-full transition-all duration-500 ease-out"

// Animated fill
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${percentage}%` }}
  transition={{ duration: 1, delay: 0.5 }}
/>
```

### 8. Accordion Component

```tsx
// Container
"border border-[var(--card-border)] rounded-xl overflow-hidden bg-[var(--card-bg)]"

// Trigger
"w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"

// Chevron rotation
animate={{ rotate: isOpen ? 180 : 0 }}
transition={{ duration: 0.2 }}

// Content animation
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    />
  )}
</AnimatePresence>
```

---

## Animation System

### Framer Motion Variants

```typescript
// Page transitions
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

// Stagger animations for lists
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

// Card hover
export const cardVariants = {
  hover: {
    y: -10,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17,
    },
  },
  tap: { scale: 0.95 },
};

// Modal
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } },
};

// SVG path drawing
export const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 1.5, bounce: 0 },
      opacity: { duration: 0.01 },
    },
  },
};

// Slide animations
export const slideInLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export const slideInRight = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};
```

### CSS Keyframe Animations

```css
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 30px rgba(178, 14, 56, 0.4); }
  50% { box-shadow: 0 0 60px rgba(178, 14, 56, 0.6), 0 0 90px rgba(178, 14, 56, 0.3); }
}

@keyframes slide-up {
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes shimmer {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}

@keyframes text-glow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(178, 14, 56, 0.4), 0 0 20px rgba(178, 14, 56, 0.2);
  }
  50% {
    text-shadow: 0 0 20px rgba(178, 14, 56, 0.6), 0 0 40px rgba(178, 14, 56, 0.3), 0 0 60px rgba(255, 229, 205, 0.1);
  }
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  10% { opacity: 0.8; }
  20% { opacity: 1; }
  30% { opacity: 0.9; }
  40% { opacity: 1; }
  50% { opacity: 0.85; }
  60% { opacity: 1; }
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

/* Animation classes */
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
.animate-flicker { animation: flicker 0.5s ease-in-out; }
.animate-glitch { animation: glitch 0.3s ease-in-out; }
.animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
.animate-scroll-bounce { animation: scroll-bounce 1.5s ease-in-out infinite; }
.animate-gradient { background-size: 200% 200%; animation: gradient-shift 8s ease infinite; }
.text-glow { animation: text-glow 4s ease-in-out infinite; }
```

### Staggered Children Animation

```css
.stagger-fade-in > * {
  opacity: 0;
  animation: fade-in 0.5s ease-out forwards;
}

.stagger-fade-in > *:nth-child(1) { animation-delay: 0.1s; }
.stagger-fade-in > *:nth-child(2) { animation-delay: 0.2s; }
.stagger-fade-in > *:nth-child(3) { animation-delay: 0.3s; }
.stagger-fade-in > *:nth-child(4) { animation-delay: 0.4s; }
.stagger-fade-in > *:nth-child(5) { animation-delay: 0.5s; }
```

### Custom Animation Hooks

```typescript
// Scroll visibility detection
export function useScrollAnimation(threshold: number = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [threshold]);

  return { ref, isVisible };
}

// Mouse parallax
export function useMouseParallax() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
}
```

---

## Page Sections

### 1. Page Loader (Splash Screen)

**Duration:** 2.2 seconds

**Elements:**
- Animated grid background pattern
- Radiating circles from center (3 rings, infinite)
- Corner accent lines (SVG paths, animated pathLength)
- Diagonal speed lines (5 lines, staggered)
- Hexagonal frame behind text
- Main title "RISHIHOOD" (scale + blur entrance)
- Subtitle "SPORTS FEST" (slide up from below)
- Year indicator "2026" with decorative lines
- Bottom progress bar (gradient fill, 1.8s)

**Exit Animation:** Fade out with opacity transition

### 2. Hero Section

**Features:**
- Full viewport height (`min-h-screen`)
- Mouse-tracking 3D parallax
- Floating gradient orbs (responsive to mouse)
- SVG trophy animation (path drawing)
- Grid background pattern

**Content Structure:**
```
- Pre-title badge (glass effect, date)
- Main title (RISHIHOOD / SPORTS FEST with gradient)
- Subtitle with accent color
- CTA buttons (Register Now + Explore Sports)
- Stats grid (3 columns: Sports Events, Colleges, Athletes)
- Scroll indicator with bounce animation
- Corner accent decorations
```

### 3. Featured Sports Section

**Layout:** 2-column grid on desktop
**Card Features:**
- Gradient accent line at top
- Sport icon with gradient background
- Badge for type (Team/Individual)
- Info grid (date, venue)
- Progress bar with percentage
- "Almost Full" warning badge
- Entry fee display
- Hover glow effect (radial gradient)

### 4. How It Works Section

**Layout:** 4-column grid on desktop
**Features:**
- Connecting horizontal line between steps (animated on scroll)
- Step cards with:
  - Icon in bordered container
  - Number badge (colored background)
  - Title and description
  - Arrow indicators between steps
- Mobile: Dot indicators

**Steps:**
1. Create Account
2. Choose Sports
3. Pay Securely
4. You're In!

### 5. CTA Section

**Features:**
- Animated gradient border (moving background-position)
- Corner decorative elements
- Two-column layout:
  - Left: Content (badge, title, description, event info, buttons)
  - Right: Countdown timer (4-column grid)
- Floating particles
- Trophy decoration (rotating)

**Countdown Timer:**
- Individual cards for Days, Hours, Minutes, Seconds
- Monospace font for numbers
- Hover glow effect on each unit

### 6. Footer

**Layout:** 4-column grid
**Sections:**
1. Brand (logo, description, social icons)
2. Quick Links
3. Contact Info (with icons)
4. Newsletter (email input + subscribe button)

**Features:**
- Animated background pattern
- Social icons with hover effects (scale, rotate, shadow)
- Staggered reveal on scroll

---

## Special Effects

### 1. Glassmorphism

```css
.glass {
  background: rgba(19, 19, 21, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 229, 205, 0.1);
}

.glass-light {
  background: rgba(255, 229, 205, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 229, 205, 0.08);
}
```

### 2. Grid Background Pattern

```css
.grid-bg {
  background-image:
    linear-gradient(rgba(178, 14, 56, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(178, 14, 56, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

.dots-bg {
  background-image: radial-gradient(rgba(255, 229, 205, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
}
```

### 3. Noise Texture

```css
.noise-overlay::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.02;
  pointer-events: none;
  z-index: 1;
}
```

### 4. Card Hover Effects

```css
.card-hover {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px var(--accent-primary-dim),
    0 0 60px -15px rgba(178, 14, 56, 0.3);
}
```

### 5. Cursor-Following Gradient

```tsx
// Track mouse position in container
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

// Apply as background
style={{
  background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(178,14,56,0.1), transparent 40%)`
}}
```

### 6. Scroll Progress Indicator

```tsx
const { scrollYProgress } = useScroll();
const scaleX = useSpring(scrollYProgress, {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001,
});

<motion.div
  className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-orange-500 to-red-500 origin-left z-[9999]"
  style={{ scaleX }}
/>
```

### 7. Custom Scrollbar

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background);
}

::-webkit-scrollbar-thumb {
  background: var(--accent-primary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary-hover);
}
```

### 8. Selection Styling

```css
::selection {
  background: var(--accent-primary);
  color: var(--accent-secondary);
}
```

---

## Responsive Design

### Breakpoints (Tailwind)

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Key Responsive Patterns

```css
/* Typography */
text-[clamp(3rem,12vw,10rem)]  /* Fluid hero title */
text-5xl sm:text-6xl lg:text-7xl  /* Section headings */
text-xl md:text-2xl  /* Subtitles */

/* Layout */
flex-col sm:flex-row  /* Stack to row */
grid-cols-1 md:grid-cols-2 lg:grid-cols-4  /* Responsive grids */
hidden md:flex  /* Hide on mobile */
md:hidden  /* Hide on desktop */

/* Spacing */
px-4 sm:px-6 lg:px-8  /* Progressive padding */
gap-6 lg:gap-8  /* Progressive gaps */
p-6 lg:p-8  /* Card padding */

/* Navigation */
hidden md:flex  /* Desktop nav links */
md:hidden  /* Mobile menu button */
```

### Mobile-First Considerations

1. **Navigation:** Hamburger menu on mobile, horizontal links on desktop
2. **Hero:** Stacked layout, smaller typography
3. **Cards:** Full-width on mobile, 2-column on desktop
4. **Countdown:** Smaller font sizes, reduced padding
5. **Footer:** Single column stack on mobile

---

## Dependencies & Tech Stack

### Core Dependencies

```json
{
  "next": "^15.x",
  "react": "^19.x",
  "react-dom": "^19.x",
  "typescript": "^5.x"
}
```

### UI & Animation

```json
{
  "framer-motion": "^11.x",
  "lucide-react": "^0.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x"
}
```

### Styling

```json
{
  "tailwindcss": "^4.x",
  "postcss": "^8.x"
}
```

### Key Imports

```tsx
// Framer Motion
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useInView } from "framer-motion";

// Icons (Lucide)
import { 
  Menu, X, User, LogOut, ChevronDown, ArrowRight, 
  Trophy, Users, Flame, Star, Calendar, MapPin, 
  Clock, Sparkles, Zap, Mail, Phone, Instagram, 
  Twitter, Youtube, Search, Check, UserPlus, 
  CreditCard, CheckCircle
} from "lucide-react";

// Utils
import { cn } from "@/lib/utils";  // clsx + tailwind-merge
```

### Utility Function

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## CSS Variables Reference

### Complete Variables List

```css
:root {
  /* Backgrounds */
  --background: #0a0a0b;
  --background-secondary: #111113;
  --foreground: #ffe5cd;
  --card-bg: #131315;
  --card-bg-hover: #1a1a1d;
  --card-border: #252528;
  
  /* Primary Accent (Red) */
  --accent-primary: #b20e38;
  --accent-primary-hover: #d41145;
  --accent-primary-light: #e8456d;
  --accent-primary-dim: rgba(178, 14, 56, 0.15);
  --accent-primary-glow: rgba(178, 14, 56, 0.4);
  
  /* Secondary Accent (Cream) */
  --accent-secondary: #ffe5cd;
  --accent-secondary-hover: #fff0e1;
  --accent-secondary-dim: rgba(255, 229, 205, 0.1);
  --accent-secondary-dark: #d4b896;
  
  /* Tertiary Accent (Gold) */
  --accent-tertiary: #f59e0b;
  --accent-tertiary-hover: #d97706;
  --accent-tertiary-dim: rgba(245, 158, 11, 0.2);
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #b20e38 0%, #8b0a2c 100%);
  --gradient-secondary: linear-gradient(135deg, #ffe5cd 0%, #f5d5b5 100%);
  --gradient-accent: linear-gradient(135deg, #b20e38 0%, #ffe5cd 100%);
  --gradient-hero: linear-gradient(135deg, rgba(178, 14, 56, 0.3) 0%, rgba(255, 229, 205, 0.05) 50%, transparent 100%);
  
  /* Status */
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
  
  /* Text */
  --text-primary: #ffe5cd;
  --text-secondary: #c9b8a8;
  --text-muted: #7a7069;
  --text-inverse: #0a0a0b;
}
```

---

## Implementation Code Examples

### Navbar Implementation

```tsx
<motion.nav
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--card-border)]"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-20">
      {/* Logo */}
      <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
        <motion.div
          className="w-10 h-10 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center"
          whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
        >
          <span className="font-display text-xl text-white">R</span>
        </motion.div>
        <div className="hidden sm:block">
          <span className="font-display text-xl tracking-wide text-white">RISHIHOOD</span>
          <span className="block text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
            Sports Fest 2026
          </span>
        </div>
      </motion.div>
      
      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium uppercase tracking-wide transition-all duration-300 ${
              isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--accent-secondary)]"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      
      {/* Auth Buttons */}
      <div className="hidden md:flex items-center gap-4">
        <Button variant="ghost" size="sm">Sign In</Button>
        <Button size="sm">Register Now</Button>
      </div>
    </div>
  </div>
</motion.nav>
```

### Sport Card Implementation

```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
  <Link href={`/sports/${sport.slug}`}>
    <motion.div
      className="group relative bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden"
      whileHover={{ y: -8 }}
    >
      {/* Gradient Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${sport.gradient}`} />
      
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${sport.gradient} flex items-center justify-center text-3xl`}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {sport.icon}
            </motion.div>
            <div>
              <h3 className="font-display text-2xl text-[var(--accent-secondary)]">
                {sport.name}
              </h3>
              <p className="text-sm text-[var(--text-muted)]">{sport.description}</p>
            </div>
          </div>
          <Badge variant={sport.type === "TEAM" ? "team" : "individual"}>
            {sport.type}
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-[var(--text-muted)]">Registration Progress</span>
            <span className="text-sm font-mono font-semibold" style={{ color: sport.accentColor }}>
              {sport.filledSlots}/{sport.maxSlots}
            </span>
          </div>
          <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${sport.gradient} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between pt-4 border-t border-[var(--card-border)]">
          <div>
            <span className="text-xs text-[var(--text-muted)] uppercase">Entry Fee</span>
            <p className="font-mono text-xl font-bold text-[var(--accent-secondary)]">
              ₹{sport.fee.toLocaleString()}
            </p>
          </div>
          <motion.div
            className="flex items-center gap-2 text-[var(--accent-primary)]"
            whileHover={{ x: 5 }}
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
      
      {/* Hover Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at 50% 50%, ${sport.accentColor}10, transparent 40%)`
        }}
      />
    </motion.div>
  </Link>
</motion.div>
```

### Countdown Timer Implementation

```tsx
const [countdown, setCountdown] = useState({
  days: 0, hours: 0, minutes: 0, seconds: 0
});

useEffect(() => {
  const targetDate = new Date("2026-02-14T09:00:00");
  
  const updateCountdown = () => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    
    if (diff > 0) {
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }
  };

  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);
  return () => clearInterval(interval);
}, []);

// Render
<div className="grid grid-cols-4 gap-4">
  {[
    { value: countdown.days, label: "Days" },
    { value: countdown.hours, label: "Hours" },
    { value: countdown.minutes, label: "Minutes" },
    { value: countdown.seconds, label: "Seconds" },
  ].map((item, index) => (
    <motion.div
      key={item.label}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.1 }}
      className="relative group"
    >
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 text-center group-hover:border-[var(--accent-primary)] transition-colors">
        <motion.div
          key={item.value}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-mono text-4xl font-bold text-[var(--accent-secondary)]"
        >
          {String(item.value).padStart(2, "0")}
        </motion.div>
        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mt-1">
          {item.label}
        </div>
      </div>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-[var(--accent-primary)] rounded-xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity" />
    </motion.div>
  ))}
</div>
```

---

## Quick Reference Cheat Sheet

### Most Used Color Classes

```css
/* Backgrounds */
bg-[var(--background)]
bg-[var(--card-bg)]
bg-[var(--accent-primary)]
bg-[var(--accent-primary-dim)]

/* Text */
text-[var(--foreground)]
text-[var(--accent-secondary)]
text-[var(--accent-primary)]
text-[var(--text-secondary)]
text-[var(--text-muted)]

/* Borders */
border-[var(--card-border)]
border-[var(--accent-primary)]
```

### Most Used Motion Props

```tsx
// Entrance
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}

// Hover effects
whileHover={{ scale: 1.05, y: -5 }}
whileTap={{ scale: 0.98 }}

// Scroll-based
useScroll({ target: ref, offset: ["start end", "end start"] })
useTransform(scrollYProgress, [0, 1], [0, -100])
useInView(ref, { once: true, margin: "-100px" })

// Springs
useSpring(value, { stiffness: 100, damping: 20 })
```

### Common Component Patterns

```tsx
// Glass container
className="bg-[var(--background)]/80 backdrop-blur-xl border border-[var(--card-border)]"

// Card with hover
className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl hover:border-[var(--accent-primary)] transition-all"

// Button base
className="inline-flex items-center justify-center font-semibold uppercase tracking-wider rounded-lg transition-all"

// Input base
className="w-full bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-xl px-4 py-3 focus:border-[var(--accent-primary)]"

// Badge base
className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border"
```

---

## Final Notes

### Design Do's ✅

1. Use CSS variables for all colors
2. Apply smooth transitions (0.3s-0.5s)
3. Add hover states to all interactive elements
4. Use gradient accents sparingly for emphasis
5. Maintain consistent spacing (multiples of 4px)
6. Implement scroll-triggered animations
7. Use glassmorphism for overlays
8. Apply reduced motion preferences

### Design Don'ts ❌

1. Use pure black (#000000) - use #0a0a0b instead
2. Apply hard borders without opacity
3. Use default system fonts
4. Skip hover/focus states
5. Use inconsistent border-radius
6. Over-animate (respect user preferences)
7. Use light backgrounds

---

*This documentation covers the complete UI/UX system for replicating the Sports Fest 2026 design. All components, animations, and styles are documented with their exact implementations.*
