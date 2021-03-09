import * as THREE from 'three';
import { gridCellsCount, gridSize } from './constants';

class GridCreator {
  public createGrid = (additionalX: number, additionalY: number, additionalZ: number) => {
    const gridHelper = new THREE.GridHelper(gridSize, gridCellsCount);
    gridHelper.position.y += additionalY;
    gridHelper.position.x += additionalX;
    gridHelper.position.z += additionalZ;
    return gridHelper;
  };

  public addPlanes = (
    material: THREE.MeshBasicMaterialParameters,
    additionalX: number,
    additionalY: number,
    additionalZ: number,
  ) => {
    const geometrySize = gridSize / gridCellsCount;
    const geometry = new THREE.PlaneGeometry(geometrySize, geometrySize);
    geometry.rotateX(-Math.PI / 2);

    const createdPlanes: THREE.Mesh[] = [];
    for (let i = 0; i < gridCellsCount * gridCellsCount; i += 1) {
      const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial(material));
      plane.userData = { index: i };

      plane.position.set(
        Math.floor(i / gridCellsCount) * geometrySize - gridSize / 2 + gridCellsCount + additionalX,
        additionalY,
        (i % gridCellsCount) * geometrySize - gridSize / 2 + gridCellsCount + additionalZ,
      );

      createdPlanes.push(plane);
    }

    return createdPlanes;
  };
}

const gridCreator = new GridCreator();

export default gridCreator;
