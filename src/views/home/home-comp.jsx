import React, { PureComponent } from 'react';

export default class HomePage extends PureComponent {
  state = {};

  renderHeader() {
    return <div className="home-page__header"> home Header</div>;
  }

  renderContent() {
    return <div className="home-page__main">home sdsdf</div>;
  }

  renderFooter() {
    return <div className="home-page__footer">home Footer</div>;
  }

  render() {
    // const { xxx } = this.props;

    return (
      <div className="home-page">
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderFooter()}
      </div>
    );
  }
}
