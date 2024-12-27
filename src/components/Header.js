import React from 'react';
import './Header.css';

const Header = () => (
  <header className="header">
    <div style={{display:"flex", gap:"20px", margin:"5px 0"}}>
      {/* <img src="/logo.jpeg" alt="LeadLens Logo" className="logo" /> */}
      <h1>LeadLens</h1>
    </div>
    <p>Your one-stop solution for effective lead generation!</p>
  </header>
);

export default Header;
