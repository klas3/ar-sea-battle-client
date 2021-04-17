import { ShipsConfigsAction, ShipsConfigsTypes } from './types';

export const rotateShips = (): ShipsConfigsAction => ({
  type: ShipsConfigsTypes.RotateShips,
});

export const setIsPlaced = (shipIndex: number, isPlaced: boolean): ShipsConfigsAction => ({
  type: ShipsConfigsTypes.SetIsPlaces,
  payload: { shipIndex, isPlaced },
});
