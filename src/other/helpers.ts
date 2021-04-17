import * as THREE from 'three';

export const convertToRadians = (degrees: number): number => degrees * (Math.PI / 180);

export const getSegmentMidpoint = (startPoint: number, endPoint: number) =>
  (startPoint + endPoint) / 2;

export const getDraggableLimit = (additionalX: number, additionalZ: number) => ({
  min: new THREE.Vector3(-160 + additionalX, 3, -100 + additionalZ),
  max: new THREE.Vector3(160 + additionalX, 4, 100 + additionalZ),
});
