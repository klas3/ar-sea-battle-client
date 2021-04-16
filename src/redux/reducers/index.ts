import { combineReducers } from 'redux';
import shipsConfigsReducer from './shipsConfigsReducer';

const rootReducer = combineReducers({ shipsConfigs: shipsConfigsReducer });

export default rootReducer;
