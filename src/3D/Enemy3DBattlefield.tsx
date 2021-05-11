import { useEffect, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { planeDefaultHeight, battlePlaneMaterial, raycaster, mouse } from '../other/constants';
import gridCreator from '../other/gridHelper';

interface IProps {
  additionalX?: number;
  additionalZ?: number;
}

const Enemy3DBattlefield = (props: IProps) => {
  const [planes, setPlanes] = useState<THREE.Mesh[]>([]);
  const { scene, camera, gl: renderer } = useThree();

  const { additionalX = 0, additionalZ = 0 } = props;

  const addGridInteraction = () => {
    const planes = gridCreator.addPlanes(
      battlePlaneMaterial,
      additionalX,
      planeDefaultHeight,
      additionalZ,
    );
    planes.forEach((plane) => scene.add(plane));
    setPlanes(planes);
  };

  useEffect(addGridInteraction, [additionalX, additionalZ, scene]);

  const render = () => renderer.render(scene, camera);

  scene.add(gridCreator.createGrid(additionalX, planeDefaultHeight, additionalZ));

  const markCell = (mouseX: number, mouseY: number) => {
    mouse.x = mouseX;
    mouse.y = mouseY;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planes);
    if (intersects.length > 0) {
      const material = planes[intersects[0].object.userData.index]
        .material as THREE.MeshBasicMaterial;
      material.visible = true;
    }
  };

  const markCellOnClick = (event: MouseEvent) =>
    markCell(
      (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    );

  const markCellOnTouch = (event: TouchEvent) =>
    markCell(
      (event.changedTouches[0].clientX / renderer.domElement.clientWidth) * 2 - 1,
      -(event.changedTouches[0].clientY / renderer.domElement.clientHeight) * 2 + 1,
    );

  document.addEventListener('click', markCellOnClick);
  document.addEventListener('touchstart', markCellOnTouch);

  useFrame(render);

  return null;
};

export default Enemy3DBattlefield;
