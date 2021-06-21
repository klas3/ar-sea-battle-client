import { AppAction, AppState } from '../types';
import {
  findAllIndexes,
  getBattlefieldDefaultPositions,
  getSegmentMidpoint,
} from '../../other/helpers';
import {
  crossMaterial,
  crossTextureFilePath,
  dotTextureFilePath,
  emptyPositiondMaterial,
  enemyBattlefieldAdditionalX,
} from '../../other/battleMapConfigs';
import { cordovaPathname, enemyArPlaneIdName } from '../../other/constants';
import getDefaultShipsConfigs, { getShipSizeByIndex } from '../../other/shipsConfigs';
import gridCreator from '../../other/gridHelper';

const hasGameCode = !window.location.pathname.replace(cordovaPathname, '').replace('/', '');

const getDefaultState = (): AppState => ({
  mode: '3D',
  selectedARBattlefield: 'friendly',
  state: hasGameCode ? 'InMainMenu' : 'JoiningRoom',
  enemyBattlefield: getBattlefieldDefaultPositions(),
  selectedEnemyPosition: undefined,
  turn: 'You',
  enemyPlanes: [],
  gameCode: window.location.pathname.replace(cordovaPathname, '').replace('/', ''),
  isLoading: false,
  shipwrecksConfigs: [],
  shipwrecksModels: [],
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
    const { positionInfo, position } = action.payload;
    state.enemyBattlefield[position] = positionInfo;
    const shipPositions = findAllIndexes(state.enemyBattlefield, positionInfo);
    if (positionInfo !== -1 && shipPositions.length === getShipSizeByIndex(positionInfo)) {
      const config = getDefaultShipsConfigs()[positionInfo];
      const planes = gridCreator.createPlanes(undefined, enemyBattlefieldAdditionalX);
      const markedPlanes = shipPositions.map((position) => planes[position]);
      const lastPlaneIndex = markedPlanes.length - 1;
      const firstMarkedPlane = markedPlanes[0];
      const lastMarkedPlane = markedPlanes[lastPlaneIndex];
      const { x: firstX, z: firstZ } = firstMarkedPlane.position;
      const { x: lastX, z: lastZ } = lastMarkedPlane.position;
      config.position[0] = getSegmentMidpoint(firstX, lastX);
      config.position[2] = getSegmentMidpoint(firstZ, lastZ);
      config.rotation =
        lastMarkedPlane.userData.index - firstMarkedPlane.userData.index < 10 ? 0 : 90;
      config.isShipwreck = true;
      state.shipwrecksConfigs.push(config);
    }
    if (state.mode === '3D') {
      state.enemyPlanes[position].material =
        positionInfo === -1 ? emptyPositiondMaterial : crossMaterial;
    } else {
      const arPlane = document.getElementById(`${enemyArPlaneIdName}${position}`);
      if (arPlane) {
        const planeTexture = positionInfo === -1 ? dotTextureFilePath : crossTextureFilePath;
        arPlane.setAttribute('src', planeTexture);
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

  if (action.type === 'AddShipwreckModel') {
    state.shipwrecksModels.push(action.payload);
  }

  if (action.type === 'EmptyShipwrecksModels') {
    state.shipwrecksModels = [];
  }

  if (action.type === 'SetARBattlefield') {
    state.selectedARBattlefield = action.payload;
  }

  return state;
};

export default gameReducer;
