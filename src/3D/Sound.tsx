import { useEffect, useMemo } from 'react';
import { useThree } from 'react-three-fiber';
import { AudioListener, PositionalAudio } from 'three';
import { useAppSelector } from '../hooks/reduxHooks';
import { audioLoader } from '../other/tools';

const Sound = () => {
  const { camera } = useThree();

  const { maxDistance, path } = useAppSelector((state) => state.audio);

  const listener = useMemo(() => {
    const audioListener = new AudioListener();
    camera.add(audioListener);
    return audioListener;
  }, [camera]);

  const sound = useMemo(() => new PositionalAudio(listener), [listener]);

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
