import { PlanesAction } from '../types';

const defaultState: THREE.Mesh[] = [];

const planesReducer = (state = defaultState, action: PlanesAction) => {
  if (action.type === 'SetPlanes' && action.payload) {
    state = action.payload;
    return state;
  }
  return state;
};

export default planesReducer;
