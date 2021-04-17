import { shipMaxRotation, shipRotationStep } from '../../other/constants';
import getDefaultShipsConfigs from '../../other/shipsConfigs';
import { ShipConfig } from '../../other/types';
import { ShipsConfigsAction, ShipsConfigsTypes } from '../types';

const defaultState: ShipConfig[] = getDefaultShipsConfigs(0, 0);

const shipsConfigsReducer = (state = defaultState, action: ShipsConfigsAction) => {
  if (action.type === ShipsConfigsTypes.RotateShips) {
    return state.map((config) => {
      if (!config.isPlaced) {
        config.isTurnedHorizontally = !config.isTurnedHorizontally;
        config.rotation =
          config.rotation === shipMaxRotation ? 0 : config.rotation + shipRotationStep;
      }
      return config;
    });
  }
  if (action.type === ShipsConfigsTypes.SetIsPlaces && action.payload) {
    const { isPlaced, shipIndex } = action.payload;
    return state.map((config, index) => {
      if (index === shipIndex) {
        config.isPlaced = isPlaced;
      }
      return config;
    });
  }
  return state;
};

export default shipsConfigsReducer;
