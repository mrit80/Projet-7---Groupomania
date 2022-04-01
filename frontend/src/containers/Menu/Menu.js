import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useWindowDimensions } from '../../hooks/window-hook';
import { useHttpRequest } from '../../hooks/httpRequest-hook';
import { AuthContext } from '../../context/auth-context';

// Image de base
import GenProfile from '../../images/generic_profile_picture.jpg';

// Icones
import person from '../../images/person-icon.svg';
import logout from '../../images/logout-icon.svg';
import posts from '../../images/posts-icon.svg';

// Components
import Spinner from '../../components/LoadingSpinner/LoadingSpinner';

// Styles
import styles from './Menu.module.css';

const Menu = () => {
  // Authentication
  const auth = useContext(AuthContext);

  // Requête Backend Hook
  const { isLoading, sendRequest } = useHttpRequest();

  // Taille de la fenêtre
  const { width } = useWindowDimensions();

  // History context
  const history = useHistory();

  // Profil Hook
  const [profileData, setProfileData] = useState();

  //Fetch Most recent posts
  useEffect(() => {
    let mounted = true;

    if (auth.token && auth.userId) {
      const fetchPosts = async () => {
        try {
          const userData = await sendRequest(
            `${process.env.REACT_APP_API_URL}/profile/${auth.userId}`,
            'GET',
            null,
            {
              Authorization: 'Bearer ' + auth.token,
            }
          );
          if (mounted) {
            setProfileData(userData);
          }
        } catch (err) {}
      };
      fetchPosts();
    }

    return () => (mounted = false);
  }, [sendRequest, auth.token, auth.userId, setProfileData]);

  const logoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    history.push(`/`);
  };

  // Afficher les Navlinks en desktop
  let navLinks;
  if (width >= 1024) {
    navLinks = (
      <>
        <Link to="/posts" className={`${styles.btn} ${styles.border}`}>
          <span className={styles.text}>Publications</span>
          <img className={`${styles.icon} icon_white`} src={posts} alt="" />
        </Link>
      </>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className="spinner">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <>
        <div className={styles.container}>
          <h2>Pas d'informations</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <>
        {!isLoading && profileData && (
          <div className={styles.cover}>
            <div className={styles.background_img}></div>
            <div className={styles.wrapper}>
              <img
                src={profileData.photo_url || GenProfile}
                className={styles.profile_photo}
                alt={`${profileData.firstName} ${profileData.lastName}`}
              />
              <div className={styles.hero_block}>
                <h2 className={styles.title}>
                  Bienvenue {profileData.firstName} !
                </h2>
              </div>
            </div>
            <nav className={styles.list}>
              <Link
                to={`profile/${auth.userId}`}
                className={`${styles.btn} ${styles.border}`}
              >
                <span className={styles.text}>Mon profil</span>
                <img
                  className={`${styles.icon} icon_white`}
                  src={person}
                  alt=""
                />
              </Link>
              {navLinks}
              <button
                className={`${styles.btn} ${styles.logout_margin}`}
                onClick={logoutHandler}
              >
                <span className={styles.text}>Se Déconnecter</span>
                <img
                  className={`${styles.icon} icon_white`}
                  src={logout}
                  alt=""
                />
              </button>
            </nav>
          </div>
        )}
      </>
    </>
  );
};

export default Menu;
