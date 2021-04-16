import { Canvas } from 'react-three-fiber';
import { Provider } from 'react-redux';
import rotateShips from './redux/actions';
import CameraController from './CameraController';
import BattleMap from './battlefields3D/BattleMap';
import ArrangementBattlefield from './battlefields3D/ArrangementBattlefield';
import { useAppDispatch } from './hooks/reduxHooks';
import store from './redux/store';

const App = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <button onClick={() => dispatch(rotateShips())}>Rotate</button>
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

export default App;
