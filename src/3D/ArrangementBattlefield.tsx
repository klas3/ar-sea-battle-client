import { Suspense, useEffect, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { Object3D } from 'three';
import LoadingBox from './LoadingBox';
import ShipInitialization from './ShipInitialization';
import {
  diractionalRay,
  planeDefaultHeight,
  raycaster,
  shipSizesAdditions,
  arrangementPlaneMaterial,
  shipDraggingAddition,
} from '../other/constants';
import gridCreator from '../other/gridHelper';
import gameService from '../services/gameService';
import getDefaultShipsConfigs from '../other/shipsConfigs';
import { convertToRadians, getDraggableLimit, getSegmentMidpoint } from '../other/helpers';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setIsPlaced } from '../redux/actions';

interface IProps {
  additionalX?: number;
  additionalZ?: number;
}

const ArrangementBattlefield = (props: IProps) => {
  const { additionalX = 0, additionalZ = 0 } = props;

  const shipsConfigs = useAppSelector((state) => state.shipsConfigs);
  const dispatch = useAppDispatch();

  const [planes, setPlanes] = useState<THREE.Mesh[]>([]);

  const { scene, camera, gl: renderer } = useThree();

  const addGridInteraction = () => {
    const planes = gridCreator.addPlanes(
      arrangementPlaneMaterial,
      additionalX,
      planeDefaultHeight,
      additionalZ,
    );
    planes.forEach((plane) => scene.add(plane));
    setPlanes(planes);
    scene.add(gridCreator.createGrid(additionalX, planeDefaultHeight, additionalZ));
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

  const emptyShipPositions = (positions: number[]) =>
    positions.forEach((planePosition: number) => {
      gameService.positions[planePosition] = 0;
    });

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
        : position.x + shipDraggingAddition;
      const z = shipsConfigs[shipIndex].isTurnedHorizontally
        ? position.z + shipDraggingAddition
        : position.z + shipSizesAdditions[i];
      raycaster.set({ ...position, x, z }, diractionalRay);
      const intersects = raycaster.intersectObjects(planes);
      if (intersects.length !== 0) {
        intersections.push(intersects[0]);
      }
    }

    emptyShipPositions(planePositions);
    planePositions.length = 0;

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
    const { planePositions, index } = event.object.userData;
    const markedPlanes = planes.filter((plane) => getPlaneMaterial(plane.userData.index).visible);

    if (!markedPlanes.length) {
      const { position } = getDefaultShipsConfigs(additionalX, additionalZ)[
        event.object.userData.index
      ];
      const [defaultX, defaultY, defaultZ] = position;
      objectPosition.set(defaultX, defaultY, defaultZ);
      emptyShipPositions(planePositions);
      planePositions.length = 0;
      dispatch(setIsPlaced(index, false));
      return;
    }

    const lastPlaneIndex = markedPlanes.length - 1;
    const { x: firstX, z: firstZ } = markedPlanes[0].position;
    const { x: lastX, z: lastZ } = markedPlanes[lastPlaneIndex].position;
    objectPosition.setX(getSegmentMidpoint(firstX, lastX));
    objectPosition.setZ(getSegmentMidpoint(firstZ, lastZ));
    markedPlanes.forEach((plane) => {
      const planeIndex = plane.userData.index;
      gameService.positions[planeIndex] = markedPlanes.length;
      planePositions.push(planeIndex);
    });
    dispatch(setIsPlaced(index, true));
    uncolorPlanes();
  };

  useFrame(render);

  const draggableLimit = getDraggableLimit(additionalX, additionalZ);

  let renderedShips = [];

  if (gameService.ships.length) {
    renderedShips = gameService.ships.map((shipScene) => {
      const shipIndex = shipScene.userData.index;
      shipScene.rotation.y = convertToRadians(shipsConfigs[shipIndex].rotation);
      return <primitive key={shipIndex} object={shipScene} position={shipScene.position} />;
    });
  } else {
    renderedShips = shipsConfigs.map((shipConfig, index) => (
      <ShipInitialization
        key={index}
        index={index}
        config={shipConfig}
        onDrag={tryMarkCell}
        onDragEnd={handleDragEnd}
        reference={registerShipModel}
        draggableLimit={draggableLimit}
      />
    ));
  }

  return <Suspense fallback={<LoadingBox />}>{renderedShips}</Suspense>;
};

export default ArrangementBattlefield;
