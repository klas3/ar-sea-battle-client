import { MeshBasicMaterial, MeshLambertMaterial, RepeatWrapping, Vector3 } from 'three';
import { textureLoader } from './tools';

const waterTextureFilePath = 'textures/waternormals.jpg';

const cloudTextureFilePath = 'textures/cloud.png';

export const crossTextureFilePath = 'textures/cross.png';

export const dotTextureFilePath = 'textures/dot.png';

export const emptyPositionColor = '#ff4f4f';

export const sun = new Vector3();

export const mapSize = 10000;

export const sunParameters = {
  inclination: 0.5,
  azimuth: -0.05,
};

export const waterConfig = {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: textureLoader.load(waterTextureFilePath, (texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
  }),
  alpha: 1.0,
  sunDirection: sun,
  sunColor: 0xffffff,
  waterColor: 0x1c2842,
  distortionScale: 3.7,
};

export const cloudMaterial = new MeshLambertMaterial({
  map: textureLoader.load(cloudTextureFilePath),
  transparent: true,
});

export const crossMaterial = new MeshBasicMaterial({
  map: textureLoader.load(crossTextureFilePath),
  transparent: true,
});

export const emptyPositiondMaterial = new MeshBasicMaterial({
  map: textureLoader.load(dotTextureFilePath),
  transparent: true,
});

export const friendlyBattlefieldAdditionalX = 110;

export const friendlyBattlefieldAdditionalZ = 0;

export const enemyBattlefieldAdditionalX = -110;

export const enemyBattlefieldAdditionalZ = 0;

export const friendlyBattlefieldGridName = 'friendlyGrid';

export const enemyBattlefieldGridName = 'enemyGrid';

export const arEnemyBattlefieldPlaneColor = '#366191';

export const arEnemyPlaneMaterial = `transparent: true; opacity: 0.5; color: ${arEnemyBattlefieldPlaneColor};`;

export const arMarkedEnemyPlaneMaterial = `transparent: true; opacity: 0.5;`;

export const arMarkedFriendlyPlaneMaterial = `transparent: true; opacity: 0.5;`;
