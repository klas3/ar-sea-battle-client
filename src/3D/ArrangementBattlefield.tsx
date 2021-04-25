import { Suspense, useEffect, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
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
import { placeShip, removeShip, setPlanes } from '../redux/actions';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

interface IProps {
  additionalX?: number;
  additionalZ?: number;
}

const ArrangementBattlefield = (props: IProps) => {
  const { additionalX = 0, additionalZ = 0 } = props;

  const shipsConfigs = useAppSelector((state) => state.shipsConfigs);
  const planes = useAppSelector((state) => state.planes);
  const dispatch = useAppDispatch();

  const [isShipsInitialized, setIsShipsInitialized] = useState(false);

  const { scene, camera, gl: renderer } = useThree();

  const addGridInteraction = () => {
    const createdPlanes = gridCreator.addPlanes(
      arrangementPlaneMaterial,
      additionalX,
      planeDefaultHeight,
      additionalZ,
    );
    createdPlanes.forEach((plane) => scene.add(plane));
    scene.add(gridCreator.createGrid(additionalX, planeDefaultHeight, additionalZ));
    dispatch(setPlanes(createdPlanes));
    return () => {
      planes.forEach((plane) => scene.remove(plane));
      gameService.ships.forEach((ship) => scene.remove(ship));
      gameService.ships.length = 0;
      console.log(gameService.ships);
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(addGridInteraction, [additionalX, additionalZ, scene]);

  const render = () => {
    gameService.ships.forEach((ship) => ship.userData.update());
    renderer.render(scene, camera);
  };

  const getPlaneMaterial = (index: number) => planes[index].material as THREE.MeshBasicMaterial;

  const uncolorPlanes = () =>
    planes.forEach((plane) => ((plane.material as THREE.MeshBasicMaterial).visible = false));

  const tryMarkCell = (event: THREE.Event) => {
    const position = event.object.position;
    const { index } = event.object.userData;
    const { size } = shipsConfigs[index];
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

    gameService.emptyShipPositions(shipsConfigs[index].planesPositions);

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
    gameService.enableCamera();

    const objectPosition = event.object.position;
    const { index } = event.object.userData;
    const markedPlanes = planes.filter((plane) => getPlaneMaterial(plane.userData.index).visible);

    if (!markedPlanes.length) {
      const { position } = getDefaultShipsConfigs(additionalX, additionalZ)[
        event.object.userData.index
      ];
      const [defaultX, defaultY, defaultZ] = position;
      objectPosition.set(defaultX, defaultY, defaultZ);
      gameService.emptyShipPositions(shipsConfigs[index].planesPositions);
      dispatch(removeShip(index));
      return;
    }

    const lastPlaneIndex = markedPlanes.length - 1;
    const { x: firstX, z: firstZ } = markedPlanes[0].position;
    const { x: lastX, z: lastZ } = markedPlanes[lastPlaneIndex].position;
    objectPosition.setX(getSegmentMidpoint(firstX, lastX));
    objectPosition.setZ(getSegmentMidpoint(firstZ, lastZ));
    const newPlanePositions: number[] = [];
    markedPlanes.forEach((plane) => {
      const planeIndex = plane.userData.index;
      gameService.positions[planeIndex] = markedPlanes.length;
      newPlanePositions.push(planeIndex);
    });
    dispatch(
      placeShip(index, [objectPosition.x, objectPosition.y, objectPosition.z], newPlanePositions),
    );
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
        onDragStart={gameService.disableCamera}
        onDragEnd={handleDragEnd}
        reference={gameService.addShip}
        draggableLimit={draggableLimit}
      />
    ));
  }

  if (!isShipsInitialized && gameService.ships.length) {
    gameService.ships.forEach((ship) => {
      const controls = new DragControls([ship], camera, renderer.domElement);
      controls.transformGroup = true;
      controls.addEventListener('drag', tryMarkCell);
      controls.addEventListener('dragstart', gameService.disableCamera);
      controls.addEventListener('dragend', handleDragEnd);
    });
    setIsShipsInitialized(true);
  }

  return <Suspense fallback={<LoadingBox />}>{renderedShips}</Suspense>;
};

export default ArrangementBattlefield;
