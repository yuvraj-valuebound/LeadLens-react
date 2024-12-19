import React from 'react';
import './Loader.css';

const Loader = ({ message }) => (
  <div className="loader">
    <div className="spinner"></div>
    <p>{message}</p>
  </div>
);

export default Loader;
