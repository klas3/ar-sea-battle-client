import { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { copyElementTextToClipboard } from '../other/helpers';
import { setGameCode, setGameState } from '../redux/actions';
import gameService from '../services/gameService';

const MainMenu = () => {
  const gameState = useAppSelector((state) => state.game.state);
  const gameCode = useAppSelector((state) => state.game.gameCode);
  const dispatch = useAppDispatch();

  const onCreateButtonClick = async () => {
    await gameService.createGame();
    dispatch(setGameState('CreatingRoom'));
  };

  const onJoinGameButtonClick = () => dispatch(setGameState('JoiningRoom'));

  const onJoinButtonClick = async () => gameService.joinGame(gameCode);

  const onBackButtonClick = () => dispatch(setGameState('InMainMenu'));

  const onCopyButtonClick = () => copyElementTextToClipboard('gameCode');

  const onGameCodeTextChange = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(setGameCode(event.target.value));

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
      <input id="gameCode" value={gameCode} className="first-menu-item" disabled />
      <button className="second-menu-item" onClick={onCopyButtonClick}>
        Copy
      </button>
    </>
  );

  const joinGame = gameState === 'JoiningRoom' && (
    <>
      <input
        onChange={onGameCodeTextChange}
        value={gameCode}
        id="gameCodeInput"
        placeholder="Room code"
        className="first-menu-item"
      />
      <button className="second-menu-item" onClick={onJoinButtonClick}>
        Join
      </button>
    </>
  );

  const backButton = gameState !== 'InMainMenu' && (
    <button className="random-arranging-button" onClick={onBackButtonClick}>
      ᐸ
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
