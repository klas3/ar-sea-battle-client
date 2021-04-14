import { Suspense, useEffect, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import LoadingBox from '../models3D/LoadingBox';
import Ship from '../models3D/Ship';
import {
  diractionalRay,
  planeDefaultHeight,
  raycaster,
  draggableLimit,
  shipSizesAdditions,
  arrangementPlaneMaterial,
} from '../other/constants';
import gridCreator from '../other/gridHelper';
import gameService from '../services/gameService';
import { Object3D } from 'three';
import { ShipConfig } from '../other/types';
import getDefaultShipsConfigs from '../other/shipsConfigs';

interface IProps {
  additionalX?: number;
  additionalZ?: number;
}

const ArrangementBattlefield = (props: IProps) => {
  const [planes, setPlanes] = useState<THREE.Mesh[]>([]);
  const [shipsConfigs, setShipsConfigs] = useState<ShipConfig[]>(getDefaultShipsConfigs());

  const { scene, camera, gl: renderer } = useThree();
  const { additionalX = 0, additionalZ = 0 } = props;

  const addGridInteraction = () => {
    const planes = gridCreator.addPlanes(
      arrangementPlaneMaterial,
      additionalX,
      planeDefaultHeight,
      additionalZ,
    );
    planes.forEach((plane) => scene.add(plane));
    setPlanes(planes);
  };

  useEffect(addGridInteraction, [additionalX, additionalZ, scene]);

  const render = () => {
    gameService.ships.forEach((ship) => ship.userData.update());
    renderer.render(scene, camera);
  };

  const registerShipModel = (gltf: Object3D) => gameService.addShip(gltf);

  const getPlaneMaterial = (index: number) => planes[index].material as THREE.MeshBasicMaterial;

  const uncolorPlanes = () =>
    planes.forEach((plane) => ((plane.material as THREE.MeshBasicMaterial).visible = false));

  const emptyShipPositions = (positions: number[]) => {
    positions.forEach((planePosition: number) => {
      gameService.positions[planePosition] = 0;
    });
    positions.length = 0;
  };

  const tryMarkCell = (event: THREE.Event) => {
    const position = event.object.position;
    const { size, planePositions } = event.object.userData;
    position.set(position.x, planeDefaultHeight, position.z);
    uncolorPlanes();

    const intersections = [];

    for (let i = 0; i < size; i += 1) {
      const shipIndex = event.object.userData.index;
      const x = shipsConfigs[shipIndex].isTurnedHorizontally
        ? position.x + shipSizesAdditions[i]
        : position.x + 5;
      const z = shipsConfigs[shipIndex].isTurnedHorizontally
        ? position.z + 5
        : position.z + shipSizesAdditions[i];
      raycaster.set({ ...position, x, z }, diractionalRay);
      const intersects = raycaster.intersectObjects(planes);
      if (intersects.length !== 0) {
        intersections.push(intersects[0]);
      }
    }

    emptyShipPositions(planePositions);

    if (intersections.length !== size) {
      return;
    }

    const availablePositions = intersections.filter((intersect) =>
      gameService.isPositionAvailable(intersect.object.userData.index),
    );

    if (availablePositions.length !== intersections.length) {
      return;
    }

    intersections.forEach((intersect) => {
      const planeMaterial = getPlaneMaterial(intersect.object.userData.index);
      planeMaterial.visible = true;
    });
  };

  const handleDragEnd = (event: THREE.Event) => {
    const objectPosition = event.object.position;
    const shipPlanePositions = event.object.userData.planePositions;
    const markedPlanes = planes.filter((plane) => getPlaneMaterial(plane.userData.index).visible);

    if (!markedPlanes.length) {
      const { position } = getDefaultShipsConfigs()[event.object.userData.index];
      objectPosition.set(position[0], position[1], position[2]);
      emptyShipPositions(shipPlanePositions);
      return;
    }

    const lastPlaneIndex = markedPlanes.length - 1;
    const middleXPoint = (markedPlanes[0].position.x + markedPlanes[lastPlaneIndex].position.x) / 2;
    const middleZPoint = (markedPlanes[0].position.z + markedPlanes[lastPlaneIndex].position.z) / 2;
    objectPosition.setX(middleXPoint);
    objectPosition.setZ(middleZPoint);
    markedPlanes.forEach((plane) => {
      const planeIndex = plane.userData.index;
      gameService.positions[planeIndex] = markedPlanes.length;
      shipPlanePositions.push(planeIndex);
    });
    uncolorPlanes();
  };

  const rotateALlShips = () =>
    setShipsConfigs(
      shipsConfigs.map((config) => {
        config.isTurnedHorizontally = !config.isTurnedHorizontally;
        config.rotation = config.rotation === 270 ? 0 : config.rotation + 90;
        return config;
      }),
    );

  scene.add(gridCreator.createGrid(additionalX, planeDefaultHeight, additionalZ));

  useFrame(render);

  const renderedShips = shipsConfigs.map((shipConfig, index) => (
    <Ship
      key={index}
      index={index}
      config={shipConfig}
      onDrag={tryMarkCell}
      onDragEnd={handleDragEnd}
      reference={registerShipModel}
      draggableLimit={draggableLimit}
    />
  ));

  return <Suspense fallback={<LoadingBox />}>{renderedShips}</Suspense>;
};

export default ArrangementBattlefield;
