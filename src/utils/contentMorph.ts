import { Variants } from 'motion/react';

export const contentMorphVariants: Variants = {
  initial: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 24 : -24,
    scale: 0.98,
    filter: 'blur(4px)',
  }),
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction < 0 ? 24 : -24,
    scale: 0.98,
    filter: 'blur(4px)',
    transition: {
      duration: 0.25,
      ease: [0.7, 0, 0.84, 0],
    },
  }),
};

export const tabIndicatorVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.8 },
};

export const getLessonModeIcon = (mode: string) => {
  switch (mode) {
    case 'text':
      return 'BookOpen';
    case 'video':
      return 'PlayCircle';
    case 'map':
      return 'Map';
    case 'timeline':
      return 'GitCommit';
    default:
      return 'FileText';
  }
};
