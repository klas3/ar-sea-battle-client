import { useLoader } from 'react-three-fiber';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface IProps {
  path: string;
  scale: number;
  position: number[];
}

const Model3D = (props: IProps) => {
  const { path, position, scale } = props;
  const gltf = useLoader(GLTFLoader, path);
  gltf.scene.scale.set(scale, scale, scale);
  return <primitive object={(gltf as GLTF).scene} position={position} />;
};

export default Model3D;
