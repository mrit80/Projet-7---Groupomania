import React from 'react';

// Icones
import close from '../../images/close-icon.svg';

// Components
import ActionBtn from '../Buttons/ActionBtn/ActionBtn';

const NavMenu = (props) => {
  return (
    <>
      <ActionBtn
        icon={close}
        name="fermer"
        onClick={props.backHandle}
        iconColor="icon_white"
      />
    </>
  );
};

export default NavMenu;
