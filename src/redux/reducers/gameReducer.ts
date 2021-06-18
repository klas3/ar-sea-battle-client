import { AppAction, AppState } from '../types';
import { getEnemyDefaultPositions } from '../../other/helpers';
import {
  crossMaterial,
  crossTextureFilePath,
  emptyPositionColor,
  emptyPositiondMaterial,
} from '../../other/battleMapConfigs';

const hasGameCode = !window.location.pathname.replace('/', '');

const getDefaultState = (): AppState => ({
  mode: '3D',
  selectedARBattlefield: 'friendly',
  state: hasGameCode ? 'InMainMenu' : 'JoiningRoom',
  enemyBattlefield: getEnemyDefaultPositions(),
  selectedEnemyPosition: undefined,
  turn: 'You',
  enemyPlanes: [],
  gameCode: window.location.pathname.replace('/', ''),
  isLoading: false,
  appError: '',
});

const defaultState = getDefaultState();

const gameReducer = (state = defaultState, action: AppAction): AppState => {
  if (action.type === 'ChangeGameMode' && action.payload) {
    state.mode = action.payload;
    state.selectedEnemyPosition = undefined;
  }

  if (action.type === 'TogleBattlefield') {
    state.selectedARBattlefield = state.selectedARBattlefield === 'friendly' ? 'enemy' : 'friendly';
  }

  if (action.type === 'SetGameState' && action.payload) {
    if (action.payload === 'WinnerScreen' || action.payload === 'LooserScreen') {
      state = getDefaultState();
    }
    state.state = action.payload;
  }

  if (action.type === 'SetSelectedEnemyPosition') {
    state.selectedEnemyPosition = action.payload;
  }

  if (action.type === 'SetEnemyBattlefield' && action.payload) {
    state.enemyBattlefield = action.payload;
  }

  if (action.type === 'MarkEnemyField' && state.selectedEnemyPosition !== undefined) {
    if (state.mode === '3D') {
      state.enemyPlanes[state.selectedEnemyPosition].material =
        action.payload === -1 ? emptyPositiondMaterial : crossMaterial;
    } else {
      const arPlane = document.getElementById(`arPlane${state.selectedEnemyPosition}`);
      if (!arPlane) {
        return state;
      }
      if (action.payload === -1) {
        arPlane.setAttribute('material', emptyPositionColor);
      } else {
        arPlane.setAttribute('src', crossTextureFilePath);
      }
    }
    state.selectedEnemyPosition = undefined;
  }

  if (action.type === 'SetEnemyPlanes' && action.payload) {
    state.enemyPlanes = action.payload;
  }

  if (action.type === 'SetGameCode') {
    state.gameCode = action.payload;
  }

  if (action.type === 'SetIsLoading') {
    state.isLoading = action.payload;
  }

  if (action.type === 'SetAppError') {
    state.appError = action.payload;
  }

  if (action.type === 'StartGame') {
    state.state = 'InGame';
    state.turn = action.payload;
  }

  if (action.type === 'SetTurn') {
    state.turn = action.payload;
  }

  return state;
};

export default gameReducer;
