import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import EnemyARBattlefield from './EnemyARBattlefield';
import { togleBattlefield } from '../redux/actions';
import FriendlyARBattlefield from './FriendlyARBattlefield';

const InitialARScene = () => {
  const battlefieldType = useAppSelector((state) => state.game.battlefield);

  const dispatch = useAppDispatch();

  const changeBattlefieldText = battlefieldType === 'friendly' ? 'Enemy' : 'You';

  const battlefield =
    battlefieldType === 'friendly' ? <FriendlyARBattlefield /> : <EnemyARBattlefield />;

  const onBattlefieldButtonClick = () => dispatch(togleBattlefield());

  // eslint-disable-next-line
  useEffect(() => {
    return () => {
      const scene = document.getElementsByTagName('a-scene').item(0);
      if (scene) {
        // @ts-ignore
        scene.renderer.dispose();
      }
      const videos = document.querySelectorAll('[id=arjs-video]');
      if (videos.length) {
        videos.forEach((video) => video.remove());
      }
    };
  }, []);

  return (
    <>
      <button className="change-battlefield-button" onClick={onBattlefieldButtonClick}>
        {changeBattlefieldText}
      </button>
      {/* @ts-ignore */}
      <a-scene
        cursor="rayOrigin: mouse;"
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; debugUIEnabled: false;"
      >
        {/* @ts-ignore */}
        <a-marker type="pattern" preset="custom" url="./markers/pattern.patt">
          {battlefield}
          {/* @ts-ignore */}
        </a-marker>
        {/* @ts-ignore */}
        <a-entity camera="userHeight: 1.6"></a-entity>
        {/* @ts-ignore */}
      </a-scene>
    </>
  );
};

export default InitialARScene;
