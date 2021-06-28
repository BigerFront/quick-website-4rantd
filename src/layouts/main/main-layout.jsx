import React, { PureComponent } from 'react';

import { Layout } from 'antd';
import { Switch, Route } from 'react-router-dom';

import { ROOT_PATH, HOME_NESTED_ROOT } from '~/router/routes-consts';
/** Views */
import { PageNotFound } from '~Views/errors';
import HomePage from '~Views/home';

const { Content, Footer, Header } = Layout;

export default class MainLayoutComp extends PureComponent {
  state = {};

  componentDidMount() {
    // console.log('>>>>>>>>>>>>>>mainLayout>>>>>>>>>>');
  }

  renderMainContent() {
    return (
      <Content className="main-layout__content">
        <Switch>
          <Route path={HOME_NESTED_ROOT} component={HomePage} />
          <Route path={ROOT_PATH} component={HomePage} exact />
          <Route component={PageNotFound} />
        </Switch>
      </Content>
    );
  }

  render() {
    return (
      <Layout className="main-layout">
        <Header className="main-layout__header qk-dark">Header</Header>
        {this.renderMainContent()}
        <Footer className="main-layout__footer">Footer</Footer>
      </Layout>
    );
  }
}
