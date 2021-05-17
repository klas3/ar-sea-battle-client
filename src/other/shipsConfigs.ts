import { ShipConfig, ShipSize } from './types';

const shipsSizesNames: ShipSize[] = ['small', 'medium', 'large', 'largest'];

const modelsPathes = {
  small: 'models/small-ship.glb',
  medium: 'models/medium-ship.glb',
  large: 'models/large-ship.glb',
  largest: 'models/largest-ship.glb',
};

const modelsScales = {
  small: [0.8, 0.8, 0.8],
  medium: [2.5, 2.5, 2.5],
  large: [1, 1, 1.3],
  largest: [4, 4.5, 4.5],
};

const modelsRotations = {
  small: 0,
  medium: 180,
  large: 0,
  largest: 180,
};

const modelsPositions = {
  small: [
    [-140, 1, 95],
    [-140, 1, 70],
    [-140, 1, 45],
    [-140, 1, 20],
  ],
  medium: [
    [140, 1, -90],
    [140, 1, -40],
    [140, 1, 10],
  ],
  large: [
    [-140, 1, -95],
    [-140, 1, -25],
  ],
  largest: [[140, 1, 80]],
};

const modelsSizes = {
  small: 1,
  medium: 2,
  large: 3,
  largest: 4,
};

const maxShipSize = 4;

const getShipConfig = (shipSize: ShipSize, positionIndex: number): ShipConfig => ({
  path: modelsPathes[shipSize],
  position: [...modelsPositions[shipSize][positionIndex]],
  scale: [...modelsScales[shipSize]],
  size: modelsSizes[shipSize],
  rotation: modelsRotations[shipSize],
  isTurnedHorizontally: true,
  isPlaced: false,
  planesPositions: [],
});

const getDefaultShipsConfigs = (additionalX: number = 0, additionalZ: number = 0): ShipConfig[] => {
  const configs = [];
  for (let shipSize = 0; shipSize < maxShipSize; shipSize += 1) {
    for (let shipIndex = 0; shipIndex < maxShipSize - shipSize; shipIndex += 1) {
      const defaultConfig = getShipConfig(shipsSizesNames[shipSize], shipIndex);
      defaultConfig.position[0] += additionalX;
      defaultConfig.position[2] += additionalZ;
      configs.push(defaultConfig);
    }
  }
  return configs;
};

export default getDefaultShipsConfigs;
