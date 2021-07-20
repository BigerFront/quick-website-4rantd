import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import AboutPage from './about-comp.jsx';

/**
 *
 * @module: about 
 * @Created: lamborc 21-07-05 10:02 Monday
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
)(AboutPage);
