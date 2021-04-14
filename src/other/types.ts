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
}

export type ShipSize = 'small' | 'medium' | 'large' | 'largest';
