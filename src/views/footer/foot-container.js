import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import FooterPage from './foot-comp.jsx';

/**
 *
 * @module: footer 
 * @Created: BAS 21-06-29 15:16 Tuesday
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
)(FooterPage);
