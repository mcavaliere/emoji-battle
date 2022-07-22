import * as Constants from '../../lib/websocketConstants';
import { useWebsocketEvent } from '../hooks/useWebsocketChannel';
import { RoundActions } from './RoundActions';

export const useRoundContextWebsocketEvents = (dispatch) => {
  // When the server sends TICK, dispatch a STEP to the reducer.
  useWebsocketEvent(
    Constants.CHANNELS.TIMER,
    Constants.EVENTS.TICK,
    (message) => {
      dispatch({ type: RoundActions.STEP, currentStep: message.data.number });
    }
  );

  // Dispatched by the node server when timer starts.
  useWebsocketEvent(
    Constants.CHANNELS.TIMER,
    Constants.EVENTS.ROUND_STARTED,
    (message) => {
      dispatch({ type: RoundActions.REFRESH_ROUND_FROM_SERVER });
    }
  );

  useWebsocketEvent(
    Constants.CHANNELS.TIMER,
    Constants.EVENTS.ROUND_ENDED,
    (message) => {
      dispatch({ type: RoundActions.END });
    }
  );
};
