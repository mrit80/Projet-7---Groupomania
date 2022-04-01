import React, { useContext } from 'react';
import { AuthContext } from '../../context/auth-context';

// Icones
import close from '../../images/close-icon.svg';

// Components
import NavBtn from '../Buttons/NavBtn/NavBtn';

const NavLogin = (props) => {
  // Authentication
  const auth = useContext(AuthContext);

  return (
    <>
      <NavBtn
        icon={close}
        name="annuler"
        link={`/profile/${auth.userId}`}
        iconColor="icon_white"
      />
    </>
  );
};

export default NavLogin;
