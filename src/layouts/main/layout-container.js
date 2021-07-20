import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MainLayoutComp from './main-layout';

const mapStateToProps = (state, ownProps) => {
  const {
    skinState: { header },
  } = state;

  const { visible } = header;
  return {
    headerVisible: visible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MainLayoutComp);
