import { ShipConfig, ShipSize } from './types';

const shipsSizesNames: ShipSize[] = ['small', 'medium', 'large', 'largest'];

const modelsPathes = {
  small: 'models/small-ship.glb',
  medium: 'models/medium-ship.glb',
  large: 'models/large-ship.glb',
  largest: 'models/largest-ship.glb',
};

const modelsScales = {
  small: [0.004, 0.004, 0.004],
  medium: [1.5, 1.5, 1.5],
  large: [3.3, 3.3, 2.9],
  largest: [2.3, 2.2, 2.2],
};

const modelsRotations = {
  small: 0,
  medium: 180,
  large: 90,
  largest: 180,
};

const modelsPositions = {
  small: [
    [-140, 1, 70],
    [-140, 1, 50],
    [-140, 1, 30],
    [-140, 1, 10],
  ],
  medium: [
    [140, 1, -50],
    [140, 1, -30],
    [140, 1, -10],
  ],
  large: [
    [-140, 1, -70],
    [-140, 1, -30],
  ],
  largest: [[140, 3, 30]],
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
});

const getDefaultShipsConfigs = (additionalX: number, additionalZ: number): ShipConfig[] => {
  const configs = [];
  for (let shipSize = 0; shipSize < maxShipSize; shipSize += 1) {
    for (let shipIndex = 0; shipIndex < maxShipSize - shipSize; shipIndex += 1) {
      const defaultConfgig = getShipConfig(shipsSizesNames[shipSize], shipIndex);
      defaultConfgig.position[0] += additionalX;
      defaultConfgig.position[2] += additionalZ;
      configs.push(defaultConfgig);
    }
  }
  return configs;
};

export default getDefaultShipsConfigs;
