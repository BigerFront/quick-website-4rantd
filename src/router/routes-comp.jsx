import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';

import { ROOT_PATH } from './routes-consts';

import MainLayout from '~Layouts/main';
import { PageNotFound } from '~Views/errors';

export default class RoutesComp extends PureComponent {
  state = {};

  render() {
    return (
      <Switch>
        {/** Keep DEFAULT_ROUTE at last */}
        <Route path={ROOT_PATH} component={MainLayout} />
        <Route component={PageNotFound} exact />
      </Switch>
    );
  }
}
