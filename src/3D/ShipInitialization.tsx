import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useMemo } from 'react';
import { Object3D } from 'three';
import { ShipConfig } from '../other/types';
import { convertToRadians } from '../other/helpers';
import { shipwreckXRotation } from '../other/constants';

interface IProps {
  config: ShipConfig;
  index: number;
  reference?: (model: Object3D) => void;
}

const ShipInitialization = (props: IProps) => {
  const { config, reference, index } = props;
  const { path, position, scale, rotation, isShipwreck } = config;

  const { scene } = useLoader(GLTFLoader, path);
  const copiedScene = useMemo(() => scene.clone(), [scene]);

  copiedScene.rotation.y = convertToRadians(rotation);
  if (isShipwreck) {
    copiedScene.rotation.x = convertToRadians(shipwreckXRotation);
  }
  copiedScene.userData.index = index;

  const [scaleX, scaleY, scaleZ] = scale;
  copiedScene.scale.set(scaleX, scaleY, scaleZ);

  if (reference) {
    setTimeout(() => reference(copiedScene));
  }

  return <primitive object={copiedScene} position={position} />;
};

export default ShipInitialization;
