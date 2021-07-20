import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import HomePage from './home-comp.jsx';

/**
 *
 * @module: home
 * @Created: lamborc 21-06-28 10:47 Monday
 * make state inject into react dom props
 *
 */
const mapStateToProps = (state) => {
  const { skinState } = state; // global state contains braveState,skinState ... ed.

  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    // doSomeThing:(arg1,arg2) => (dispatch) => {
    //   ...
    //   dispatch(action);
    // },
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(HomePage);
