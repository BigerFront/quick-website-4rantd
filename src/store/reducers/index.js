import { combineReducers } from 'redux';

import { connectRouter } from 'connected-react-router';
import skinStateReducer from './skin';

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    skinState: skinStateReducer,
  });

export default createRootReducer;
