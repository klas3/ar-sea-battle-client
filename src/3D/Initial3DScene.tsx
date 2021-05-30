import { Canvas } from 'react-three-fiber';
import { Provider } from 'react-redux';
// @ts-ignore
import { BlurPass } from 'postprocessing';
import { useCallback, useEffect, useState } from 'react';
import { DepthOfField, EffectComposer } from 'react-postprocessing';
import CameraController from './CameraController';
import BattleMap from './BattleMap';
import Friendly3DBattlefield from './Friendly3DBattlefield';
import '../styles/3D.css';
import store from '../redux/store';
import gameService from '../services/gameService';
import Sound from './Sound';
import { mainMenuCameraConfig, battleCameraConfig } from '../other/constants';
import { useAppSelector } from '../hooks/reduxHooks';
import MainMenu from './MainMenu';

const Initial3DScene = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  const gameState = useAppSelector((state) => state.game.state);

  const isInMainMenu = gameState === 'InMainMenu';

  const isInGame = gameState === 'InGame';

  const cameraConfig = isInMainMenu ? mainMenuCameraConfig : battleCameraConfig;

  const toggleSound = () => setIsSoundEnabled(!isSoundEnabled);

  const composer = useCallback((composerRef) => {
    if (composerRef) {
      setTimeout(() => composerRef.addPass(new BlurPass()));
    }
  }, []);

  useEffect(() => {
    document.body.classList.add('root-size');
    document.documentElement.classList.add('root-size');
    return () => {
      document.body.classList.remove('root-size');
      document.documentElement.classList.remove('root-size');
    };
  }, []);

  return (
    <>
      {!isInGame && <MainMenu />}
      {isInGame && (
        <button className="sound-button" onClick={toggleSound}>
          Sound
        </button>
      )}
      <Canvas camera={cameraConfig}>
        <Provider store={store}>
          {isSoundEnabled && <Sound />}
          <CameraController enabled={isInGame} reference={gameService.setCamera} />
          <BattleMap />
          {isInGame && <Friendly3DBattlefield />}
          {!isInGame && (
            <EffectComposer ref={composer}>
              <DepthOfField />
            </EffectComposer>
          )}
        </Provider>
      </Canvas>
    </>
  );
};

export default Initial3DScene;
