import { Round } from '@prisma/client';
import { RoundActions } from './RoundActions';
import { start as startRound } from '../../api/rounds';

export const useRoundActionCreators = (state, dispatch) => {
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
