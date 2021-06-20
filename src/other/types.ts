export interface DraggableLimit {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export interface ShipConfig {
  path: string;
  position: [number, number, number];
  scale: number[];
  size: number;
  rotation: number;
  isTurnedHorizontally: boolean;
  isPlaced: boolean;
  planesPositions: number[];
  isShipwreck: boolean;
}

export type ShipSize = 'small' | 'medium' | 'large' | 'largest';

export type GameMode = '3D' | 'AR';

export type Turn = 'You' | 'Enemy';

export type ARBattlefield = 'friendly' | 'enemy';

export interface RandomArrangingPosition {
  value: number;
  index: number;
}

export interface ServerResponse {
  data?: {};
  error?: string;
}
