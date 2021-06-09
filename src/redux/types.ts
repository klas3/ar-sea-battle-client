import { Mesh } from 'three';
import { GameMode } from '../other/types';

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
  | 'SetControls';

export type AppActionType =
  | 'ChangeGameMode'
  | 'TogleBattlefield'
  | 'SetGameState'
  | 'SetEnemyBattlefield'
  | 'SetSelectedEnemyPosition'
  | 'Shoot'
  | 'SetEnemyPlanes';

export type GameState = 'InMainMenu' | 'CreatingRoom' | 'JoiningRoom' | 'Arranging' | 'InGame';

export interface ShipsAction {
  type: ShipsActionType;
  payload?: any;
}

export interface AppState {
  mode: GameMode;
  battlefield: 'friendly' | 'enemy';
  state: GameState;
  enemyBattlefield: number[];
  selectedEnemyPosition: number | undefined;
  turn: 'You' | 'Enemy';
  enemyPlanes: Mesh[];
}

export interface AppAction {
  type: AppActionType;
  payload?: any;
}

export type AudioActionType = 'SetAudio' | 'EnableAudio';

export interface AudioState {
  path: string;
  maxDistance: number;
}

export interface AudioAction {
  type: AudioActionType;
  payload?: any;
}
