import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  arEnemyBattlefieldPlaneColor,
  arMarkedEnemyPlaneMaterial,
  arEnemyPlaneMaterial,
  crossTextureFilePath,
  dotTextureFilePath,
} from '../other/battleMapConfigs';
import { arCoordsСoefficient, enemyArPlaneIdName } from '../other/constants';
import gridCreator from '../other/gridHelper';
import { setSelectedEnemyPosition } from '../redux/actions';
import store from '../redux/store';

const EnemyARBattlefield = () => {
  // TODO: test
  useAppSelector((state) => state.game.turn);
  const enemyPositions = useAppSelector((state) => state.game.enemyBattlefield);
  const dispatch = useAppDispatch();

  const planes = useMemo(() => gridCreator.createPlanes(), []);

  const renderedPlanes = planes.map((plane, planeIndex) => {
    const enemyPosition = enemyPositions[planeIndex];
    const { index } = plane.userData;
    const { x, z } = plane.position;
    const id = `${enemyArPlaneIdName}${index}`;
    const position = `${x / arCoordsСoefficient} ${0} ${z / arCoordsСoefficient}`;
    const material =
      enemyPosition === undefined ? arEnemyPlaneMaterial : arMarkedEnemyPlaneMaterial;
    const texture =
      enemyPosition === undefined
        ? ''
        : enemyPosition === -1
        ? dotTextureFilePath
        : crossTextureFilePath;
    return (
      // @ts-ignore
      <a-box
        id={id}
        material={material}
        key={index}
        position={position}
        src={texture}
        depth="0.2"
        height="0.01"
        width="0.2"
        class="box"
        clickhandler
      />
    );
  });

  useEffect(() => {
    const scene = AFRAME.scenes[0];
    if (!scene) {
      return;
    }
    const mouseCursor = document.createElement('a-entity');
    mouseCursor.setAttribute('cursor', 'rayOrigin', 'mouse');
    mouseCursor.setAttribute('raycaster', 'objects: .box;');
    scene.appendChild(mouseCursor);
    return () => {
      scene.removeChild(mouseCursor);
    };
  }, []);

  if (!AFRAME.components.clickhandler) {
    AFRAME.registerComponent('clickhandler', {
      init: function () {
        this.el.addEventListener('click', () => {
          const { turn, enemyBattlefield } = store.getState().game;
          if (turn !== 'You') {
            return;
          }
          const parsedIndex = Number.parseInt(this.el.id.slice(enemyArPlaneIdName.length));
          if (Number.isNaN(parsedIndex) || enemyBattlefield[parsedIndex] !== undefined) {
            return;
          }
          document
            .getElementById(`${enemyArPlaneIdName}${parsedIndex}`)
            ?.setAttribute('material', `color: ${arEnemyBattlefieldPlaneColor};`);
          enemyBattlefield.forEach((position, index) => {
            if (position === undefined) {
              document
                .getElementById(`${enemyArPlaneIdName}${index}`)
                ?.setAttribute('material', arEnemyPlaneMaterial);
            }
          });
          this.el.setAttribute('material', 'color: red;');
          dispatch(setSelectedEnemyPosition(parsedIndex));
        });
      },
    });
  }

  return (
    <>
      {/* @ts-ignore */}
      <a-entity gltf-model="models/sea.glb" scale="0.013 0.013 0.013" position="0.2 -0.1 -0.2" />
      {renderedPlanes}
    </>
  );
};

export default EnemyARBattlefield;
