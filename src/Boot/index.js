import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory, createHashHistory } from 'history';

// import '~/styles/preload-style.css';
import './index.scss';

import configurationStore, { initialState } from '~/store';

import Root from './root-comp';

export const history =
  process.env.NODE_ENV === 'development'
    ? createHashHistory()
    : createBrowserHistory();

const store = configurationStore(initialState, history);

ReactDOM.render(
  <Root store={store} history={history} />,
  document.getElementById('Root')
);
