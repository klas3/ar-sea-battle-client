import { useEffect } from 'react';
import { useThree } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface IProps {
  enabled?: boolean;
}

const CameraController = (props: IProps) => {
  const { camera, gl } = useThree();
  const { enabled = true } = props;

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);

    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 10, 0);
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.enabled = enabled;

    return () => controls.dispose();
  }, [camera, gl, enabled]);

  return null;
};

export default CameraController;
