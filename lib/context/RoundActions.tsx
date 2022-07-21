import { Round } from '@prisma/client';
import { start as startRound } from '../api/rounds';

export enum RoundActions {
  START = 'START',
  END = 'END',
  RESET = 'RESET',
  STEP = 'STEP',
  HYDRATE = 'HYDRATE',
  SHOW_ROUND_SUMMARY = 'SHOW_ROUND_SUMMARY',
  HIDE_ROUND_SUMMARY = 'HIDE_ROUND_SUMMARY',
  REFRESH_ROUND_FROM_SERVER = 'REFRESH_ROUND_FROM_SERVER',
}

export const useRoundActionCreators = (state, dispatch) => {
  //
  // Action creators.
  //
  const start = async () => {
    if (state!.inProgress) {
      return;
    }
    dispatch({ type: RoundActions.RESET });
    const round = await startRound();
    dispatch({ type: RoundActions.START, round });
  };

  const end = () => {
    dispatch({ type: RoundActions.END });
  };

  const hydrateRound = (round: Round) => {
    dispatch({ type: RoundActions.HYDRATE, round, inProgress: true });
  };

  const reset = () => {
    dispatch({ type: RoundActions.RESET });
  };

  const showRoundSummary = () => {
    dispatch({ type: RoundActions.SHOW_ROUND_SUMMARY });
  };

  const hideRoundSummary = () => {
    dispatch({ type: RoundActions.HIDE_ROUND_SUMMARY });
  };

  return {
    start,
    end,
    hydrateRound,
    reset,
    showRoundSummary,
    hideRoundSummary,
  };
};
