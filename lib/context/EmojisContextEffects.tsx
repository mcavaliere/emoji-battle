import * as Constants from '../constants';
import { create as recordVote } from '../../lib/api/votes';
import { defaultEmojisContext } from './EmojisContext';
import { emojisReducer } from './EmojisContextReducer';
import { useEffectReducer } from '../hooks/useEffectReducer';
import { useWebsocketChannels } from '../hooks/useWebsocketChannels';

export const useEmojisContextReducer = () => {
  const { emojiBoxChannel, voteChannel } = useWebsocketChannels();

  const newVoteEffects = (_, effect) => {
    const { existingEmojis, newEmojis } = effect;
    // Let the boxes know when a new emoji has taken the lead.
    if (
      newEmojis.length &&
      existingEmojis.length &&
      newEmojis[0].id !== existingEmojis[0].id
    ) {
      emojiBoxChannel.publish(Constants.EVENTS.NEW_LEADER, {
        emoji: newEmojis[0],
      });
    }
  };

  const emojiClickedEffects = (_, effect) => {
    const { emoji, user, round } = effect;

    // Send the update to all players instantly.
    voteChannel.publish(Constants.EVENTS.NEW_VOTE, {
      emoji,
      user,
      round,
    });

    // Record the vote in the database.
    recordVote(round?.id, emoji);
  };

  const effectMap = {
    emojiClickedEffects,
    newVoteEffects,
  };

  return useEffectReducer(emojisReducer, defaultEmojisContext, effectMap);
};
