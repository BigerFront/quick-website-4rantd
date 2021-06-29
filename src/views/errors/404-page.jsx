import React from 'react';

import { useLocation } from 'react-router-dom';
import { Button } from 'antd';

export default function PageNotFound(props) {
  let location = useLocation();
  const { pathname } = location;
  return (
    <div className="error-page">
      <h1>404</h1>
      <div className="error-cloak__wrapper">
        <div className="error-cloak__container">
          <div className="error-cloak"></div>
        </div>
      </div>

      <div className="error-page__info">
        <h2>We can't find that page</h2>
        <p>
          We're fairly sure that page used to be here, but seems to have gone
          missing. We do apologise on it's behalf.
        </p>
        <div className="btn-wrapper">
          <Button type="text" className="home-btn" shape="round" size="large">
            GO Home
          </Button>
        </div>
      </div>
    </div>
  );
}
