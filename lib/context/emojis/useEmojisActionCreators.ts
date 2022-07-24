import { EmojiFromListResponsePayload } from '../../types/EmojiListResponsePayload';
import { BaseEmoji } from 'emoji-mart';
import { Round } from '@prisma/client';
import { SessionUserType } from '../../types/SessionType';
import { EmojisActions } from './EmojisActions';

/**
 * Expose all action creators for the Emojis context.
 * @param dispatch
 * @returns
 */
export const useEmojisActionCreators = (dispatch) => {
  /**
   * Record the size (aka, # votes) anytime a vote happens. This is used to calculate the size of a row.
   * @param size {Number}
   */
  const recordEmojiSize = (size: number) => {
    dispatch({ type: EmojisActions.RECORD_EMOJI_SIZE, size });
  };

  /**
   * Notify the context reducer that an emoji has been clicked, to fire side effects.
   * @param emoji
   * @param user
   * @param round
   */
  const emojiClicked = (
    emoji: BaseEmoji,
    user: Partial<SessionUserType>,
    round: Round
  ) => {
    dispatch({ type: EmojisActions.EMOJI_CLICKED, emoji, user, round });
  };

  const hydrateEmojis = (emojis: EmojiFromListResponsePayload[]) => {
    dispatch({ type: EmojisActions.HYDRATE, emojis });
  };

  const newVote = (emoji, user, round) => {
    dispatch({
      type: EmojisActions.NEW_VOTE,
      emoji,
      user,
      round,
    });
  };

  return {
    newVote,
    recordEmojiSize,
    emojiClicked,
    hydrateEmojis,
  };
};
