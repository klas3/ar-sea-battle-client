import React from 'react';
import { Canvas } from 'react-three-fiber';
import ArrangementBattlefield from './battlefields3D/ArrangementBattlefield';
import CameraController from './CameraController';
import BattleMap from './battlefields3D/BattleMap';

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 200, 5] }}>
      <CameraController enabled={false} />
      <BattleMap />
      <ArrangementBattlefield />
    </Canvas>
  );
};

export default Scene;
