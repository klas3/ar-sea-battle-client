import * as THREE from 'three';
import { textureLoader } from './constants';

const waterTextureFilePath = 'textures/waternormals.jpg';

const cloudTextureFilePath = 'textures/cloud.png';

export const sun = new THREE.Vector3();

export const mapSize = 10000;

export const sunParameters = {
  inclination: 0.5,
  azimuth: -0.05,
};

export const waterConfig = {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: textureLoader.load(waterTextureFilePath, (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  }),
  alpha: 1.0,
  sunDirection: sun,
  sunColor: 0xffffff,
  waterColor: 0x1c2842,
  distortionScale: 3.7,
};

export const cloudMaterial = new THREE.MeshLambertMaterial({
  map: textureLoader.load(cloudTextureFilePath),
  transparent: true,
});
