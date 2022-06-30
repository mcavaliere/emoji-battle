import React from 'react';
import { Box } from '@chakra-ui/react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Vote } from '@prisma/client';
import { EmojiFromListResponsePayload } from '../lib/types/EmojiListResponsePayload';
import { EmojiBox } from '../components/EmojiBox/EmojiBox';
import { hoverAnimations } from '../lib/hoverAnimations';

const vote: Vote = {
  id: 1,
  userId: 1,
  emojiId: 1,
  roundId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const emoji: EmojiFromListResponsePayload = {
  id: 1,
  native: '😅',
  name: 'Smiling Face with Open Mouth and Cold Sweat',
  _count: {
    votes: 3,
  },
  votes: [vote],
};

const animationIndices = new Array(hoverAnimations.length)
  .fill(1)
  .map((x, i) => i);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Emoji Battle/EmojiBox',
  component: EmojiBox,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    animationIndex: {
      control: { type: 'select' },
      options: animationIndices,
    },
  },
} as ComponentMeta<typeof EmojiBox>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EmojiBox> = ({ animationIndex }) => {
  const hoverAnimationConfig = hoverAnimations[animationIndex] || 0;

  return (
    <Box width={200} height={200}>
      <EmojiBox emoji={emoji} hoverAnimationConfig={hoverAnimationConfig} />
    </Box>
  );
};

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = { emoji, hoverAnimationConfig: hoverAnimations[0] };
