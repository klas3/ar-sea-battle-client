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

export type AppActionType = 'ChangeGameMode';

export interface ShipsAction {
  type: ShipsActionType;
  payload?: any;
}

export interface AppState {
  mode: GameMode;
}

export interface AppAction {
  type: AppActionType;
  payload?: any;
}
