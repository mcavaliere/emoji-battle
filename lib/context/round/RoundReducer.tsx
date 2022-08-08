import { RoundContextType, defaultRoundContext } from './RoundContext';
import { RoundActions } from './RoundActions';

export function roundReducer(
  state: RoundContextType = defaultRoundContext,
  action,
  exec
) {
  // console.log(`ACTION: ${action.type}`);
  switch (action.type) {
    case RoundActions.START:
      exec({ type: 'refreshRoundFromServer' });

      return {
        ...state,
        round: action.round,
        inProgress: true,
      };

    case RoundActions.HYDRATE:
      return {
        ...state,
        round: action.round,
        inProgress: action.inProgress,
      };

    case RoundActions.END:
      exec({ type: 'refreshRoundFromServer' });
      exec({ type: 'triggerSummaryModal' });

      const previousRound = state.round;
      return {
        ...state,
        previousRound,
        round: undefined,
        inProgress: false,
      };

    case RoundActions.STEP:
      return {
        ...state,
        currentStep: action.currentStep,
      };

    case RoundActions.SHOW_ROUND_SUMMARY:
      return {
        ...state,
        roundSummaryVisible: true,
      };

    case RoundActions.HIDE_ROUND_SUMMARY:
      return {
        ...state,
        roundSummaryVisible: false,
      };

    case RoundActions.REFRESH_ROUND_FROM_SERVER:
      exec({ type: 'refreshRoundFromServer' });
      return { ...state };

    case RoundActions.RESET:
      return defaultRoundContext;

    default:
      return state;
  }
}
