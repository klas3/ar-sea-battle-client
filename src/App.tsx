import Initial3DScene from './3D/Initial3DScene';
import FriendlyARBattlefield from './AR/FriendlyARBattlefield';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import { setGameMode } from './redux/actions';
import './styles/buttons.css';

const App = () => {
  const gameMode = useAppSelector((state) => state.app.mode);

  const dispatch = useAppDispatch();

  const setARGameMode = () => dispatch(setGameMode('AR'));

  const set3DGameMode = () => dispatch(setGameMode('3D'));

  const scene = gameMode === '3D' ? <Initial3DScene /> : <FriendlyARBattlefield />;

  const gameModeSetter = gameMode === '3D' ? setARGameMode : set3DGameMode;

  return (
    <>
      <button className="game-mode-button" onClick={gameModeSetter}>
        Не нажимать!
      </button>
      {scene}
    </>
  );
};

export default App;
