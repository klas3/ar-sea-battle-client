import { Object3D, Mesh } from 'three';
import { GameMode } from '../other/types';
import { AppAction, AudioAction, GameState, ShipsAction } from './types';

export const rotateShip = (shipIndex: number): ShipsAction => ({
  type: 'RotateShip',
  payload: { shipIndex },
});

export const placeShip = (
  shipIndex: number,
  position: number[],
  planesPositions: number[],
): ShipsAction => ({
  type: 'PlaceShip',
  payload: { shipIndex, position, planesPositions },
});

export const removeShip = (shipIndex: number): ShipsAction => ({
  type: 'RemoveShip',
  payload: { shipIndex },
});

export const setGameMode = (gameMode: GameMode): AppAction => ({
  type: 'ChangeGameMode',
  payload: gameMode,
});

export const setPlanes = (planes: Mesh[]): ShipsAction => ({
  type: 'SetPlanes',
  payload: planes,
});

export const emptyShipsModels = (): ShipsAction => ({
  type: 'EmptyShipsModels',
});

export const setShipsModels = (models3D: Object3D[]): ShipsAction => ({
  type: 'SetShipsModels',
  payload: models3D,
});

export const emptyPositions = (positions: number[]): ShipsAction => ({
  type: 'EmptyPositions',
  payload: positions,
});

export const arrangeRandomly = (): ShipsAction => ({
  type: 'ArrangeRandomly',
});

export const setAdditions = (
  friendlyAdditionalX: number,
  friendlyAdditionalZ: number,
): ShipsAction => ({
  type: 'SetAdditions',
  payload: { friendlyAdditionalX, friendlyAdditionalZ },
});

export const setAudio = (path: string, maxDistance: number): AudioAction => ({
  type: 'SetAudio',
  payload: { path, maxDistance },
});

export const enableAudio = (): AudioAction => ({
  type: 'EnableAudio',
});

export const togleBattlefield = (): AppAction => ({
  type: 'TogleBattlefield',
});

export const setGameState = (gameState: GameState): AppAction => ({
  type: 'SetGameState',
  payload: gameState,
});
