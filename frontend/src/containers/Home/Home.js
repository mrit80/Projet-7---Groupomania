import React from 'react';

// Logo
import logo from '../../images/logo.png';

// Styles
import './Home.css';

const Home = () => {
  return (
    <div className="background_image">
      <img src={logo} className="logo" alt="Logo de Groupomania" />
      <div className="welcome">
        <h3 className="title">Bienvenue</h3>
        <p className="message">
          Faites connaissance et discutez avec vos collègues !
        </p>
      </div>
    </div>
  );
};

export default Home;
