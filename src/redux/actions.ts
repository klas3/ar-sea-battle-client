import { Object3D, Mesh } from 'three';
import { ARBattlefield, GameMode, Turn } from '../other/types';
import { AppAction, GameState, ShipsAction } from './types';

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

export const dropShipsState = (): ShipsAction => ({
  type: 'DropShipsState',
});

export const markMyField = (
  positionInfo: number,
  mode: GameMode,
  selectedPosition: number,
): ShipsAction => ({
  type: 'MarkMyField',
  payload: { positionInfo, mode, selectedPosition },
});

export const togleBattlefield = (): AppAction => ({
  type: 'TogleBattlefield',
});

export const setGameState = (gameState: GameState): AppAction => ({
  type: 'SetGameState',
  payload: gameState,
});

export const setEnemyBattlefield = (battlefield: number[]): AppAction => ({
  type: 'SetEnemyBattlefield',
  payload: battlefield,
});

export const setSelectedEnemyPosition = (position: number | undefined): AppAction => ({
  type: 'SetSelectedEnemyPosition',
  payload: position,
});

export const markEnemyField = (position: number, positionInfo: number): AppAction => ({
  type: 'MarkEnemyField',
  payload: { position, positionInfo },
});

export const setEnemyPlanes = (planes: Mesh[]): AppAction => ({
  type: 'SetEnemyPlanes',
  payload: planes,
});

export const setGameCode = (code: string): AppAction => ({
  type: 'SetGameCode',
  payload: code,
});

export const setIsLoading = (isLoading: boolean): AppAction => ({
  type: 'SetIsLoading',
  payload: isLoading,
});

export const setAppError = (error: string): AppAction => ({
  type: 'SetAppError',
  payload: error,
});

export const startGame = (turn: Turn): AppAction => ({
  type: 'StartGame',
  payload: turn,
});

export const setTurn = (turn: Turn): AppAction => ({
  type: 'SetTurn',
  payload: turn,
});

export const addShipwreckModel = (models: Object3D): AppAction => ({
  type: 'AddShipwreckModel',
  payload: models,
});

export const emptyShipwrecksModels = (): AppAction => ({
  type: 'EmptyShipwrecksModels',
});

export const setARBattlefield = (battlefield: ARBattlefield): AppAction => ({
  type: 'SetARBattlefield',
  payload: battlefield,
});
