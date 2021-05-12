import { AppAction, AppState } from '../types';

const defaultState: AppState = {
  mode: '3D',
  battlefield: 'friendly',
};

const gameReducer = (state = defaultState, action: AppAction) => {
  if (action.type === 'ChangeGameMode' && action.payload) {
    state.mode = action.payload;
  }
  if (action.type === 'TogleBattlefield') {
    state.battlefield = state.battlefield === 'friendly' ? 'enemy' : 'friendly';
  }
  return state;
};

export default gameReducer;
