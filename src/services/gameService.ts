import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class GameService {
  private cameraController: OrbitControls | null = null;

  public setCamera = (camera: OrbitControls) => {
    this.cameraController = camera;
  };

  public setCameraEnabled = (enabled: boolean) => {
    if (this.cameraController) {
      this.cameraController.enabled = enabled;
    }
  };
}

const gameService = new GameService();

export default gameService;
