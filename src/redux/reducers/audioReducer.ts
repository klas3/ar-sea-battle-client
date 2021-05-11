import { battlefieldSize } from '../../other/constants';
import { AudioAction, AudioState } from '../types';

const defaultState: AudioState = {
  path: 'audio/ocean.mp3',
  maxDistance: battlefieldSize ** 2,
};

const audioReducer = (state = defaultState, action: AudioAction) => {
  if (action.type === 'SetAudio' && action.payload) {
    const { path, maxDistance } = action.payload;
    return { path, maxDistance };
  }
  return state;
};

export default audioReducer;
