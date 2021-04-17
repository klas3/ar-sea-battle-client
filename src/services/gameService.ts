import { Object3D } from 'three';
import { gridCellsCount } from '../other/constants';

class GameService {
  private shipsModels: Object3D[] = [];

  private shipsPositions: number[] = [];

  private leftSideMinRowIndex = 1;

  private rightSideMaxRowIndex = 8;

  private topSideMinIndex = 10;

  private bottomSideMaxIndex = 89;

  constructor() {
    this.shipsPositions = this.resetShipsPositions();
  }

  public resetShipsPositions = (): number[] => new Array(gridCellsCount ** 2).fill(0);

  public removeAllShips = () => {
    gameService.ships.length = 0;
  };

  public get positions(): number[] {
    return this.shipsPositions;
  }

  public get ships(): Object3D[] {
    return this.shipsModels;
  }

  public addShip = (ship: Object3D) => this.shipsModels.push(ship);

  public isPositionAvailable = (position: number) => {
    if (this.shipsPositions[position]) {
      return false;
    }
    let isAvailable = this.checkRowPositionsAvailability(position);
    if (position >= this.topSideMinIndex) {
      isAvailable = isAvailable && this.checkRowPositionsAvailability(position - gridCellsCount);
    }
    if (position <= this.bottomSideMaxIndex) {
      isAvailable = isAvailable && this.checkRowPositionsAvailability(position + gridCellsCount);
    }
    return isAvailable;
  };

  private checkRowPositionsAvailability = (position: number) => {
    if (this.shipsPositions[position]) {
      return false;
    }
    const positionLastDigit = position % 10;
    let isAvailable = true;
    if (positionLastDigit >= this.leftSideMinRowIndex) {
      isAvailable = isAvailable && !this.shipsPositions[position - 1];
    }
    if (positionLastDigit <= this.rightSideMaxRowIndex) {
      isAvailable = isAvailable && !this.shipsPositions[position + 1];
    }
    return isAvailable;
  };
}

const gameService = new GameService();

export default gameService;
