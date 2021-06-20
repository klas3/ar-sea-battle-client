import { Mesh, Vector3 } from 'three';
import { crossMaterial, emptyPositiondMaterial } from './battleMapConfigs';
import { battlefieldSize, lastBattlefieldRowIndex } from './constants';
import { RandomArrangingPosition } from './types';

export const convertToRadians = (degrees: number): number => degrees * (Math.PI / 180);

export const getSegmentMidpoint = (startPoint: number, endPoint: number) =>
  (startPoint + endPoint) / 2;

export const getDraggableLimit = (additionalX: number, additionalZ: number) => ({
  min: new Vector3(-160 + additionalX, 0, -(battlefieldSize ** 2) + additionalZ),
  max: new Vector3(160 + additionalX, 4, battlefieldSize ** 2 + additionalZ),
});

export const getDefaultPositions = (): number[] => new Array(battlefieldSize ** 2).fill(-1);

export const getBattlefieldDefaultPositions = (): number[] =>
  new Array(battlefieldSize ** 2).fill(undefined);

export const getRowsFromBattlefieldPositions = (array: RandomArrangingPosition[]) => {
  const rows = [];
  for (let i = 0; i < array.length; i += battlefieldSize) {
    rows.push(array.slice(i, i + battlefieldSize));
  }
  return rows;
};

export const getColumnsFromBattlefieldPositions = (array: RandomArrangingPosition[]) => {
  const columns = [];
  for (let i = 0; i < battlefieldSize; i += 1) {
    const column = [];
    for (let j = i; j <= lastBattlefieldRowIndex + i; j += battlefieldSize) {
      column.push(array[j]);
    }
    columns.push(column);
  }
  return columns;
};

export const getRandomNumber = (max: number) => Math.floor(Math.random() * max);

export const copyTextToClipboard = (text: string) => {
  const elem: any = document.createElement('textarea');
  elem.value = text;
  document.body.appendChild(elem);
  elem.select();
  document.execCommand('copy');
  document.body.removeChild(elem);
};

export const markTouched3DPlanes = (planes: Mesh[], positions: number[]) =>
  planes.map((plane, index) => {
    if (positions[index] !== undefined) {
      plane.material = positions[index] === -1 ? emptyPositiondMaterial : crossMaterial;
    }
    return plane;
  });

export const findAllIndexes = (array: number[], value: number) => {
  const indexes: number[] = [];
  array.forEach((arrayValue, index) => {
    if (arrayValue === value) {
      indexes.push(index);
    }
  });
  return indexes;
};
