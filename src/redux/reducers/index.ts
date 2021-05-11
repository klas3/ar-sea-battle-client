import { combineReducers } from 'redux';
import appReducer from './appReducer';
import audioReducer from './audioReducer';
import shipsReducer from './shipsReducer';

const rootReducer = combineReducers({
  ships: shipsReducer,
  app: appReducer,
  audio: audioReducer,
});

export default rootReducer;
