import { Mesh } from 'three';
import { GameMode, Turn } from '../other/types';

export type ShipsActionType =
  | 'RotateShip'
  | 'PlaceShip'
  | 'RemoveShip'
  | 'EmptyShipsModels'
  | 'SetShipsModels'
  | 'EmptyPositions'
  | 'ArrangeRandomly'
  | 'SetPlanes'
  | 'SetAdditions'
  | 'SetControls'
  | 'DropShipsState'
  | 'MarkMyField';

export type AppActionType =
  | 'ChangeGameMode'
  | 'TogleBattlefield'
  | 'SetGameState'
  | 'SetEnemyBattlefield'
  | 'SetSelectedEnemyPosition'
  | 'MarkEnemyField'
  | 'SetEnemyPlanes'
  | 'SetGameCode'
  | 'SetIsLoading'
  | 'SetAppError'
  | 'StartGame'
  | 'SetTurn';

export type GameState =
  | 'InMainMenu'
  | 'CreatingRoom'
  | 'JoiningRoom'
  | 'Arranging'
  | 'ConfirmedArranging'
  | 'InGame'
  | 'WinnerScreen'
  | 'LooserScreen';

export interface ShipsAction {
  type: ShipsActionType;
  payload?: any;
}

export interface AppState {
  mode: GameMode;
  selectedARBattlefield: 'friendly' | 'enemy';
  state: GameState;
  enemyBattlefield: number[];
  selectedEnemyPosition: number | undefined;
  turn: Turn;
  enemyPlanes: Mesh[];
  gameCode: string;
  isLoading: boolean;
  appError: string;
}

export interface AppAction {
  type: AppActionType;
  payload?: any;
}
