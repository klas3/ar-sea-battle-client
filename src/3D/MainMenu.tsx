import { useEffect, ChangeEvent } from 'react';
import { MdKeyboardBackspace } from 'react-icons/md';
import Url from 'url-parse';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { emptyCodeFieldError } from '../other/constants';
import { copyTextToClipboard } from '../other/helpers';
import {
  emptyShipsModels,
  setAppError,
  setGameCode,
  setGameState,
  setIsLoading,
} from '../redux/actions';
import gameService from '../services/gameService';

const MainMenu = () => {
  const gameState = useAppSelector((state) => state.game.state);
  const gameCode = useAppSelector((state) => state.game.gameCode);
  const isLoading = useAppSelector((state) => state.game.isLoading);
  const appError = useAppSelector((state) => state.game.appError);
  const dispatch = useAppDispatch();

  const title =
    gameState === 'WinnerScreen'
      ? 'You won!'
      : gameState === 'LooserScreen'
      ? 'You lose!'
      : 'Sea Battle';

  const onCreateButtonClick = async () => {
    dispatch(setIsLoading(true));
    await gameService.createGame();
    dispatch(setIsLoading(false));
    dispatch(setGameState('CreatingRoom'));
  };

  const onJoinGameButtonClick = () => {
    dispatch(setGameCode(''));
    dispatch(setGameState('JoiningRoom'));
  };

  const onJoinButtonClick = async () => {
    if (!gameCode) {
      dispatch(setAppError(emptyCodeFieldError));
      return;
    }
    await gameService.joinGame(gameCode);
  };

  const onBackButtonClick = () => dispatch(setGameState('InMainMenu'));

  const onCopyButtonClick = () => copyTextToClipboard(gameCode);

  const onCopyLinkButtonClick = () => {
    const { protocol, hostname, port } = new Url(document.URL);
    copyTextToClipboard(`${protocol}//${hostname}${port ? `:${port}` : ''}/${gameCode}`);
  };

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
      <input value={`Your room code: ${gameCode}`} className="first-menu-item" disabled />
      <button className="left-half-button" onClick={onCopyButtonClick}>
        Copy
      </button>
      <button className="right-half-button" onClick={onCopyLinkButtonClick}>
        Copy link
      </button>
    </>
  );

  const joinGame = gameState === 'JoiningRoom' && (
    <>
      <input
        onChange={onGameCodeTextChange}
        value={gameCode}
        autoComplete="off"
        id="gameCodeInput"
        placeholder="Room code"
        className="first-menu-item"
      />
      <button className="second-menu-item" onClick={onJoinButtonClick}>
        Join
      </button>
      <p className="error-title">{appError}</p>
    </>
  );

  const backButton = (gameState === 'CreatingRoom' || gameState === 'JoiningRoom') && (
    <button className="random-arranging-button" onClick={onBackButtonClick}>
      <MdKeyboardBackspace />
    </button>
  );

  const mainMenuButton = (gameState === 'WinnerScreen' || gameState === 'LooserScreen') && (
    <button className="first-menu-item" onClick={onBackButtonClick}>
      To main menu
    </button>
  );

  useEffect(() => {
    return () => {
      dispatch(emptyShipsModels());
      dispatch(setAppError(''));
    };
  }, [dispatch]);

  if (isLoading) {
    return <p className="title">Loading</p>;
  }

  return (
    <>
      <p className="title">{title}</p>
      {mainMenuButton}
      {mainMenu}
      {createGame}
      {joinGame}
      {backButton}
      <p className="copyright">© 2021 Ivan Shapovalov</p>
    </>
  );
};

export default MainMenu;
