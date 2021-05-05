import { combineReducers } from 'redux';
import appReducer from './appReducer';
import shipsReducer from './shipsReducer';

const rootReducer = combineReducers({
  ships: shipsReducer,
  app: appReducer,
});

export default rootReducer;
