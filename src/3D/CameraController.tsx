import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface IProps {
  enabled?: boolean;
  reference?: (controls: OrbitControls) => void;
}

const CameraController = (props: IProps) => {
  const { camera, gl } = useThree();
  const { enabled = true, reference } = props;

  const controls = useMemo(() => {
    const cameraControls = new OrbitControls(camera, gl.domElement);

    cameraControls.maxPolarAngle = Math.PI * 0.495;
    cameraControls.target.set(0, 10, 0);
    cameraControls.minDistance = 40.0;
    cameraControls.maxDistance = 200.0;
    cameraControls.enabled = enabled;
    cameraControls.enablePan = false;

    if (reference) {
      reference(cameraControls);
    }

    return cameraControls;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, enabled, gl.domElement, window.innerWidth, window.innerHeight]);

  useEffect(() => {
    return () => controls.dispose();
  }, [controls]);

  return null;
};

export default CameraController;
