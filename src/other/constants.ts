import { Vector3 } from 'three';

export const battlefieldSize = 10;

export const shipRotationStep = 90;

export const shipMaxRotation = 270;

export const gridSize = 200;

export const shipDraggingAddition = 5;

export const planeDefaultHeight = 1;

export const battlePlaneMaterial = { color: 'red', visible: false };

export const shipSizesAdditions = [0, 20, -20, 40];

export const arrangementPlaneMaterial = { color: 'green', visible: false };

export const arCoordsСoefficient = 100;

export const lastBattlefieldRowIndex = 90;

export const emptyZoneMark = -1;

export const restrictedZoneMark = -2;

export const shipsMaxRotationsCount = 4;

export const shipsRotationStep = 90;

export const mainMenuCameraConfig = { position: new Vector3(300, 20, -105), far: 20000 };

export const battleCameraConfig = { position: new Vector3(0, 175, 5), far: 20000 };

export const serverUrl = 'http://localhost:3001';

export const enemyArPlaneIdName = 'enemyArPlane';

export const friendlyArPlaneIdName = 'friendlyArPlane';

export const shipwreckXRotation = 180;

export const emptyCodeFieldError = 'Please enter the game code';

export const cordovaPathname = 'android_asset/www/index.html';

export const oceanAudioFilePath = 'audio/ocean.mp3';

export const patternARPathname = 'pattern.png';
