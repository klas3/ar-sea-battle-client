import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

class GameService {
  private shipsModels: GLTF[] = [];

  public get ships(): GLTF[] {
    return this.shipsModels;
  }

  public addShip = (ship: GLTF) => this.shipsModels.push(ship);
}

const gameService = new GameService();

export default gameService;
