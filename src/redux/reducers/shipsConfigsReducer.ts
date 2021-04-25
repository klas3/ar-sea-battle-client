import { shipMaxRotation, shipRotationStep } from '../../other/constants';
import getDefaultShipsConfigs from '../../other/shipsConfigs';
import { ShipConfig } from '../../other/types';
import { ShipsConfigsAction } from '../types';

// TODO remove initialization to ArrangementBattlefield
const defaultState: ShipConfig[] = getDefaultShipsConfigs(0, 0);

const shipsConfigsReducer = (state = defaultState, action: ShipsConfigsAction) => {
  if (action.type === 'RotateShips') {
    return state.map((config) => {
      if (!config.isPlaced) {
        config.isTurnedHorizontally = !config.isTurnedHorizontally;
        config.rotation =
          config.rotation === shipMaxRotation ? 0 : config.rotation + shipRotationStep;
      }
      return config;
    });
  }
  if (action.type === 'PlaceShip' && action.payload) {
    const { shipIndex, position, planesPositions } = action.payload;
    return state.map((config, index) => {
      if (index === shipIndex) {
        config.isPlaced = true;
        config.position = position;
        config.planesPositions = planesPositions;
      }
      return config;
    });
  }
  if (action.type === 'RemoveShip' && action.payload) {
    const { shipIndex } = action.payload;
    return state.map((config, index) => {
      if (index === shipIndex) {
        config.isPlaced = false;
        config.planesPositions = [];
        // TODO remove initialization to ArrangementBattlefield
        config.position = getDefaultShipsConfigs(0, 0)[shipIndex].position;
      }
      return config;
    });
  }
  return state;
};

export default shipsConfigsReducer;
