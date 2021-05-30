import { AppAction, AppState } from '../types';

const defaultState: AppState = {
  mode: '3D',
  battlefield: 'friendly',
  state: 'InMainMenu',
  cameraLook: [3, 5, 5],
};

const gameReducer = (state = defaultState, action: AppAction) => {
  if (action.type === 'ChangeGameMode' && action.payload) {
    state.mode = action.payload;
  }

  if (action.type === 'TogleBattlefield') {
    state.battlefield = state.battlefield === 'friendly' ? 'enemy' : 'friendly';
  }

  if (action.type === 'SetGameState' && action.payload) {
    state.state = action.payload;
  }

  return state;
};

export default gameReducer;
