import { useAppSelector } from '../hooks/reduxHooks';
import ARShips from './ARShips';
import ARPlanes from './ARPlanes';

const FriendlyARBattlefield = () => {
  const shipsConfigs = useAppSelector((state) => state.ships.configs);
  const additionalX = useAppSelector((state) => state.ships.friendlyAdditionalX);
  const additionalZ = useAppSelector((state) => state.ships.friendlyAdditionalZ);
  const friendlyBattlefield = useAppSelector((state) => state.ships.friendlyBattlefield);

  return (
    <>
      {/* @ts-ignore */}
      <a-entity gltf-model="models/sea.glb" scale="0.013 0.013 0.013" position="0.2 -0.1 -0.2" />
      <ARShips configs={shipsConfigs} additionalX={additionalX} additionalZ={additionalZ} />
      <ARPlanes battlefield={friendlyBattlefield} type="friendly" />
    </>
  );
};

export default FriendlyARBattlefield;
