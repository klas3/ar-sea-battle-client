import { Suspense, useEffect, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import LoadingBox from '../models3D/LoadingBox';
import Model3D from '../models3D/Model3D';
import { diractionalRay, planeDefaultHeight, raycaster } from '../other/constants';
import gridCreator from '../other/gridHelper';
import gameService from '../services/gameService';

interface IProps {
  additionalX?: number;
  additionalZ?: number;
}

const ArrangementBattlefield = (props: IProps) => {
  const [planes, setPlanes] = useState<THREE.Mesh[]>([]);
  const { scene, camera, gl: renderer } = useThree();
  const { additionalX = 0, additionalZ = 0 } = props;

  const draggableLimit = {
    min: new THREE.Vector3(-160, 1, -100),
    max: new THREE.Vector3(160, 1, 100),
  };

  const addGridInteraction = () => {
    const planes = gridCreator.addPlanes(
      { color: 'green', visible: false },
      additionalX,
      planeDefaultHeight,
      additionalZ,
    );
    planes.forEach((plane) => scene.add(plane));
    setPlanes(planes);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(addGridInteraction, []);

  const render = () => {
    gameService.ships.forEach((ship) => ship.userData.update());
    renderer.render(scene, camera);
  };

  const registerShipModel = (gltf: GLTF) => gameService.addShip(gltf);

  const markCell = (event: THREE.Event) => {
    const position = event.object.position;
    position.set(position.x, planeDefaultHeight, position.z);

    raycaster.set(position, diractionalRay);
    const intersects = raycaster.intersectObjects(planes);
    if (intersects.length === 0) {
      return;
    }

    planes.forEach((plane) => ((plane.material as THREE.MeshBasicMaterial).visible = false));
    intersects.forEach((intersect) => {
      const material = planes[intersect.object.userData.index].material as THREE.MeshBasicMaterial;
      material.visible = true;
    });
  };

  scene.add(gridCreator.createGrid(additionalX, planeDefaultHeight, additionalZ));

  useFrame(render);

  return (
    <Suspense fallback={<LoadingBox />}>
      <Model3D
        onDrag={markCell}
        reference={registerShipModel}
        scale={0.005}
        draggableLimit={draggableLimit}
        position={[-140, 1, 80]}
        path={'models/small-ship.glb'}
      />
      <Model3D
        onDrag={markCell}
        reference={registerShipModel}
        scale={1.4}
        draggableLimit={draggableLimit}
        position={[-140, 1, -80]}
        path={'models/large-ship.glb'}
      />
    </Suspense>
  );
};

export default ArrangementBattlefield;
