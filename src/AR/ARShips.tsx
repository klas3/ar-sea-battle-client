import { arCoordsСoefficient, shipwreckXRotation } from '../other/constants';
import { ShipConfig } from '../other/types';

interface IProps {
  configs: ShipConfig[];
  additionalX?: number;
  additionalZ?: number;
}

const ARShips = (props: IProps) => {
  const { additionalX = 0, additionalZ = 0, configs } = props;
  const renderedShips = configs.map((config, index) => {
    const position = `${(config.position[0] - additionalX) / arCoordsСoefficient} ${0} ${
      (config.position[2] - additionalZ) / arCoordsСoefficient
    }`;
    const [scaleX, scaleY, scaleZ] = config.scale;
    const scale = `${scaleX / arCoordsСoefficient} ${scaleY / arCoordsСoefficient} ${
      scaleZ / arCoordsСoefficient
    }`;
    const rotation = `${config.isShipwreck ? shipwreckXRotation : 0} ${config.rotation} 0`;
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
  return <>{renderedShips}</>;
};

export default ARShips;
