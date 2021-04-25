import { combineReducers } from 'redux';
import appReducer from './appReducer';
import planesReducer from './planesReducer';
import shipsConfigsReducer from './shipsConfigsReducer';

const rootReducer = combineReducers({
  shipsConfigs: shipsConfigsReducer,
  app: appReducer,
  planes: planesReducer,
});

export default rootReducer;
