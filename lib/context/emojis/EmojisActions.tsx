import { BaseEmoji } from 'emoji-mart';
import { Round } from '@prisma/client';
import { EmojiFromListResponsePayload } from '../../types/EmojiListResponsePayload';
import { SessionUserType } from '../../types/SessionType';

export enum EmojisActions {
  HYDRATE = 'HYDRATE',
  RECORD_EMOJI_SIZE = 'RECORD_EMOJI_SIZE',
  EMOJI_CLICKED = 'EMOJI_CLICKED',
  NEW_VOTE = 'NEW_VOTE',
}

export const useEmojisActionCreators = (dispatch) => {
  /**
   * Record the size (aka, # votes) anytime a vote happens. This is used to calculate the size of a row.
   * @param size {Number}
   */
  const recordEmojiSize = (size: number) => {
    dispatch({ type: EmojisActions.RECORD_EMOJI_SIZE, size });
  };

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
