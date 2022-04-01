import React from 'react';

// Icones
import menu from '../../images/menu-icon.svg';
import post from '../../images/post-icon.svg';

// Components
import NavBtn from '../../components/Buttons/NavBtn/NavBtn';

const NavPost = () => {
  return (
    <>
      <NavBtn
        id="menu"
        name="menu"
        icon={menu}
        link="/menu"
        iconColor="icon_white"
      />
      <NavBtn
        id="post"
        name="publier"
        icon={post}
        link="/posts/new"
        iconColor="icon_white"
      />
    </>
  );
};

export default NavPost;
