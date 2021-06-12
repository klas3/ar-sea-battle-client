import { DoubleSide, MeshBasicMaterial } from 'three';
import { AppAction, AppState } from '../types';
import { getEnemyDefaultPositions } from '../../other/helpers';

const defaultState: AppState = {
  mode: '3D',
  battlefield: 'friendly',
  state: 'InMainMenu',
  enemyBattlefield: getEnemyDefaultPositions(),
  selectedEnemyPosition: undefined,
  turn: 'You',
  enemyPlanes: [],
  gameCode: '',
};

const gameReducer = (state = defaultState, action: AppAction): AppState => {
  if (action.type === 'ChangeGameMode' && action.payload) {
    state.mode = action.payload;
    state.selectedEnemyPosition = undefined;
  }

  if (action.type === 'TogleBattlefield') {
    state.battlefield = state.battlefield === 'friendly' ? 'enemy' : 'friendly';
  }

  if (action.type === 'SetGameState' && action.payload) {
    state.state = action.payload;
  }

  if (action.type === 'SetSelectedEnemyPosition') {
    state.selectedEnemyPosition = action.payload;
  }

  if (action.type === 'SetEnemyBattlefield' && action.payload) {
    state.enemyBattlefield = action.payload;
  }

  if (action.type === 'Shoot' && state.selectedEnemyPosition) {
    if (state.mode === '3D') {
      state.enemyPlanes[state.selectedEnemyPosition].material = new MeshBasicMaterial({
        color: 0xffff00,
        side: DoubleSide,
      });
    }
    state.turn = state.turn === 'You' ? 'Enemy' : 'You';
    state.selectedEnemyPosition = undefined;
  }

  if (action.type === 'SetEnemyPlanes' && action.payload) {
    state.enemyPlanes = action.payload;
  }

  if (action.type === 'SetGameCode' && action.payload) {
    state.gameCode = action.payload;
  }

  return state;
};

export default gameReducer;
