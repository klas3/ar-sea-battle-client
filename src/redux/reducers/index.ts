import { combineReducers } from 'redux';
import gameReducer from './gameReducer';
import shipsReducer from './shipsReducer';

const rootReducer = combineReducers({
  ships: shipsReducer,
  game: gameReducer,
});

export default rootReducer;
