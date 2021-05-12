import { arCoordsСoefficient } from '../other/constants';
import { useAppSelector } from '../hooks/reduxHooks';

const FriendlyARBattlefield = () => {
  const { configs: shipsConfigs } = useAppSelector((state) => state.ships);

  const renderedShips = shipsConfigs.map((config, index) => {
    const position = `${config.position[0] / arCoordsСoefficient} ${0} ${
      config.position[2] / arCoordsСoefficient
    }`;
    const [scaleX, scaleY, scaleZ] = config.scale;
    const scale = `${scaleX / arCoordsСoefficient} ${scaleY / arCoordsСoefficient} ${
      scaleZ / arCoordsСoefficient
    }`;
    const rotation = `0 ${config.rotation} 0`;
    return (
      // @ts-ignore
      <a-entity
        key={index}
        gltf-model={config.path}
        position={position}
        scale={scale}
        rotation={rotation}
      />
    );
  });

  return (
    <>
      {/* @ts-ignore */}
      <a-entity gltf-model="models/sea.glb" scale="0.013 0.013 0.013" position="0.2 -0.1 -0.2" />
      {renderedShips}
    </>
  );
};

export default FriendlyARBattlefield;
