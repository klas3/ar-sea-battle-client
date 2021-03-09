import { extend, useLoader, useThree } from 'react-three-fiber';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { DraggableLimit } from '../other/types';

extend({ DragControls });

interface IProps {
  path: string;
  scale: number;
  position: number[];
  draggableLimit?: DraggableLimit;
  onDrag?: (event: THREE.Event) => void;
  reference?: (gltf: GLTF) => void;
}

const Model3D = (props: IProps) => {
  const { path, position, scale, reference, draggableLimit, onDrag } = props;
  const { camera, gl } = useThree();
  const gltf = useLoader(GLTFLoader, path);

  if (draggableLimit) {
    gltf.userData.limit = draggableLimit;
    gltf.userData.update = () =>
      gltf.scene.position.clamp(gltf.userData.limit.min, gltf.userData.limit.max);

    gltf.scene.scale.set(scale, scale, scale);
    const controls = new DragControls([gltf.scene], camera, gl.domElement);
    controls.transformGroup = true;

    if (onDrag) {
      controls.addEventListener('drag', onDrag);
    }
  }

  if (reference) {
    reference(gltf);
  }

  return <primitive object={gltf.scene} position={position} />;
};

export default Model3D;
