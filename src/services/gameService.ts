import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import SocketIOClient from 'socket.io-client';
import axiosClient, { AxiosInstance } from 'axios';
import { ServerResponse } from '../other/types';
import { v4 as uuidv4 } from 'uuid';
import Cookie from 'js-cookie';
import { arBattlefieldChangingTimeout, serverUrl } from '../other/constants';
import store from '../redux/store';
import {
  dropShipsState,
  markEnemyField,
  markMyField,
  setAdditions,
  setAppError,
  setARBattlefield,
  setGameCode,
  setGameState,
  setTurn,
  startGame,
} from '../redux/actions';
import {
  friendlyBattlefieldAdditionalX,
  friendlyBattlefieldAdditionalZ,
} from '../other/battleMapConfigs';
import { oceanAudio } from '../other/tools';

class GameService {
  private cameraController: OrbitControls | null = null;

  private socket: SocketIOClient.Socket;

  private axios: AxiosInstance;

  private readonly userIdCookieName = 'userId';

  constructor() {
    this.socket = SocketIOClient(serverUrl, { query: { userId: this.getUserId() } });
    this.socket.on('startArrangement', this.startArrangement);
    this.socket.on('waitingForOpponent', this.onWaitingForOpponent);
    this.socket.on('startGame', this.startGame);
    this.socket.on('nextMove', this.onNextMove);
    this.socket.on('victory', this.onVicktory);
    this.socket.on('defeat', this.onDefeat);
    this.axios = axiosClient.create({
      timeout: 20 * 1000,
      baseURL: serverUrl,
    });
  }

  public setCamera = (camera: OrbitControls) => {
    this.cameraController = camera;
  };

  public setCameraEnabled = (enabled: boolean) => {
    if (this.cameraController) {
      this.cameraController.enabled = enabled;
    }
  };

  public createGame = async () => {
    const response = await this.makePostRequest('/createGame', { creatorId: this.getUserId() });
    if (response.error || !response.data) {
      return;
    }
    const game = response.data as { code: string };
    store.dispatch(setGameCode(game.code));
  };

  public joinGame = async (code: string) => {
    const response = await this.makePostRequest('/joinGame', { code, invitedId: this.getUserId() });
    if (response.error) {
      store.dispatch(setAppError(response.error));
      return;
    }
  };

  public sendArrangedShips = (dropPositions: boolean = false) => {
    const { game, ships } = store.getState();
    this.socket.emit('arrangeShips', {
      gameCode: game.gameCode,
      ships: dropPositions ? [] : ships.positions,
      userId: this.getUserId(),
    });
  };

  public shootEnemy = (position: number) => {
    this.socket.emit('shoot', {
      position,
      userId: this.getUserId(),
      gameCode: store.getState().game.gameCode,
    });
  };

  public onNextMove = (info: { position: number; positionInfo: number }) => {
    const { position, positionInfo } = info;
    const { turn, mode } = store.getState().game;
    if (turn === 'You') {
      store.dispatch(markEnemyField(position, positionInfo));
      if (positionInfo === -1) {
        setTimeout(
          () => store.dispatch(setARBattlefield('friendly')),
          arBattlefieldChangingTimeout,
        );
        store.dispatch(setTurn('Enemy'));
      }
      return;
    }
    store.dispatch(markMyField(positionInfo, mode, position));
    if (positionInfo === -1) {
      setTimeout(() => store.dispatch(setARBattlefield('enemy')), arBattlefieldChangingTimeout);
      store.dispatch(setTurn('You'));
    }
  };

  public disconnect = () => this.socket.disconnect();

  private makePostRequest = async (endpoint: string, data?: object): Promise<ServerResponse> => {
    try {
      const response = await this.axios.post(endpoint, data);
      return { data: response.data };
    } catch (error) {
      const errorMessage = error.response && (error.response.data.message || error.response.data);
      return { error: errorMessage };
    }
  };

  private startArrangement = () => store.dispatch(setGameState('Arranging'));

  private onWaitingForOpponent = () => store.dispatch(setGameState('ConfirmedArranging'));

  private startGame = (movingUserId: string) => {
    const turn = movingUserId === this.getUserId() ? 'You' : 'Enemy';
    store.dispatch(setAdditions(friendlyBattlefieldAdditionalX, friendlyBattlefieldAdditionalZ));
    store.dispatch(startGame(turn));
  };

  private onVicktory = () => {
    this.onGameEnd();
    store.dispatch(setGameState('WinnerScreen'));
  };

  private onDefeat = () => {
    this.onGameEnd();
    store.dispatch(setGameState('LooserScreen'));
  };

  private onGameEnd = () => {
    oceanAudio.pause();
    oceanAudio.currentTime = 0;
    store.dispatch(dropShipsState());
  };

  private getUserId = () => {
    let userId = Cookie.get(this.userIdCookieName);
    if (!userId) {
      userId = uuidv4();
      Cookie.set(this.userIdCookieName, userId);
    }
    return userId;
  };
}

const gameService = new GameService();

export default gameService;
