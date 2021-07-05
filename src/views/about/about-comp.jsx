import React, { PureComponent } from 'react';

export default class AboutPage extends PureComponent {
  state = {};

  renderHeader() {
    return <div className="index-page__header"> about Header</div>;
  }

  renderContent() {
    return <div className="index-page__main">about Content</div>;
  }

  renderFooter() {
    return <div className="index-page__footer">about Footer</div>;
  }

  render() {
    // const { xxx } = this.props;

    return (
      <div className="index-page">
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderFooter()}
      </div>
    );
  }
}
