import {
  battlefieldSize,
  emptyZoneMark,
  restrictedZoneMark,
  shipsMaxRotationsCount,
  shipsRotationStep,
} from './constants';
import {
  getColumnsFromBattlefieldPositions,
  getDefaultPositions,
  getRandomNumber,
  getRowsFromBattlefieldPositions,
} from './helpers';
import getDefaultShipsConfigs from './shipsConfigs';
import { RandomArrangingPosition } from './types';

const leftSideMinRowIndex = 1;

const rightSideMaxRowIndex = 8;

const topSideMinIndex = 10;

const bottomSideMaxIndex = 89;

export const isPositionAvailable = (shipsPositions: number[], position: number) => {
  let isAvailable = checkRowPositionsAvailability(shipsPositions, position);
  if (position >= topSideMinIndex) {
    isAvailable =
      isAvailable && checkRowPositionsAvailability(shipsPositions, position - battlefieldSize);
  }
  if (position <= bottomSideMaxIndex) {
    isAvailable =
      isAvailable && checkRowPositionsAvailability(shipsPositions, position + battlefieldSize);
  }
  return isAvailable;
};

const checkRowPositionsAvailability = (shipsPositions: number[], position: number) => {
  const currentPosition = shipsPositions[position];
  if (currentPosition !== emptyZoneMark && currentPosition !== restrictedZoneMark) {
    return false;
  }
  const positionLastDigit = position % 10;
  let isAvailable = true;
  if (positionLastDigit >= leftSideMinRowIndex) {
    const previousPosition = shipsPositions[position - 1];
    isAvailable =
      isAvailable &&
      (previousPosition === emptyZoneMark || previousPosition === restrictedZoneMark);
  }
  if (positionLastDigit <= rightSideMaxRowIndex) {
    const nextPosition = shipsPositions[position + 1];
    isAvailable =
      isAvailable && (nextPosition === emptyZoneMark || nextPosition === restrictedZoneMark);
  }
  return isAvailable;
};

export const arrangeShipsRandomly = () => {
  const shipsConfigs = getDefaultShipsConfigs().reverse();
  const shipsPositions = getDefaultPositions().map((value, index) => ({
    value,
    index,
    rotation: 0,
  }));
  const lastShipPosition = shipsPositions.length - 1;

  shipsConfigs.forEach((config, shipIndex) => {
    const rotationAngle = shipsRotationStep * getRandomNumber(shipsMaxRotationsCount);
    const isTurnedHorizontally = (rotationAngle / shipsRotationStep) % 2 === 0;
    const battlefieldsChunks = isTurnedHorizontally
      ? getRowsFromBattlefieldPositions(shipsPositions)
      : getColumnsFromBattlefieldPositions(shipsPositions);
    battlefieldsChunks.sort(() => Math.random() - 0.5);

    for (let chunkIndex = 0; chunkIndex < battlefieldsChunks.length; chunkIndex += 1) {
      const positionsChunk = battlefieldsChunks[chunkIndex];
      const splitedChunk: RandomArrangingPosition[][] = [[]];
      const numberedPositions = shipsPositions.map((position) => position.value);
      positionsChunk.forEach((position) => {
        const lastSplitedChunkIndex = splitedChunk.length - 1;
        if (
          position.value === emptyZoneMark &&
          isPositionAvailable(numberedPositions, position.index)
        ) {
          splitedChunk[lastSplitedChunkIndex].push(position);
          return;
        }
        if (splitedChunk[lastSplitedChunkIndex].length) {
          splitedChunk.push([]);
        }
      });

      const availablePositions = splitedChunk.filter(
        (positions) => positions.length >= config.size,
      );
      if (!availablePositions.length) {
        continue;
      }

      const randomPosition = getRandomNumber(availablePositions.length);
      const randomPositionIndex = getRandomNumber(
        availablePositions[randomPosition].length - config.size,
      );
      const shipStartPosition = availablePositions[randomPosition][randomPositionIndex].index;

      const step = isTurnedHorizontally ? 1 : battlefieldSize;
      const sideAddition = isTurnedHorizontally ? battlefieldSize : 1;

      const zonesRanges = [
        [
          shipStartPosition - 1 - battlefieldSize,
          shipStartPosition - sideAddition + config.size * step,
        ],
        [
          shipStartPosition - step + sideAddition,
          shipStartPosition + sideAddition + config.size * step,
        ],
      ];
      const restrictedZones = [shipStartPosition - step, shipStartPosition + step];
      zonesRanges.forEach((range) => {
        for (let i = range[0]; i <= range[1]; i += step) {
          restrictedZones.push(i);
        }
      });
      const validRestrictedZones = restrictedZones.filter(
        (zone) => zone >= 0 && zone <= lastShipPosition,
      );
      validRestrictedZones.forEach((zone) => {
        const { value } = shipsPositions[zone];
        if (value === emptyZoneMark || value === restrictedZoneMark) {
          shipsPositions[zone].value = restrictedZoneMark;
        }
      });

      for (let i = shipStartPosition; i < shipStartPosition + step * config.size; i += step) {
        shipsPositions[i].value = shipsConfigs.length - 1 - shipIndex;
        shipsPositions[i].rotation = rotationAngle;
      }

      break;
    }
  });

  const normalizedPositions = shipsPositions.map((position) => {
    if (position.value === emptyZoneMark || position.value === restrictedZoneMark) {
      position.value = emptyZoneMark;
    }
    return position;
  });

  return normalizedPositions;
};
