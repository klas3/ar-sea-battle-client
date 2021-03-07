import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import FriendlyBattlefield from './FriendlyBattlefield';
import Model3D from './Model3D';
import Ocean from './Ocean';

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);

    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 10, 0);
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.rotateSpeed = 0.1;

    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  return null;
};

const Box = () => (
  <mesh>
    <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
    <meshStandardMaterial attach="material" transparent opacity={0.5} />
  </mesh>
);

const Scene = () => {
  return (
    <Canvas camera={{ position: [10, 80, 8] }}>
      <CameraController />
      <Ocean />
      <FriendlyBattlefield />
      <Suspense fallback={<Box />}>
        <Model3D scale={1.4} position={[0, 0, 0]} path={'models/large-ship.glb'} />
        <Model3D scale={0.005} position={[0, 0.6, 15]} path={'models/small-ship.glb'} />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
