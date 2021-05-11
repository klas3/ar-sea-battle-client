import { Canvas } from 'react-three-fiber';
import { Provider } from 'react-redux';
import { useEffect, useState } from 'react';
import CameraController from './CameraController';
import BattleMap from './BattleMap';
import Friendly3DBattlefield from './Friendly3DBattlefield';
import '../styles/3D.css';
import store from '../redux/store';
import gameService from '../services/gameService';
import Sound from './Sound';

const Initial3DScene = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  const togleSound = () => setIsSoundEnabled(!isSoundEnabled);

  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      return;
    }

    rootElement.classList.add('root-size');
    document.body.classList.add('root-size');
    document.body.removeAttribute('style');
    document.documentElement.classList.add('root-size');

    return () => {
      rootElement.classList.remove('root-size');
      document.body.classList.remove('root-size');
      document.documentElement.classList.remove('root-size');
    };
  });

  return (
    <>
      <button className="sound-button" onClick={togleSound}>
        Sound
      </button>
      <Canvas camera={{ position: [0, 175, 5] }}>
        <Provider store={store}>
          {isSoundEnabled && <Sound />}
          <CameraController reference={gameService.setCamera} />
          <BattleMap />
          <Friendly3DBattlefield />
        </Provider>
      </Canvas>
    </>
  );
};

export default Initial3DScene;
