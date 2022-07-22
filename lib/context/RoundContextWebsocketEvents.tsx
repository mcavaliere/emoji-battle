import * as Constants from '../../lib/websocketConstants';
import { useWebsocketChannel } from '../hooks/useWebsocketChannel';
import { RoundActions } from './RoundActions';

export const useRoundContextWebsocketEvents = (dispatch) => {
  const timerChannelMessageCallback = (message) => {
    // When the server sends TICK, dispatch a STEP to the reducer.
    if (message.name === Constants.EVENTS.TICK) {
      dispatch({ type: RoundActions.STEP, currentStep: message.data.number });
      return;
    }

    // Dispatched by the node server when timer starts.
    if (message.name === Constants.EVENTS.ROUND_STARTED) {
      dispatch({ type: RoundActions.REFRESH_ROUND_FROM_SERVER });
      return;
    }

    // Dispatched by node server when timer completes.
    if (message.name === Constants.EVENTS.ROUND_ENDED) {
      dispatch({ type: RoundActions.END });
      return;
    }
  };
  useWebsocketChannel(Constants.CHANNELS.TIMER, timerChannelMessageCallback);
};
