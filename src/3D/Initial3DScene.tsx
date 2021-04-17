import { Canvas } from 'react-three-fiber';
import { Provider } from 'react-redux';
import { rotateShips } from '../redux/actions';
import CameraController from '../CameraController';
import BattleMap from './BattleMap';
import ArrangementBattlefield from './ArrangementBattlefield';
import { useAppDispatch } from '../hooks/reduxHooks';
import '../styles/3D.css';
import store from '../redux/store';

const Initial3DScene = () => {
  const dispatch = useAppDispatch();

  const onRotateButtonClick = () => dispatch(rotateShips());

  return (
    <>
      <button onClick={onRotateButtonClick}>Rotate</button>
      <Canvas camera={{ position: [0, 175, 5] }}>
        <Provider store={store}>
          <CameraController enabled={false} />
          <BattleMap />
          <ArrangementBattlefield />
        </Provider>
      </Canvas>
    </>
  );
};

export default Initial3DScene;
