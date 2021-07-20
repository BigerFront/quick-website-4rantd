import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import Routes from '../router';

const isDevMode = process.env.NODE_ENV === 'development';

class RootIndex extends PureComponent {
  state = {};

  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        {isDevMode ? (
          <HashRouter history={history} hashType="slash">
            <Routes />
          </HashRouter>
        ) : (
          <BrowserRouter history={history}>
            <Routes />
          </BrowserRouter>
        )}
      </Provider>
    );
  }
}

export default hot(module)(RootIndex);
