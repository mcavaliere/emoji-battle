import { EmojisActions } from './EmojisActions';

export function emojisReducer(state, action, exec) {
  console.log(`ACTION: ${action.type}`, action);
  switch (action.type) {
    case EmojisActions.HYDRATE:
      return {
        ...state,
        emojis: action.emojis,
      };

    case EmojisActions.RECORD_EMOJI_SIZE:
      return {
        ...state,
      };

    case EmojisActions.EMOJI_CLICKED: {
      const { emoji, user, round } = action;
      exec({
        type: 'emojiClickedEffects',
        emoji,
        user,
        round,
      });
      exec({ type: 'playEmojiClickSound' });

      return {
        ...state,
      };
    }

    case EmojisActions.NEW_VOTE: {
      const { emoji, user, round } = action;
      const newEmojis = [...state.emojis];

      // Find the emoji in the list, if it's there.
      const targetIndex = newEmojis.findIndex((e) => e.native === emoji.native);

      // If the emoji is not in the list, add it. Otherwise update its count, and re-sort by count.
      if (targetIndex === -1) {
        newEmojis.push({ ...emoji, voteCount: 1 });
      } else {
        newEmojis[targetIndex].voteCount += 1;
        newEmojis.sort((a, b) => b.voteCount - a.voteCount);
      }

      exec({ type: 'newVoteEffects', existingEmojis: state.emojis, newEmojis });

      return {
        ...state,
        emojis: newEmojis,
      };
    }

    default:
      return state;
  }
}
