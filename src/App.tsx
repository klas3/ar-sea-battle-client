import { useEffect } from 'react';
import Initial3DScene from './3D/Initial3DScene';
import InitialARScene from './AR/InitialARScene';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import {} from './other/battleMapConfigs';
import { arrangeRandomly, setGameMode, shoot } from './redux/actions';
import gameService from './services/gameService';
import './styles/ui.css';

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

  const onConfirmButtonClick = () => gameService.sendArrangedShips();

  const scene = gameMode === '3D' ? <Initial3DScene /> : <InitialARScene />;

  const gameModeSetter = gameMode === '3D' ? setARGameMode : set3DGameMode;

  const gameModeButtonText = gameMode === '3D' ? 'AR' : '3D';

  const randomlyArrangeShips = () => dispatch(arrangeRandomly());

  const isArranging = gameState === 'Arranging';

  const confirmButtonText = isArranging ? 'Confirm' : 'Fire!';

  const shootEnemy = () => dispatch(shoot());

  const confirmButtonHandler = isArranging ? onConfirmButtonClick : shootEnemy;

  const confirmButtonVisibility = isArranging
    ? isAllShipsPlaced
    : selectedEnemyPosition !== undefined;

  const turnText = turn === 'You' ? 'Your turn' : "Enemy's turn";

  useEffect(() => {
    return () => {
      console.log('disconnect');
      gameService.disconnect();
    };
  }, []);

  if (gameState !== 'InGame' && !isArranging) {
    return scene;
  }

  return (
    <>
      {gameState === 'InGame' && <p className="turn">{turnText}</p>}
      {confirmButtonVisibility && (
        <button className="confirm-button" onClick={confirmButtonHandler}>
          {confirmButtonText}
        </button>
      )}
      {isArranging && (
        <button className="top-left-button" onClick={randomlyArrangeShips}>
          Arrange
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
