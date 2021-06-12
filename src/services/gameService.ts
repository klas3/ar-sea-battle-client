import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import SocketIOClient from 'socket.io-client';
import axiosClient, { AxiosInstance } from 'axios';
import { ServerResponse } from '../other/types';
import { v4 as uuidv4 } from 'uuid';
import Cookie from 'js-cookie';
import { serverUrl } from '../other/constants';
import store from '../redux/store';
import { setAdditions, setGameCode, setGameState } from '../redux/actions';
import {
  friendlyBattlefieldAdditionalX,
  friendlyBattlefieldAdditionalZ,
} from '../other/battleMapConfigs';

class GameService {
  private cameraController: OrbitControls | null = null;

  private socket: SocketIOClient.Socket;

  private axios: AxiosInstance;

  private readonly userIdCookieName = 'userId';

  constructor() {
    this.socket = SocketIOClient(serverUrl, { query: { userId: this.getUserId() } });
    this.socket.on('startArrangement', this.startArrangement);
    this.socket.on('startGame', this.startGame);
    this.socket.on('victory', this.onVicktory);
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
      // TODO: display error
      return;
    }
  };

  public sendArrangedShips = () => {
    const { game, ships } = store.getState();
    this.socket.emit('arrangeShips', {
      gameCode: game.gameCode,
      ships: ships.positions,
      userId: this.getUserId(),
    });
  };

  public startArrangement = () => store.dispatch(setGameState('Arranging'));

  public startGame = () => {
    store.dispatch(setAdditions(friendlyBattlefieldAdditionalX, friendlyBattlefieldAdditionalZ));
    store.dispatch(setGameState('InGame'));
  };

  public onVicktory = () => store.dispatch(setGameState('InMainMenu'));

  public disconnect = () => this.socket.disconnect();

  private makePostRequest = async (endpoint: string, data?: object): Promise<ServerResponse> => {
    try {
      const response = await this.axios.post(endpoint, data);
      return { data: response.data };
    } catch (error) {
      const errorMessage = error.response.data.message || error.response.data;
      console.log(errorMessage);
      return { error: errorMessage };
    }
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
