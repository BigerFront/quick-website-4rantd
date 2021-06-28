import { createStore, applyMiddleware, compose } from 'redux';
import { ThunkMiddleware } from 'redux-thunk';

import { createLogger } from 'redux-logger';
