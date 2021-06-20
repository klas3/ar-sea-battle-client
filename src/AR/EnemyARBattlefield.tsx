import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  arEnemyBattlefieldPlaneColor,
  arEnemyPlaneMaterial,
  enemyBattlefieldAdditionalX,
  enemyBattlefieldAdditionalZ,
} from '../other/battleMapConfigs';
import { enemyArPlaneIdName } from '../other/constants';
import { setSelectedEnemyPosition } from '../redux/actions';
import store from '../redux/store';
import ARPlanes from './ARPlanes';
import ARShips from './ARShips';

const EnemyARBattlefield = () => {
  const enemyPositions = useAppSelector((state) => state.game.enemyBattlefield);
  const shipwrecksConfigs = useAppSelector((state) => state.game.shipwrecksConfigs);
  const dispatch = useAppDispatch();

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
      <ARShips
        configs={shipwrecksConfigs}
        additionalX={enemyBattlefieldAdditionalX}
        additionalZ={enemyBattlefieldAdditionalZ}
      />
      <ARPlanes battlefield={enemyPositions} type="enemy" />
    </>
  );
};

export default EnemyARBattlefield;
