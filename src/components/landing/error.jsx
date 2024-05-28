/* eslint-disable react/prop-types */
import React from 'react';
import './error.css';

const Error = (props) => {
  const {
    msg,
  } = props;

  return (
    <div>

      <h1 className='error-msg'>{msg}</h1>
      <span className="error-close" onClick={close}>retry</span>


    </div>
  );
};
export default Error;
