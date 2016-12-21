import React from 'react';

const WithProps = (WrappedComponent, additionalProps = {}) => (props) =>
  React.createElement(WrappedComponent, {
    ...additionalProps,
    ...props
  });

export default WithProps;
