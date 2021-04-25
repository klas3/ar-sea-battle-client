import { GameMode } from '../other/types';

export type ShipsConfigsActionType = 'RotateShips' | 'PlaceShip' | 'RemoveShip';

export type AppActionType = 'ChangeGameMode';

export type PlanesActionType = 'SetPlanes';

export interface ShipsConfigsAction {
  type: ShipsConfigsActionType;
  payload?: any;
}

export interface AppState {
  mode: GameMode;
}

export interface AppAction {
  type: AppActionType;
  payload?: any;
}

export interface PlanesAction {
  type: PlanesActionType;
  payload?: any;
}
