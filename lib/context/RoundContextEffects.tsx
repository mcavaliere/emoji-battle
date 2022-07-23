import { useQueryClient } from 'react-query';
import * as Constants from '../constants';
import { RoundActions } from './RoundActions';
import { useEffectReducer } from '../hooks/useEffectReducer';
import { roundReducer } from './RoundContextReducer';
import { defaultRoundContext } from './RoundContext';

export const useRoundContextEffectReducer = () => {
  const queryClient = useQueryClient();

  const refreshRoundFromServer = () => {
    queryClient.refetchQueries([Constants.QUERY_CACHE_KEYS.CURRENT_ROUND]);
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
