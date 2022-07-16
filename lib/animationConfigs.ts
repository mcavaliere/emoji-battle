export type AnimationConfig = {
  start: [Record<string, any>, Record<string, any>];
  cursor: string;
  name: string;
};

export const animationConfigs: AnimationConfig[] = [
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
    cursor: 'auto',
    name: 'one',
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
    cursor: 'auto',
    name: 'two',
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
    cursor: 'auto',
    name: 'three',
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
    cursor: 'auto',
    name: 'four',
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
    cursor: 'auto',
    name: 'five',
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
        scale: [2, 1],
        // x: [-10, 10, 10, -10, -10],
        duration: 4,
      },
      {
        repeat: 1,
      },
    ],
    cursor: 'auto',
    name: 'color-and-blur',
  },
  {
    start: [
      {
        backgroundColor: ['red', 'white'],
      },
      { duration: 2, repeat: 5 },
    ],
    cursor: 'auto',
    name: 'highlight-bg',
  },
];

export const animationConfigMap = animationConfigs.reduce((acc, config) => {
  acc[config.name] = config;
  return acc;
}, {});

export const getRandomAnimationConfig = () =>
  animationConfigs[Math.floor(Math.random() * animationConfigs.length)];
