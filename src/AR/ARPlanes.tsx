import { useMemo } from 'react';
import {
  arEnemyPlaneMaterial,
  arMarkedEnemyPlaneMaterial,
  arMarkedFriendlyPlaneMaterial,
  crossTextureFilePath,
  dotTextureFilePath,
} from '../other/battleMapConfigs';
import { arCoordsСoefficient, enemyArPlaneIdName, friendlyArPlaneIdName } from '../other/constants';
import gridCreator from '../other/gridHelper';
import { ARBattlefield } from '../other/types';

interface IProps {
  battlefield: number[];
  type: ARBattlefield;
}

const ARPlanes = (props: IProps) => {
  const { battlefield, type } = props;
  const planes = useMemo(() => gridCreator.createPlanes(), []);

  const renderedPlanes = planes.map((plane, planeIndex) => {
    const planePosition = battlefield[planeIndex];
    const isPositionUnknown = planePosition === undefined;
    const { index } = plane.userData;
    const { x, z } = plane.position;
    const position = `${x / arCoordsСoefficient} ${0} ${z / arCoordsСoefficient}`;
    const isFriendly = type === 'friendly';
    const id = `${isFriendly ? friendlyArPlaneIdName : enemyArPlaneIdName}${index}`;
    const material = isFriendly
      ? arMarkedFriendlyPlaneMaterial
      : isPositionUnknown
      ? arEnemyPlaneMaterial
      : arMarkedEnemyPlaneMaterial;
    const texture = isPositionUnknown
      ? ''
      : planePosition === -1
      ? dotTextureFilePath
      : crossTextureFilePath;
    return (
      // @ts-ignore
      <a-box
        id={id}
        visible={!isFriendly || (isFriendly && !!texture)}
        key={index}
        position={position}
        material={material}
        src={texture}
        depth="0.2"
        height="0.01"
        width="0.2"
        class="box"
        clickhandler
      />
    );
  });

  return <>{renderedPlanes}</>;
};

export default ARPlanes;
