import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { copyElementTextToClipboard } from '../other/helpers';
import { setGameState } from '../redux/actions';

const MainMenu = () => {
  const gameState = useAppSelector((state) => state.game.state);
  const dispatch = useAppDispatch();

  const onCreateButtonClick = () => dispatch(setGameState('CreatingRoom'));

  const onJoinGameButtonClick = () => dispatch(setGameState('JoiningRoom'));

  const onJoinButtonClick = () => dispatch(setGameState('InGame'));

  const onBackButtonClick = () => dispatch(setGameState('InMainMenu'));

  const onCopyButtonClick = () => copyElementTextToClipboard('gameCode');

  const mainMenu = gameState === 'InMainMenu' && (
    <>
      <button className="first-menu-item" onClick={onCreateButtonClick}>
        Create a game
      </button>
      <button className="second-menu-item" onClick={onJoinGameButtonClick}>
        Join a game
      </button>
    </>
  );

  const createGame = gameState === 'CreatingRoom' && (
    <>
      <input id="gameCode" value="12345" className="first-menu-item" disabled />
      <button className="second-menu-item" onClick={onCopyButtonClick}>
        Copy
      </button>
    </>
  );

  const joinGame = gameState === 'JoiningRoom' && (
    <>
      <input placeholder="Room code" className="first-menu-item" />
      <button className="second-menu-item" onClick={onJoinButtonClick}>
        Join
      </button>
    </>
  );

  const backButton = gameState !== 'InMainMenu' && (
    <button className="random-arranging-button" onClick={onBackButtonClick}>
      Back
    </button>
  );

  return (
    <>
      <p className="title">Sea Battle</p>
      {mainMenu}
      {createGame}
      {joinGame}
      {backButton}
    </>
  );
};

export default MainMenu;
