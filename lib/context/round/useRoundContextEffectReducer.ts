import { useQueryClient } from '@tanstack/react-query';
import * as Constants from '../../constants';
import { RoundActions } from './RoundActions';
import { useEffectReducer } from '../../hooks/useEffectReducer';
import { roundReducer } from './RoundReducer';
import { defaultRoundContext } from './RoundContext';

export const useRoundContextEffectReducer = () => {
  const queryClient = useQueryClient();

  const refreshRoundFromServer = () => {
    queryClient.refetchQueries([Constants.QUERY_CACHE_KEYS.CURRENT_ROUND]);
    // TODO: publish to websocket
  };

  function triggerSummaryModal(_, _effect, dispatch) {
    dispatch({
      type: RoundActions.SHOW_ROUND_SUMMARY,
    });
  }

  const effectMap = {
    triggerSummaryModal,
    refreshRoundFromServer,
  };

  return useEffectReducer(roundReducer, defaultRoundContext, effectMap);
};
