import type { Transition } from "framer-motion"

/**
 * Default motion transition configuration
 * Matches the CSS transition: transform 0.125s ease-out, opacity 0.125s ease-out
 */
export const defaultTransition: Transition = {
  duration: 0.125,
  ease: "easeOut",
}

/**
 * Common transition presets for different use cases
 */
export const transitionPresets = {
  /** Quick transitions for hover effects and small UI changes */
  quick: {
    duration: 0.125,
    ease: "easeOut",
  },
  /** Normal transitions for standard animations */
  normal: {
    duration: 0.2,
    ease: "easeOut",
  },
  /** Slow transitions for page transitions and large movements */
  slow: {
    duration: 0.3,
    ease: "easeOut",
  },
  /** Spring physics for bouncy interactions */
  spring: {
    type: "spring" as const,
    stiffness: 300,
    damping: 25,
  },
  /** Smooth spring for gentle movements */
  smoothSpring: {
    type: "spring" as const,
    stiffness: 200,
    damping: 30,
  },
} as const

/**
 * Common animation variants for consistent motion patterns
 */
export const animationVariants = {
  /** Fade in/out animation */
  fade: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    },
  },
  /** Slide from left */
  slideLeft: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  },
  /** Slide from right */
  slideRight: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
  },
  /** Scale animation */
  scale: {
    initial: { scale: 0.97, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.97, opacity: 0 },
  },
} as const

/**
 * Collapse/expand animation variants
 * Used for collapsible components, dropdowns, tooltips, etc.
 */
export const collapseVariants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.2, ease: "easeOut" },
      opacity: { duration: 0.175, ease: "easeOut" },
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.2, ease: "easeOut" },
      opacity: { duration: 0.175, ease: "easeOut" },
    },
  },
} as const

/**
 * Popover/dropdown animation variants with scale
 * Used for dropdowns, popovers, context menus, etc.
 */
export const popoverVariants = {
  open: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  closed: {
    scale: 0.93,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
} as const

/**
 * Dialog/modal animation variants with scale
 * Used for dialogs, modals, and larger overlays
 */
export const dialogVariants = {
  open: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  closed: {
    scale: 0.95,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
} as const

/**
 * Slide navigation variants for page transitions
 * Used for multi-step forms and navigation flows
 */
export const slideNavigationVariants = {
  /** Entering from right (moving forward) */
  enterFromRight: { x: 300, opacity: 0 },
  /** Entering from left (moving backward) */
  enterFromLeft: { x: -300, opacity: 0 },
  /** Center position (active state) */
  center: { x: 0, opacity: 1 },
  /** Exiting to left (moving forward) */
  exitToLeft: { x: -300, opacity: 0 },
  /** Exiting to right (moving backward) */
  exitToRight: { x: 300, opacity: 0 },
} as const

/**
 * Slide navigation variants without fade (opacity locked to 1)
 * Used for intra-auth route transitions to avoid double-fade effects
 */
export const slideNavigationVariantsNoFade = {
  enterFromRight: { x: 300, opacity: 1 },
  enterFromLeft: { x: -300, opacity: 1 },
  center: { x: 0, opacity: 1 },
  exitToLeft: { x: -300, opacity: 1 },
  exitToRight: { x: 300, opacity: 1 },
} as const

