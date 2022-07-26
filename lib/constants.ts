export const CHANNELS = {
  ['VOTE']: 'VOTE',
  ['LEADERBOARD']: 'LEADERBOARD',
  ['PLAYERS']: 'PLAYERS',
  ['TIMER']: 'TIMER',
  ['EMOJI_BOXES']: 'EMOJI_BOXES',
};

export const EVENTS = {
  ['NEW_LEADER']: 'NEW_LEADER',
  ['EMOJI_CLICKED']: 'EMOJI_CLICKED',
  ['EMOJI_SELECTION_RECORDED']: 'EMOJI_SELECTION_RECORDED',
  ['EMOJI_LIST_HYDRATE']: 'EMOJI_LIST_HYDRATE',
  ['NEW_VOTE']: 'NEW_VOTE',
  ['PLAYER_JOINED']: 'PLAYER_JOINED',
  ['TICK']: 'TICK',
  ['ROUND_STARTED']: 'ROUND_STARTED',
  ['ROUND_ENDED']: 'ROUND_ENDED',
};

export const ROUNDS = {
  DURATION: 15,
};

export enum QUERY_CACHE_KEYS {
  CURRENT_ROUND = 'current-round',
}