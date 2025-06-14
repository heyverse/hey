export const accountsList = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.42, 0, 0.58, 1] as const }
  }
};

export const EXPANSION_EASE = [0.075, 0.82, 0.165, 1] as const;
