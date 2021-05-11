import { useEffect, useMemo } from 'react';
import { useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { useAppSelector } from '../hooks/reduxHooks';

const Sound = () => {
  const { camera } = useThree();

  const { maxDistance, path } = useAppSelector((state) => state.audio);

  const listener = useMemo(() => {
    const audioListener = new THREE.AudioListener();
    camera.add(audioListener);
    return audioListener;
  }, [camera]);

  const sound = useMemo(() => new THREE.PositionalAudio(listener), [listener]);

  const audioLoader = new THREE.AudioLoader();

  audioLoader.load(path, (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setRefDistance(maxDistance);
    sound.play();
  });

  useEffect(() => {
    return () => {
      camera.remove(listener);
      sound.disconnect();
    };
  }, [camera, listener, sound]);

  return null;
};

export default Sound;
