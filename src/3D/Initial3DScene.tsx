import { Canvas } from 'react-three-fiber';
import { Provider } from 'react-redux';
import { rotateShips } from '../redux/actions';
import CameraController from './CameraController';
import BattleMap from './BattleMap';
import ArrangementBattlefield from './ArrangementBattlefield';
import { useAppDispatch } from '../hooks/reduxHooks';
import '../styles/3D.css';
import store from '../redux/store';
import { useEffect } from 'react';
import gameService from '../services/gameService';

const Initial3DScene = () => {
  const dispatch = useAppDispatch();

  const onRotateButtonClick = () => dispatch(rotateShips());

  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      return;
    }
    rootElement.classList.add('root-size');
    document.body.classList.add('root-size');
    document.documentElement.classList.add('root-size');
    return () => {
      rootElement.classList.remove('root-size');
      document.body.classList.remove('root-size');
      document.documentElement.classList.remove('root-size');
    };
  });

  return (
    <>
      <button className="rotate-button" onClick={onRotateButtonClick}>
        Rotate
      </button>
      <Canvas camera={{ position: [0, 175, 5] }}>
        <Provider store={store}>
          <CameraController referense={gameService.setCamera} />
          <BattleMap />
          <ArrangementBattlefield />
        </Provider>
      </Canvas>
    </>
  );
};

export default Initial3DScene;
