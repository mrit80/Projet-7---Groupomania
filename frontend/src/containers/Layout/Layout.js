import React from 'react';
import { withRouter } from 'react-router-dom';
import { useWindowDimensions } from '../../hooks/window-hook';

// Components
import Nav from '../../components/Nav/Nav';
import Menu from '../Menu/Menu';

// Styles
import './Layout.css';

const Layout = (props) => {
  // Taille de la fenêtre
  const { width } = useWindowDimensions();
  // App path
  const path = props.location.pathname;

  const mobileLayout = (
    <>
      <main className="home_wrapper">{props.children}</main>
      <Nav />
    </>
  );

  const desktopLayout = (
    <>
      <div className="desktop_wrap">
        <Menu />
        <main className="wrapper">{props.children}</main>
      </div>
    </>
  );

  // Mobile
  if (width <= 1023) {
    return mobileLayout;
  }

  // Desktop
  if (width >= 1024) {
    switch (path) {
      case '/':
        return mobileLayout;
      case '/login':
        return mobileLayout;
      case '/signup':
        return mobileLayout;
      default:
        return desktopLayout;
    }
  }
};

export default withRouter(Layout);
