import React from 'react';
import { Spinner as Loader } from 'react-bootstrap';

const spinnerStyle = {
  position: 'absolute',
  height: '10rem',
  width: '10rem',
  top: 'calc(50% - 5rem)', //center on page, account for radius
  left: 'calc(50% - 5rem)', //center on page, account for radius
};

const Spinner = () => (
  <Loader style={spinnerStyle} animation="border" variant="primary" />
);

export default Spinner;
