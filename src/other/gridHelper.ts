import { GridHelper, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';
import { battlefieldSize, gridSize } from './constants';

class GridCreator {
  public createGrid = (additionalX: number, additionalY: number, additionalZ: number) => {
    const gridHelper = new GridHelper(gridSize, battlefieldSize);
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
    const geometrySize = gridSize / battlefieldSize;
    const geometry = new PlaneGeometry(geometrySize, geometrySize);
    geometry.rotateX(-Math.PI / 2);

    const createdPlanes: THREE.Mesh[] = [];
    for (let i = 0; i < battlefieldSize ** 2; i += 1) {
      const plane = new Mesh(geometry, new MeshBasicMaterial(material));
      plane.userData = { index: i };

      plane.position.set(
        (i % battlefieldSize) * geometrySize - gridSize / 2 + battlefieldSize + additionalZ,
        additionalY,
        Math.floor(i / battlefieldSize) * geometrySize -
          gridSize / 2 +
          battlefieldSize +
          additionalX,
      );

      createdPlanes.push(plane);
    }

    return createdPlanes;
  };
}

const gridCreator = new GridCreator();

export default gridCreator;
