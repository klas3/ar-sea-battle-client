import { AudioLoader, Raycaster, TextureLoader, Vector2, Vector3 } from 'three';

export const raycaster = new Raycaster();

export const mouse = new Vector2();

export const diractionalRay = new Vector3(0, -1, 0);

export const textureLoader = new TextureLoader();

export const audioLoader = new AudioLoader();
