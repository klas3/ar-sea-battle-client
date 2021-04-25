import { AppAction, AppState } from '../types';

const defaultState: AppState = {
  mode: '3D',
};

const appReducer = (state = defaultState, action: AppAction) => {
  if (action.type === 'ChangeGameMode' && action.payload) {
    state.mode = action.payload;
  }
  return state;
};

export default appReducer;
