import { GameMode } from '../other/types';
import { AppAction, PlanesAction, ShipsConfigsAction } from './types';

export const rotateShip = (shipIndex: number): ShipsConfigsAction => ({
  type: 'RotateShip',
  payload: shipIndex,
});

export const placeShip = (
  shipIndex: number,
  position: number[],
  planesPositions: number[],
): ShipsConfigsAction => ({
  type: 'PlaceShip',
  payload: { shipIndex, position, planesPositions },
});

export const removeShip = (shipIndex: number): ShipsConfigsAction => ({
  type: 'RemoveShip',
  payload: { shipIndex },
});

export const setGameMode = (gameMode: GameMode): AppAction => ({
  type: 'ChangeGameMode',
  payload: gameMode,
});

export const setPlanes = (planes: THREE.Mesh[]): PlanesAction => ({
  type: 'SetPlanes',
  payload: planes,
});
