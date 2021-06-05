import { useCallback, useEffect, useMemo, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Mesh, MeshBasicMaterial } from 'three';
import { planeDefaultHeight, battlePlaneMaterial } from '../other/constants';
import gridCreator from '../other/gridHelper';
import { mouse, raycaster } from '../other/tools';
import { enemyBattlefieldGridName } from '../other/battleMapConfigs';

interface IProps {
  additionalX?: number;
  additionalZ?: number;
}

const Enemy3DBattlefield = (props: IProps) => {
  const [planes, setPlanes] = useState<Mesh[]>([]);
  const { scene, camera, gl: renderer } = useThree();

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
      mouse.x = mouseX;
      mouse.y = mouseY;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planes);
      if (intersects.length > 0) {
        const material = planes[intersects[0].object.userData.index].material as MeshBasicMaterial;
        material.visible = true;
      }
    },
    [camera, planes],
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

  const addGridInteraction = () => {
    if (!planes.length) {
      const createdPlanes = gridCreator.createPlanes(
        battlePlaneMaterial,
        additionalX,
        planeDefaultHeight,
        additionalZ,
      );
      createdPlanes.forEach((plane) => scene.add(plane));
      scene.add(grid);
      setPlanes(createdPlanes);
    }

    document.addEventListener('click', markCellOnClick);
    document.addEventListener('touchstart', markCellOnTouch);

    return () => {
      document.removeEventListener('click', markCellOnClick);
      document.removeEventListener('touchstart', markCellOnTouch);
    };
  };

  useEffect(addGridInteraction, [
    additionalX,
    additionalZ,
    scene,
    markCellOnClick,
    markCellOnTouch,
    grid,
    planes,
  ]);

  return null;
};

export default Enemy3DBattlefield;
