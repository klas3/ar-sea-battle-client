import * as THREE from 'three';

export const gridCellsCount = 10;

export const shipRotationStep = 90;

export const shipMaxRotation = 270;

export const gridSize = 200;

export const shipDraggingAddition = 5;

export const planeDefaultHeight = 1;

export const battlePlaneMaterial = { color: 'red', visible: false };

export const diractionalRay = new THREE.Vector3(0, -1, 0);

export const raycaster = new THREE.Raycaster();

export const mouse = new THREE.Vector2();

export const shipSizesAdditions = [0, 20, -20, 40];

export const arrangementPlaneMaterial = { color: 'green', visible: false };

export const arCoordsСoefficient = 100;
