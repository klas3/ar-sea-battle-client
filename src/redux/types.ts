export enum ShipsConfigsTypes {
  RotateShips,
  SetIsPlaces,
}

export interface ShipsConfigsAction {
  type: ShipsConfigsTypes;
  payload?: any;
}
