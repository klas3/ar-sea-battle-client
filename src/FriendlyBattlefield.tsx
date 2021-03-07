import { useEffect, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';

const gridCellsCount = 10;
const gridSize = 200;
const planeDefaultHeight = 1;
const planeMaterial = { visible: false, color: 'red' };

interface IProps {
  additionalX?: number;
  additionalZ?: number;
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const FriendlyBattlefield = (props: IProps) => {
  const [planes, setPlanes] = useState<THREE.Mesh[]>([]);
  const { scene, camera, gl: renderer } = useThree();

  const { additionalX = 0, additionalZ = 0 } = props;

  const addGridInteraction = () => {
    const geometrySize = gridSize / gridCellsCount;
    const geometry = new THREE.PlaneGeometry(geometrySize, geometrySize);
    geometry.rotateX(-Math.PI / 2);
    const createdPlanes: THREE.Mesh[] = [];
    for (let i = 0; i < gridCellsCount * gridCellsCount; i += 1) {
      const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial(planeMaterial));
      plane.userData = { i };
      plane.position.set(
        Math.floor(i / gridCellsCount) * geometrySize - gridSize / 2 + gridCellsCount + additionalX,
        planeDefaultHeight,
        (i % gridCellsCount) * geometrySize - gridSize / 2 + gridCellsCount + additionalZ,
      );
      scene.add(plane);
      createdPlanes.push(plane);
    }
    setPlanes(createdPlanes);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(addGridInteraction, []);

  const render = () => renderer.render(scene, camera);

  const gridHelper = new THREE.GridHelper(gridSize, gridCellsCount);
  gridHelper.position.y += 1;
  gridHelper.position.x += additionalX;
  gridHelper.position.z += additionalZ;
  scene.add(gridHelper);

  const markCell = (mouseX: number, mouseY: number) => {
    mouse.x = mouseX;
    mouse.y = mouseY;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planes);
    if (intersects.length > 0) {
      console.log(intersects[0].object.userData);
      const material = planes[intersects[0].object.userData.i as number]
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

export default FriendlyBattlefield;
