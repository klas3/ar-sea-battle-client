import React from 'react';

const LoadingBox = () => (
  <mesh>
    <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
    <meshStandardMaterial attach="material" transparent opacity={0.5} />
  </mesh>
);

export default LoadingBox;
