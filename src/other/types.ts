import { Object3D } from 'three';

export interface DraggableLimit {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export interface ShipConfig {
  path: string;
  position: number[];
  scale: number[];
  size: number;
  rotation: number;
  isTurnedHorizontally: boolean;
  isPlaced: boolean;
  planesPositions: number[];
}

export interface ShipsState {
  configs: ShipConfig[];
  models3D: Object3D[];
  positions: number[];
  planes: THREE.Mesh[];
  additionalX: number;
  additionalZ: number;
}

export type ShipSize = 'small' | 'medium' | 'large' | 'largest';

export type GameMode = '3D' | 'AR';

export interface RandomArrangingPosition {
  value: number;
  index: number;
}
