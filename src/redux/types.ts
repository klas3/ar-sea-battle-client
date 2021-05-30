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
  | 'SetAdditions';

export type AppActionType = 'ChangeGameMode' | 'TogleBattlefield' | 'SetGameState';

export type GameState = 'InMainMenu' | 'CreatingRoom' | 'JoiningRoom' | 'InGame';

export interface ShipsAction {
  type: ShipsActionType;
  payload?: any;
}

export interface AppState {
  mode: GameMode;
  battlefield: 'friendly' | 'enemy';
  state: GameState;
  cameraLook: [number, number, number];
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
