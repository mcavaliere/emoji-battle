import React from 'react';
import { Box } from '@chakra-ui/react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Vote } from '@prisma/client';
import { EmojiFromListResponsePayload } from '../lib/types/EmojiListResponsePayload';
import { EmojiContainer } from '../components/EmojiContainer/EmojiContainer';

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

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Emoji Battle/EmojiContainer',
  component: EmojiContainer,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    emoji,
  },
} as ComponentMeta<typeof EmojiContainer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EmojiContainer> = (args) => (
  <Box width={200} height={200}>
    <EmojiContainer {...args} />
  </Box>
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = { emoji };
