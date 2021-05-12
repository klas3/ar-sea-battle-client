import { AudioLoader, Raycaster, TextureLoader, Vector2, Vector3 } from 'three';

export const battlefieldSize = 10;

export const shipRotationStep = 90;

export const shipMaxRotation = 270;

export const gridSize = 200;

export const shipDraggingAddition = 5;

export const planeDefaultHeight = 1;

export const battlePlaneMaterial = { color: 'red', visible: false };

export const diractionalRay = new Vector3(0, -1, 0);

export const raycaster = new Raycaster();

export const mouse = new Vector2();

export const shipSizesAdditions = [0, 20, -20, 40];

export const arrangementPlaneMaterial = { color: 'green', visible: false };

export const arCoordsСoefficient = 100;

export const lastBattlefieldRowIndex = 90;

export const emptyZoneMark = -1;

export const restrictedZoneMark = -2;

export const shipsMaxRotationsCount = 4;

export const shipsRotationStep = 90;

export const textureLoader = new TextureLoader();

export const audioLoader = new AudioLoader();

export const defaultCameraConfig = { position: new Vector3(0, 175, 5), far: 20000 };
