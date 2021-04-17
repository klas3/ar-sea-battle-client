import { extend, useLoader, useThree } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { DraggableLimit, ShipConfig } from '../other/types';
import { useMemo } from 'react';
import { Object3D } from 'three';
import { convertToRadians } from '../other/helpers';

extend({ DragControls });

interface IProps {
  config: ShipConfig;
  draggableLimit?: DraggableLimit;
  index: number;
  onDrag?: (event: THREE.Event) => void;
  onDragEnd?: (event: THREE.Event) => void;
  reference?: (gltf: Object3D) => void;
}

const ShipInitialization = (props: IProps) => {
  const { config, reference, draggableLimit, onDrag, onDragEnd, index } = props;
  const { path, position, scale, size, rotation } = config;

  const { camera, gl } = useThree();
  const { scene } = useLoader(GLTFLoader, path);
  const copiedScene = useMemo(() => scene.clone(), [scene]);

  if (draggableLimit) {
    copiedScene.rotation.y = convertToRadians(rotation);
    copiedScene.userData.limit = draggableLimit;
    copiedScene.userData.index = index;
    copiedScene.userData.size = size;
    copiedScene.userData.planePositions = [];
    copiedScene.userData.update = () =>
      copiedScene.position.clamp(copiedScene.userData.limit.min, copiedScene.userData.limit.max);

    const [scaleX, scaleY, scaleZ] = scale;
    copiedScene.scale.set(scaleX, scaleY, scaleZ);
    const controls = new DragControls([copiedScene], camera, gl.domElement);
    controls.transformGroup = true;

    if (onDrag && onDragEnd) {
      controls.addEventListener('drag', onDrag);
      controls.addEventListener('dragend', onDragEnd);
    }
  }

  if (reference) {
    reference(copiedScene);
  }

  return <primitive object={copiedScene} position={position} />;
};

export default ShipInitialization;
