import React, { PureComponent } from 'react';

import { Layout } from 'antd';
import { Switch, Route } from 'react-router-dom';

import {
  ROOT_PATH,
  HOME_NESTED_ROOT,
  ABOUT_NESTED_ROOT,
} from '~/router/routes-consts';
/** Views */
import { PageNotFound } from '~Views/errors';
import HeaderComp from '~Views/header/home-header';
import FooterComp from '~Views/footer';
import HomePage from '~Views/home';
import AboutPage from '~Views/about';
import ComeSoon from '~Views/come-soon';

const { Content, Footer, Header } = Layout;

export default class MainLayoutComp extends PureComponent {
  state = {};

  componentDidMount() {
    // console.log('>>>>>>>>>>>>>>mainLayout>>>>>>>>>>');
  }

  renderHeader() {
    return (
      <Header className="main-layout__header qk-dark">
        <HeaderComp />
      </Header>
    );
  }

  renderMainContent() {
    return (
      <Content className="main-layout__content">
        <Switch>
          <Route path={HOME_NESTED_ROOT} component={HomePage} exact />
          <Route path={ABOUT_NESTED_ROOT} component={ComeSoon} exact />
          <Route path={ROOT_PATH} component={HomePage} exact />
          <Route component={PageNotFound} />
        </Switch>
      </Content>
    );
  }

  renderFooter() {
    return (
      <Footer className="main-layout__footer">
        <FooterComp />
      </Footer>
    );
  }
  render() {
    return (
      <Layout className="main-layout">
        {this.renderHeader()}
        {this.renderMainContent()}
        {this.renderFooter()}
      </Layout>
    );
  }
}
