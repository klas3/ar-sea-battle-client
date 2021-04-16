import { ShipsConfigsAction, ShipsConfigsTypes } from './types';

const rotateShips = (): ShipsConfigsAction => ({
  type: ShipsConfigsTypes.RotateShips,
});

export default rotateShips;
