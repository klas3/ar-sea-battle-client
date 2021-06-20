import { useEffect } from 'react';
import { GiStrikingArrows } from 'react-icons/gi';
import { FaRandom } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import { MdAudiotrack } from 'react-icons/md';
import Initial3DScene from './3D/Initial3DScene';
import InitialARScene from './AR/InitialARScene';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import {} from './other/battleMapConfigs';
import { arrangeRandomly, setGameMode } from './redux/actions';
import gameService from './services/gameService';
import './styles/ui.css';
import { oceanAudio } from './other/tools';

const App = () => {
  const gameMode = useAppSelector((state) => state.game.mode);
  const gameState = useAppSelector((state) => state.game.state);
  const shipsConfigs = useAppSelector((state) => state.ships.configs);
  const selectedEnemyPosition = useAppSelector((state) => state.game.selectedEnemyPosition);
  const turn = useAppSelector((state) => state.game.turn);

  const isAllShipsPlaced = shipsConfigs.every((config) => config.isPlaced);

  const dispatch = useAppDispatch();

  const setARGameMode = () => dispatch(setGameMode('AR'));

  const set3DGameMode = () => dispatch(setGameMode('3D'));

  const confirmArranging = () => gameService.sendArrangedShips();

  const unconfirmArranging = () => gameService.sendArrangedShips(true);

  const randomlyArrangeShips = () => dispatch(arrangeRandomly());

  const scene = gameMode === '3D' ? <Initial3DScene /> : <InitialARScene />;

  const gameModeSetter = gameMode === '3D' ? setARGameMode : set3DGameMode;

  const gameModeButtonText = gameMode === '3D' ? 'AR' : '3D';

  const isArranging = gameState === 'Arranging';

  const isInGame = gameState === 'InGame';

  const confirmButtonText = isArranging ? (
    '✓'
  ) : gameState === 'ConfirmedArranging' ? (
    <ImCross />
  ) : (
    <GiStrikingArrows />
  );

  const togleAudio = () => {
    if (!oceanAudio.paused) {
      oceanAudio.pause();
      return;
    }
    oceanAudio.play();
    oceanAudio.loop = true;
  };

  const shootEnemy = () => {
    if (selectedEnemyPosition === undefined) {
      return;
    }
    gameService.shootEnemy(selectedEnemyPosition);
  };

  const confirmButtonHandler = isArranging
    ? confirmArranging
    : gameState === 'ConfirmedArranging'
    ? unconfirmArranging
    : shootEnemy;

  const confirmButtonVisibility =
    isArranging || gameState === 'ConfirmedArranging'
      ? isAllShipsPlaced
      : selectedEnemyPosition !== undefined;

  const turnText = turn === 'You' ? 'Your turn' : "Enemy's turn";

  useEffect(() => {
    return () => {
      gameService.disconnect();
    };
  }, []);

  if (!isInGame && !(isArranging || gameState === 'ConfirmedArranging')) {
    return scene;
  }

  return (
    <>
      <button className="bottom-left-button" onClick={togleAudio}>
        <MdAudiotrack />
      </button>
      {isInGame && <p className="turn">{turnText}</p>}
      {confirmButtonVisibility && (
        <button className="confirm-button" onClick={confirmButtonHandler}>
          {confirmButtonText}
        </button>
      )}
      {isArranging && (
        <button className="top-left-button" onClick={randomlyArrangeShips}>
          <FaRandom />
        </button>
      )}
      <button className="top-right-button" onClick={gameModeSetter}>
        {gameModeButtonText}
      </button>
      {scene}
    </>
  );
};

export default App;
