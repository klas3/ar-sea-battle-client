import { useAppSelector } from '../hooks/reduxHooks';
import { arCoordsСoefficient } from '../other/constants';

const EnemyARBattlefield = () => {
  const { planes } = useAppSelector((state) => state.ships);

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
        clickhandler
      />
    );
  });

  if (!AFRAME.components.clickhandler) {
    AFRAME.registerComponent('clickhandler', {
      init: function () {
        this.el.addEventListener('click', () => {
          this.el.setAttribute('material', 'color: red;');
        });
      },
    });
  }

  return (
    // @ts-ignore
    <a-marker preset="hiro"> {renderedPlanes}</a-marker>
  );
};

export default EnemyARBattlefield;
