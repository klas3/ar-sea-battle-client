import {
  emptyZoneMark,
  shipMaxRotation,
  shipRotationStep,
  shipsRotationStep,
} from '../../other/constants';
import { convertToRadians, getDefaultPositions, getSegmentMidpoint } from '../../other/helpers';
import { arrangeShipsRandomly } from '../../other/shipsArranging';
import getDefaultShipsConfigs from '../../other/shipsConfigs';
import { ShipsState } from '../../other/types';
import { ShipsAction } from '../types';

// TODO remove initialization to ArrangementBattlefield
const defaultState: ShipsState = {
  configs: getDefaultShipsConfigs(),
  positions: getDefaultPositions(),
  models3D: [],
  planes: [],
  additionalX: 0,
  additionalZ: 0,
};

const shipsConfigsReducer = (state = defaultState, action: ShipsAction): ShipsState => {
  if (action.type === 'RotateShip' && action.payload) {
    const { shipIndex } = action.payload;
    const configs = state.configs.map((config, index) => {
      if (shipIndex === index && !config.isPlaced) {
        config.isTurnedHorizontally = !config.isTurnedHorizontally;
        config.rotation =
          config.rotation === shipMaxRotation ? 0 : config.rotation + shipRotationStep;
      }
      return config;
    });
    return { ...state, configs };
  }
  if (action.type === 'PlaceShip' && action.payload) {
    const { shipIndex, position, planesPositions } = action.payload;
    const configs = state.configs.map((config, index) => {
      if (index === shipIndex) {
        config.isPlaced = true;
        config.position = position;
        config.planesPositions = planesPositions;
      }
      return config;
    });
    planesPositions.forEach((planePosition: number) => {
      state.positions[planePosition] = shipIndex;
    });
    return { ...state, configs };
  }
  if (action.type === 'RemoveShip' && action.payload) {
    const { shipIndex } = action.payload;
    const configs = state.configs.map((config, index) => {
      if (index === shipIndex) {
        const { additionalX, additionalZ } = state;
        config.isPlaced = false;
        config.planesPositions = [];
        config.position = getDefaultShipsConfigs(additionalX, additionalZ)[shipIndex].position;
      }
      return config;
    });
    return { ...state, configs };
  }
  if (action.type === 'EmptyShipsModels') {
    return { ...state, models3D: [] };
  }
  if (action.type === 'SetShipsModels' && action.payload) {
    return { ...state, models3D: action.payload };
  }
  if (action.type === 'EmptyPositions' && action.payload) {
    action.payload.forEach((position: number) => {
      state.positions[position] = emptyZoneMark;
    });
    return state;
  }
  if (action.type === 'SetPlanes' && action.payload) {
    state.planes = action.payload;
    return state;
  }
  if (action.type === 'SetAdditions' && action.payload) {
    const { additionalX, additionalZ } = action.payload;
    return { ...state, additionalX, additionalZ };
  }
  if (action.type === 'ArrangeRandomly') {
    const positions = arrangeShipsRandomly();
    const shipsCoordinates = new Map<number, number[]>();
    const numberedPositions = positions.map((position) => position.value);
    numberedPositions.forEach((position, index) => {
      if (position === emptyZoneMark) {
        return;
      }
      const coordinates = shipsCoordinates.get(position) ?? [];
      shipsCoordinates.set(position, [...coordinates, index]);
    });
    const configs = state.configs.map((config, index) => {
      const coordinates = shipsCoordinates.get(index);
      if (!coordinates) {
        return config;
      }
      const startPoint = state.planes.find((plane) => plane.userData.index === coordinates[0]);
      const endPoint = state.planes.find(
        (plane) => plane.userData.index === coordinates[coordinates.length - 1],
      );
      if (!startPoint || !endPoint) {
        return config;
      }
      const positionX = getSegmentMidpoint(startPoint.position.x, endPoint.position.x);
      const positionZ = getSegmentMidpoint(startPoint.position.z, endPoint.position.z);
      const shipPosition = positions.find((position) => position.value === index);
      if (!shipPosition) {
        return config;
      }
      const shipModel = state.models3D.find((model) => model.userData.index === index);
      if (shipModel) {
        shipModel.position.setX(positionX);
        shipModel.position.setZ(positionZ);
        shipModel.rotation.y = convertToRadians(shipPosition.rotation);
      }
      config.position[0] = positionX;
      config.position[2] = positionZ;
      config.rotation = shipPosition.rotation;
      config.isTurnedHorizontally = (shipPosition.rotation / shipsRotationStep) % 2 === 0;
      config.planesPositions = coordinates;
      config.isPlaced = true;
      return config;
    });
    numberedPositions.forEach((position, index) => {
      state.positions[index] = position;
    });
    return { ...state, configs };
  }
  return state;
};

export default shipsConfigsReducer;
