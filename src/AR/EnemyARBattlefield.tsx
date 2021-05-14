import { useEffect } from 'react';
import { useAppSelector } from '../hooks/reduxHooks';
import { arCoordsСoefficient } from '../other/constants';

const EnemyARBattlefield = () => {
  const planes = useAppSelector((state) => state.ships.planes);

  const renderedPlanes = planes.map((plane) => {
    const { index } = plane.userData;
    const { x, z } = plane.position;
    const position = `${x / arCoordsСoefficient} ${0} ${z / arCoordsСoefficient}`;
    return (
      // @ts-ignore
      <a-box
        id={index}
        material="transparent: true; opacity: 0.5;"
        key={index}
        position={position}
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
          this.el.setAttribute('material', 'color: red;');
        });
      },
    });
  }

  return <>{renderedPlanes}</>;
};

export default EnemyARBattlefield;
