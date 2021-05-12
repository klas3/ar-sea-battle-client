import { combineReducers } from 'redux';
import gameReducer from './gameReducer';
import audioReducer from './audioReducer';
import shipsReducer from './shipsReducer';

const rootReducer = combineReducers({
  ships: shipsReducer,
  game: gameReducer,
  audio: audioReducer,
});

export default rootReducer;
