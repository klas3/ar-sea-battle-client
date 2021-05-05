import { Suspense, useEffect, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { Object3D } from 'three';
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
import {
  emptyPositions,
  emptyShipsModels,
  placeShip,
  removeShip,
  rotateShip,
  setPlanes,
  setShipsModels,
} from '../redux/actions';
import gridCreator from '../other/gridHelper';
import gameService from '../services/gameService';
import getDefaultShipsConfigs from '../other/shipsConfigs';
import { convertToRadians, getDraggableLimit, getSegmentMidpoint } from '../other/helpers';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { isPositionAvailable } from '../other/shipsArranging';

interface IProps {
  additionalX?: number;
  additionalZ?: number;
}

const ArrangementBattlefield = (props: IProps) => {
  const { additionalX = 0, additionalZ = 0 } = props;

  const shipsConfigs = useAppSelector((state) => state.ships.configs);
  const models3D = useAppSelector((state) => state.ships.models3D);
  const planes = useAppSelector((state) => state.ships.planes);
  const positions = useAppSelector((state) => state.ships.positions);
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
      models3D.forEach((ship) => scene.remove(ship));
      dispatch(emptyShipsModels());
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(addGridInteraction, [additionalX, additionalZ, scene]);

  const draggableLimit = getDraggableLimit(additionalX, additionalZ);

  const render = () => {
    models3D.forEach((ship) => ship.position.clamp(draggableLimit.min, draggableLimit.max));
    renderer.render(scene, camera);
  };

  const disableCamera = () => gameService.setCameraEnabled(false);

  const getPlaneMaterial = (index: number) => planes[index].material as THREE.MeshBasicMaterial;

  const uncolorPlanes = () =>
    planes.forEach((plane) => ((plane.material as THREE.MeshBasicMaterial).visible = false));

  const tryMarkPlanes = (event: THREE.Event) => {
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

    dispatch(emptyPositions(shipsConfigs[index].planesPositions));
    if (intersections.length !== size) {
      return;
    }
    const availablePositions = intersections.filter((intersect) =>
      isPositionAvailable(positions, intersect.object.userData.index),
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
    gameService.setCameraEnabled(true);

    const objectPosition = event.object.position;
    const { index } = event.object.userData;
    const markedPlanes = planes.filter((plane) => getPlaneMaterial(plane.userData.index).visible);

    if (!markedPlanes.length) {
      const { position } = getDefaultShipsConfigs(additionalX, additionalZ)[
        event.object.userData.index
      ];

      const [defaultX, defaultY, defaultZ] = position;
      const { x: currentX, z: currentZ } = objectPosition;
      if (defaultX === currentX && defaultZ === currentZ) {
        dispatch(rotateShip(index));
        return;
      }
      objectPosition.set(defaultX, defaultY, defaultZ);
      dispatch(emptyPositions(shipsConfigs[index].planesPositions));
      dispatch(removeShip(index));
      return;
    }

    const lastPlaneIndex = markedPlanes.length - 1;
    const { x: firstX, z: firstZ } = markedPlanes[0].position;
    const { x: lastX, z: lastZ } = markedPlanes[lastPlaneIndex].position;
    objectPosition.setX(getSegmentMidpoint(firstX, lastX));
    objectPosition.setZ(getSegmentMidpoint(firstZ, lastZ));
    const newPlanePositions = markedPlanes.map((markedPlane) => markedPlane.userData.index);
    dispatch(
      placeShip(index, [objectPosition.x, objectPosition.y, objectPosition.z], newPlanePositions),
    );
    uncolorPlanes();
  };

  useFrame(render);

  let renderedShips = [];

  if (models3D.length) {
    renderedShips = models3D.map((shipScene) => {
      const shipIndex = shipScene.userData.index;
      shipScene.rotation.y = convertToRadians(shipsConfigs[shipIndex].rotation);
      return <primitive key={shipIndex} object={shipScene} position={shipScene.position} />;
    });
  } else {
    const newModels3D: Object3D[] = [];
    const addModel = (model3D: Object3D) => {
      newModels3D.push(model3D);
      if (newModels3D.length === shipsConfigs.length) {
        dispatch(setShipsModels(newModels3D));
      }
    };
    renderedShips = shipsConfigs.map((shipConfig, index) => (
      <ShipInitialization key={index} index={index} config={shipConfig} reference={addModel} />
    ));
  }

  if (!isShipsInitialized && models3D.length) {
    models3D.forEach((ship) => {
      const controls = new DragControls([ship], camera, renderer.domElement);
      controls.transformGroup = true;
      controls.addEventListener('drag', tryMarkPlanes);
      controls.addEventListener('dragstart', disableCamera);
      controls.addEventListener('dragend', handleDragEnd);
    });
    setIsShipsInitialized(true);
  }

  return <Suspense fallback={<LoadingBox />}>{renderedShips}</Suspense>;
};

export default ArrangementBattlefield;
