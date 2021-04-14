import { extend, useLoader, useThree } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { DraggableLimit, ShipConfig } from '../other/types';
import { useMemo } from 'react';
import { Euler, Object3D } from 'three';

extend({ DragControls });

interface IProps {
  config: ShipConfig;
  draggableLimit?: DraggableLimit;
  index: number;
  onDrag?: (event: THREE.Event) => void;
  onDragEnd?: (event: THREE.Event) => void;
  reference?: (gltf: Object3D) => void;
}

const Ship = (props: IProps) => {
  const { config, reference, draggableLimit, onDrag, onDragEnd, index } = props;
  const { path, position, scale, size, rotation } = config;

  const { camera, gl } = useThree();
  const { scene } = useLoader(GLTFLoader, path);
  const copiedScene = useMemo(() => scene.clone(), [scene]);

  if (draggableLimit) {
    copiedScene.setRotationFromEuler(new Euler(0, rotation * (Math.PI / 180), 0));
    copiedScene.userData.limit = draggableLimit;
    copiedScene.userData.index = index;
    copiedScene.userData.size = size;
    copiedScene.userData.planePositions = [];
    copiedScene.userData.update = () =>
      copiedScene.position.clamp(copiedScene.userData.limit.min, copiedScene.userData.limit.max);

    copiedScene.scale.set(scale[0], scale[1], scale[2]);
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

export default Ship;
