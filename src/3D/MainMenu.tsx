import { useEffect, ChangeEvent } from 'react';
import { MdKeyboardBackspace } from 'react-icons/md';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { clientUrl, emptyCodeFieldError, patternARPathname, serverUrl } from '../other/constants';
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

  const onHintsButtonClick = () => dispatch(setGameState('ViewingHints'));

  const onCopyButtonClick = () => copyTextToClipboard(gameCode);

  const onCopyLinkButtonClick = () => copyTextToClipboard(`${clientUrl}/${gameCode}`);

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

  const backButton = (gameState === 'CreatingRoom' ||
    gameState === 'JoiningRoom' ||
    gameState === 'ViewingHints') && (
    <button className="random-arranging-button" onClick={onBackButtonClick}>
      <MdKeyboardBackspace />
    </button>
  );

  const mainMenuButton = (gameState === 'WinnerScreen' || gameState === 'LooserScreen') && (
    <button className="first-menu-item" onClick={onBackButtonClick}>
      To main menu
    </button>
  );

  const hintsButton = (gameState === 'InMainMenu' ||
    gameState === 'CreatingRoom' ||
    gameState === 'JoiningRoom') && (
    <button className="bottom-left-button" onClick={onHintsButtonClick}>
      <AiOutlineQuestionCircle />
    </button>
  );

  const hints = gameState === 'ViewingHints' && (
    <>
      <p className="hints hint1">
        <b>Drag and drop</b> to arrange your ships
      </p>
      <p className="hints hint2">
        <b>Click</b> on ship to rotate it
      </p>
      <p className="hints hint3">
        <b>Click</b> on enemy's field to make a shot
      </p>
      <p className="hints hint4">
        <b>Scan</b> the{' '}
        <a target="_blank" rel="noreferrer" href={`${serverUrl}/${patternARPathname}`}>
          marker
        </a>{' '}
        in AR mode to see your ships
      </p>
    </>
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
      {hintsButton}
      {hints}
      {backButton}
      <p className="copyright">© 2021 Ivan Shapovalov</p>
    </>
  );
};

export default MainMenu;
