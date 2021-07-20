import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import HeaderPage from './header-comp.jsx';

/**
 *
 * @module: home-header 
 * @Created: BAS 21-06-29 09:21 Tuesday
 * make state inject into react dom props
 *
 */
const mapStateToProps = (state) => {
  const { skinState:{header} } = state; // global state contains skinState ... ed.

  return {
    header,
  };
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
)(HeaderPage);
