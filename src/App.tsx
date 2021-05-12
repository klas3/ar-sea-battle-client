import Initial3DScene from './3D/Initial3DScene';
import InitialARScene from './AR/InitialARScene';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import { arrangeRandomly, setGameMode } from './redux/actions';
import './styles/buttons.css';

const App = () => {
  const gameMode = useAppSelector((state) => state.game.mode);

  const dispatch = useAppDispatch();

  const setARGameMode = () => dispatch(setGameMode('AR'));

  const set3DGameMode = () => dispatch(setGameMode('3D'));

  const scene = gameMode === '3D' ? <Initial3DScene /> : <InitialARScene />;

  const gameModeSetter = gameMode === '3D' ? setARGameMode : set3DGameMode;

  const gameModeButtonText = gameMode === '3D' ? 'AR' : '3D';

  const randomlyArrangeShips = () => dispatch(arrangeRandomly());

  return (
    <>
      <button className="random-arranging-button" onClick={randomlyArrangeShips}>
        Arrange
      </button>
      <button className="game-mode-button" onClick={gameModeSetter}>
        {gameModeButtonText}
      </button>
      {scene}
    </>
  );
};

export default App;
