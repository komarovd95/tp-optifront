import React from 'react';
import { Link } from 'react-router';


const NavLinks = () => (
  <div className="left item">
    <Link to="/" className="header item">
      <img className="logo" src={require('../../images/logo.png')} />
    </Link>
    <Link to="/routes/new" className="item" activeClassName="active">
      Новый маршрут
    </Link>
    <Link to="about" className="item" activeClassName="active">
      О программе
    </Link>
    <Link to="faq" className="item" activeClassName="active">
      FAQ
    </Link>
  </div>
);

export default NavLinks;
