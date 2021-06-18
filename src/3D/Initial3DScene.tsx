import { Canvas } from '@react-three/fiber';
import { Provider } from 'react-redux';
// @ts-ignore
import { BlurPass } from 'postprocessing';
import { useCallback, useEffect } from 'react';
import { EffectComposer } from '@react-three/postprocessing';
import CameraController from './CameraController';
import BattleMap from './BattleMap';
import Friendly3DBattlefield from './Friendly3DBattlefield';
import '../styles/3D.css';
import store from '../redux/store';
import gameService from '../services/gameService';
import { mainMenuCameraConfig, battleCameraConfig } from '../other/constants';
import { useAppSelector } from '../hooks/reduxHooks';
import MainMenu from './MainMenu';
import Enemy3DBattlefield from './Enemy3DBattlefield';
import {
  enemyBattlefieldAdditionalX,
  enemyBattlefieldAdditionalZ,
} from '../other/battleMapConfigs';

const Initial3DScene = () => {
  const gameState = useAppSelector((state) => state.game.state);

  const isPlaying =
    gameState === 'Arranging' || gameState === 'InGame' || gameState === 'ConfirmedArranging';

  const isInGame = gameState === 'InGame';

  const disableArranging = isInGame || gameState === 'ConfirmedArranging';

  const cameraConfig = !isPlaying ? mainMenuCameraConfig : battleCameraConfig;

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
      {!isPlaying && <MainMenu />}
      <Canvas camera={cameraConfig}>
        <Provider store={store}>
          <CameraController enabled={isPlaying} reference={gameService.setCamera} />
          <BattleMap />
          {isPlaying && <Friendly3DBattlefield arranging={!disableArranging} />}
          {isInGame && (
            <Enemy3DBattlefield
              additionalX={enemyBattlefieldAdditionalX}
              additionalZ={enemyBattlefieldAdditionalZ}
            />
          )}
          {!isPlaying && <EffectComposer ref={composer}>{/* <DepthOfField /> */}</EffectComposer>}
        </Provider>
      </Canvas>
    </>
  );
};

export default Initial3DScene;
