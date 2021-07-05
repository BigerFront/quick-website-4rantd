import React, { PureComponent } from 'react';

import { Avatar, Image, Button } from 'antd';

import BraveIcon from '~UI/brave-icon';
import Logo from '~Assets/icons/logo.png';
import { ABOUT_NESTED_ROOT, HOME_NESTED_ROOT } from '~/router/routes-consts';

import { appTitle } from '~/lib/env-conf';

export default class HeaderPage extends PureComponent {
  state = {};

  renderLogo() {
    return (
      <>
        <Avatar
          size={40}
          src={<Image src={Logo} preview={false} alt="logo" />}
        ></Avatar>
        <span className="qk-app-title">{appTitle}</span>
      </>
    );
  }

  gotoHelp = () => {
    const { history } = this.props;
    const { location } = history;
    if (location.pathname !== ABOUT_NESTED_ROOT) {
      history.push(ABOUT_NESTED_ROOT);
    }
  };

  gotoRoutePage = (path) => {
    const { history } = this.props;
    const { location } = history;
    if (location.pathname !== path) {
      history.push(path);
    }
  };

  renderNavMenus() {
    return (
      <div className="qk-header__nav">
        <Button
          type="text"
          size="large"
          onClick={this.gotoRoutePage.bind(this, HOME_NESTED_ROOT)}
          icon={<BraveIcon type="brave-ninja" />}
        >
          首页
        </Button>
        <Button
          type="text"
          size="large"
          onClick={this.gotoRoutePage.bind(this, ABOUT_NESTED_ROOT)}
        >
          关于我们
        </Button>
      </div>
    );
  }

  renderActions() {
    return (
      <>
        <div className="qk-header-navmenu">
          <Button
            type="text"
            size="large"
            onClick={this.gotoRoutePage.bind(this, ABOUT_NESTED_ROOT)}
          >
            简体中文
          </Button>
        </div>
      </>
    );
  }

  render() {
    // const { xxx } = this.props;

    return (
      <div className="qk-header">
        <div className="qk-header__logo">{this.renderLogo()}</div>
        {this.renderNavMenus()}
        <div className="qk-header__actions">{this.renderActions()}</div>
      </div>
    );
  }
}
