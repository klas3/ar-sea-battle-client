import { Suspense, useCallback, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { MeshBasicMaterial, Object3D } from 'three';
import { planeDefaultHeight, battlePlaneMaterial } from '../other/constants';
import gridCreator from '../other/gridHelper';
import { mouse, raycaster } from '../other/tools';
import { enemyBattlefieldGridName } from '../other/battleMapConfigs';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setEnemyPlanes, setSelectedEnemyPosition, addShipwreckModel } from '../redux/actions';
import { markTouched3DPlanes } from '../other/helpers';
import ShipInitialization from '../3D/ShipInitialization';
import LoadingBox from '../3D/LoadingBox';

interface IProps {
  additionalX?: number;
  additionalZ?: number;
}

const Enemy3DBattlefield = (props: IProps) => {
  const { scene, camera, gl: renderer } = useThree();

  const enemyBattlefield = useAppSelector((state) => state.game.enemyBattlefield);
  const turn = useAppSelector((state) => state.game.turn);
  const planes = useAppSelector((state) => state.game.enemyPlanes);
  const gameState = useAppSelector((state) => state.game.state);
  const shipwrecksConfigs = useAppSelector((state) => state.game.shipwrecksConfigs);
  const shipwrecksModels = useAppSelector((state) => state.game.shipwrecksModels);

  const dispatch = useAppDispatch();

  const { additionalX = 0, additionalZ = 0 } = props;

  const grid = useMemo(
    () =>
      gridCreator.createGrid(
        additionalX,
        planeDefaultHeight,
        additionalZ,
        enemyBattlefieldGridName,
      ),
    [additionalX, additionalZ],
  );

  const markCell = useCallback(
    (mouseX: number, mouseY: number) => {
      if (turn !== 'You') {
        return;
      }
      mouse.x = mouseX;
      mouse.y = mouseY;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planes);
      if (intersects.length === 0) {
        return;
      }
      const selectedIndex = intersects[0].object.userData.index;
      if (enemyBattlefield[selectedIndex] !== undefined) {
        return;
      }
      enemyBattlefield.forEach((position, index) => {
        if (position === undefined) {
          (planes[index].material as MeshBasicMaterial).visible = false;
        }
      });
      const material = planes[selectedIndex].material as MeshBasicMaterial;
      material.visible = true;
      dispatch(setSelectedEnemyPosition(selectedIndex));
    },
    [camera, planes, dispatch, turn, enemyBattlefield],
  );

  const markCellOnClick = useCallback(
    (event: MouseEvent) => {
      if (!renderer.domElement) {
        return;
      }
      markCell(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
      );
    },
    [markCell, renderer.domElement],
  );

  const markCellOnTouch = useCallback(
    (event: TouchEvent) => {
      if (!renderer.domElement) {
        return;
      }
      markCell(
        (event.changedTouches[0].clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.changedTouches[0].clientY / renderer.domElement.clientHeight) * 2 + 1,
      );
    },
    [markCell, renderer.domElement],
  );

  const onDocumentMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!renderer.domElement || turn !== 'You') {
        document.body.style.cursor = 'default';
        return;
      }
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planes);
      document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    },
    [camera, planes, renderer.domElement, turn],
  );

  const addGridInteraction = () => {
    document.addEventListener('click', markCellOnClick);
    document.addEventListener('touchstart', markCellOnTouch);
    document.addEventListener('mousemove', onDocumentMouseMove);

    return () => {
      document.removeEventListener('click', markCellOnClick);
      document.removeEventListener('touchstart', markCellOnTouch);
      document.removeEventListener('mousemove', onDocumentMouseMove);
    };
  };

  useEffect(addGridInteraction, [
    markCellOnClick,
    markCellOnTouch,
    onDocumentMouseMove,
    shipwrecksModels,
    scene,
  ]);

  if (!planes.length && gameState === 'InGame') {
    const createdPlanes = gridCreator.createPlanes(
      battlePlaneMaterial,
      additionalX,
      planeDefaultHeight,
      additionalZ,
    );
    const markedPlanes = markTouched3DPlanes(createdPlanes, enemyBattlefield);
    markedPlanes.forEach((plane) => scene.add(plane));
    scene.add(grid);
    dispatch(setEnemyPlanes(markedPlanes));
  }

  let renderedShips = shipwrecksModels.map((shipScene, index) => (
    <primitive key={`shipwreck-${index}`} object={shipScene} position={shipScene.position} />
  ));

  if (shipwrecksConfigs.length !== shipwrecksModels.length) {
    const addModel = (model3D: Object3D) => dispatch(addShipwreckModel(model3D));
    const newModels = [];
    for (let i = 0; i < shipwrecksConfigs.length; i += 1) {
      const existingModel = shipwrecksModels.find((model) => model.userData.index === i);
      if (!existingModel) {
        newModels.push(
          <ShipInitialization
            key={`shipwreck-new-${i}`}
            index={i}
            config={shipwrecksConfigs[i]}
            reference={addModel}
          />,
        );
      }
    }
    renderedShips = renderedShips.concat(newModels);
  }

  return <Suspense fallback={<LoadingBox />}>{renderedShips}</Suspense>;
};

export default Enemy3DBattlefield;
