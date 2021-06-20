import { Mesh, Object3D } from 'three';
import { ARBattlefield, GameMode, ShipConfig, Turn } from '../other/types';

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
  | 'SetTurn'
  | 'AddShipwreckModel'
  | 'EmptyShipwrecksModels'
  | 'SetARBattlefield';

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

export interface ShipsState {
  configs: ShipConfig[];
  models3D: Object3D[];
  positions: number[];
  planes: THREE.Mesh[];
  friendlyBattlefield: number[];
  friendlyAdditionalX: number;
  friendlyAdditionalZ: number;
}

export interface AppState {
  mode: GameMode;
  selectedARBattlefield: ARBattlefield;
  state: GameState;
  enemyBattlefield: number[];
  selectedEnemyPosition: number | undefined;
  turn: Turn;
  enemyPlanes: Mesh[];
  gameCode: string;
  isLoading: boolean;
  shipwrecksConfigs: ShipConfig[];
  shipwrecksModels: Object3D[];
  appError: string;
}

export interface AppAction {
  type: AppActionType;
  payload?: any;
}
