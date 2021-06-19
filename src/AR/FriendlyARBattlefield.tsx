import { arCoordsСoefficient, friendlyArPlaneIdName } from '../other/constants';
import { useAppSelector } from '../hooks/reduxHooks';
import {
  arMarkedFriendlyPlaneMaterial,
  crossTextureFilePath,
  dotTextureFilePath,
} from '../other/battleMapConfigs';
import { useMemo } from 'react';
import gridCreator from '../other/gridHelper';

const FriendlyARBattlefield = () => {
  const shipsConfigs = useAppSelector((state) => state.ships.configs);
  const additionalX = useAppSelector((state) => state.ships.friendlyAdditionalX);
  const additionalZ = useAppSelector((state) => state.ships.friendlyAdditionalZ);
  const friendlyBattlefield = useAppSelector((state) => state.ships.friendlyBattlefield);

  const renderedShips = shipsConfigs.map((config, index) => {
    const position = `${(config.position[0] - additionalX) / arCoordsСoefficient} ${0} ${
      (config.position[2] - additionalZ) / arCoordsСoefficient
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

  const planes = useMemo(() => gridCreator.createPlanes(), []);

  const renderedPlanes = planes.map((plane, planeIndex) => {
    const friendlyPosition = friendlyBattlefield[planeIndex];
    const { index } = plane.userData;
    const { x, z } = plane.position;
    const position = `${x / arCoordsСoefficient} ${0} ${z / arCoordsСoefficient}`;
    const id = `${friendlyArPlaneIdName}${index}`;
    const texture =
      friendlyPosition === undefined
        ? ''
        : friendlyPosition === -1
        ? dotTextureFilePath
        : crossTextureFilePath;
    return (
      // @ts-ignore
      <a-box
        id={id}
        key={index}
        position={position}
        material={arMarkedFriendlyPlaneMaterial}
        src={texture}
        depth="0.2"
        height="0.01"
        width="0.2"
        class="box"
      />
    );
  });

  return (
    <>
      {/* @ts-ignore */}
      <a-entity gltf-model="models/sea.glb" scale="0.013 0.013 0.013" position="0.2 -0.1 -0.2" />
      {renderedPlanes}
      {renderedShips}
    </>
  );
};

export default FriendlyARBattlefield;
