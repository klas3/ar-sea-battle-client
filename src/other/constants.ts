import * as THREE from 'three';

export const gridCellsCount = 10;

export const gridSize = 200;

export const planeDefaultHeight = 1;

export const planeMaterial = { visible: false, color: 'red' };

export const diractionalRay = new THREE.Vector3(0, -1, 0);

export const raycaster = new THREE.Raycaster();

export const draggableLimit = {
  min: new THREE.Vector3(-160, 1, -100),
  max: new THREE.Vector3(160, 1, 100),
};
