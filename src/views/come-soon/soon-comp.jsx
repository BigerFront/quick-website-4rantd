import React from 'react';

import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { HOME_NESTED_ROOT } from '~/router/routes-consts';

export default function ComeSoonPage(props) {
  const { title } = props;
  let history = useHistory();

  return (
    <div className="soon-page">
      <h1>Come Soon</h1>
      <div className="soon-cloak__wrapper">
        <div className="soon-cloak__container">
          <div className="soon-cloak"></div>
        </div>
      </div>

      <div className="soon-page__info">
        <h2>{title || 'Using Help'}</h2>
        <p>We are stepping up to improve this part of the content.</p>
        <div className="btn-wrapper">
          <Button
            type="text"
            className="home-btn"
            shape="round"
            size="large"
            onClick={() => {
              history.push(HOME_NESTED_ROOT);
            }}
          >
            GO Home
          </Button>
        </div>
      </div>
    </div>
  );
}
