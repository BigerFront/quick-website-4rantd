import React, { PureComponent } from 'react';
import { Divider } from 'antd';
import BraveIcon from '~/ui/brave-icon';

export default class FooterPage extends PureComponent {
  state = {
    sitemapVisible: true,
  };

  renderMapSite() {
    return <div className="foot-page__header"> footer Header</div>;
  }

  renderContent() {
    return <div className="foot-page__main">footer Content</div>;
  }

  renderDivider() {
    return (
      <Divider
        className="qk-foot-divider"
        style={{ margin: '2px 4px', color: '#fff', borderTopColor: '#fff' }}
      />
    );
  }

  renderCopyRight() {
    return (
      <>
        <div className="qk-foot__container copyright">
          <div className="cpybar-text">
            <BraveIcon
              type="brave-quick"
              style={{ fontSize: '1.5rem' }}
            ></BraveIcon>
            <span>Copyright © 2021 All rights reserved.</span>
          </div>
          <div className="cpybar-sitemap"></div>
          <div className="cpybar-intl">京ICP备xxx号</div>
        </div>
      </>
    );
  }

  render() {
    // const { xxx } = this.props;

    return <div className="qk-foot">{this.renderCopyRight()}</div>;
  }
}
