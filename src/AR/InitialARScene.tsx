import { useEffect } from 'react';
import EnemyARBattlefield from './EnemyARBattlefield';
import FriendlyARBattlefield from './FriendlyARBattlefield';

const InitialARScene = () => {
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
    // @ts-ignore
    <a-scene
      cursor="rayOrigin: mouse;"
      vr-mode-ui="enabled: false"
      arjs="sourceType: webcam; debugUIEnabled: false;"
    >
      <FriendlyARBattlefield />
      <EnemyARBattlefield />
      {/* @ts-ignore */}
      <a-entity camera="userHeight: 1.6"></a-entity>
      {/* @ts-ignore */}
    </a-scene>
  );
};

export default InitialARScene;
