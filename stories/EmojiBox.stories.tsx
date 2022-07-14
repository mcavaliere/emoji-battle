import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Story, ComponentMeta } from '@storybook/react';
import { Vote } from '@prisma/client';
import { EmojiFromListResponsePayload } from '../lib/types/EmojiListResponsePayload';
import { EmojiBox } from '../components/EmojiBox/EmojiBox';
import { animationConfigs } from '../lib/animationConfigs';

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
    votes: 8,
  },
  votes: [vote],
};

const animationIndices = new Array(animationConfigs.length)
  .fill(1)
  .map((x, i) => i);

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Emoji Battle/EmojiBox',
  component: EmojiBox,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    animationIndex: {
      options: animationIndices,
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof EmojiBox>;

type TemplateType = Story<typeof EmojiBox & { animationIndex: number }>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: TemplateType = ({ animationIndex, ...rest }) => {
  const animationConfig = animationConfigs[animationIndex] || 0;

  return (
    <Flex
      height={200}
      width="100%"
      direction="row"
      align="center"
      justify="center"
    >
      <EmojiBox emoji={emoji} animationConfig={animationConfig} />
    </Flex>
  );
};

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
// @ts-ignore
Primary.args = { emoji, animationConfig: animationConfigs[0] };
