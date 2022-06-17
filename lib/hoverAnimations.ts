export type HoverAnimationConfig = {
  start: [Record<string, any>, Record<string, any>];
  cursor: string;
};

export const hoverAnimations: HoverAnimationConfig[] = [
  {
    start: [
      {
        y: [20, -20, 0],
      },
      {
        repeatType: 'reverse',
        repeat: Infinity,
      },
    ],
    cursor: 'crosshair',
  },
  {
    start: [
      {
        x: [20, -20, 0],
        y: [-20, 20, 20, -20, 0],
      },
      {
        repeatType: 'reverse',
        repeat: Infinity,
      },
    ],
    cursor: 'grab',
  },
  {
    start: [
      {
        duration: 0.5,
        rotate: '360deg',
      },
      {
        repeat: Infinity,
        duration: 0.5,
      },
    ],
    cursor: 'pointer',
  },
  {
    start: [
      {
        x: [-10, 10, 10, -10, -10],
        y: [-10, -10, 10, 10, -10],
      },
      {
        repeat: Infinity,
        duration: 0.25,
      },
    ],
    cursor: 'crosshair',
  },
  {
    start: [
      {
        skew: ['10deg', '-10deg', '10deg'],
        x: [-10, 10, 10, -10, -10],
        y: [-10, 10, -10, -10, -10],
      },
      {
        repeat: Infinity,
        duration: 0.25,
      },
    ],
    cursor: 'pointer',
  },
  {
    start: [
      {
        filter: [
          'hue-rotate(0) blur(0px)',
          'hue-rotate(360deg) blur(10px)',
          'hue-rotate(45deg)  blur(0px)',
          'hue-rotate(0)  blur(0px)',
        ],
        duration: 1,
      },
      {
        repeat: Infinity,
        duration: 1,
      },
    ],
    cursor: 'pointer',
  },
];

export const getRandomHoverAnimationConfig = () =>
  hoverAnimations[Math.floor(Math.random() * hoverAnimations.length)];
