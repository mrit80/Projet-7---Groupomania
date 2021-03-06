import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import { useHttpRequest } from '../../hooks/httpRequest-hook';
import { useForm } from '../../hooks/form-hook';
import { isEmail, MinLength, MaxLength, isText } from '../../utils/validators';
import { useWindowDimensions } from '../../hooks/window-hook';

// Icones
import password from '../../images/password-icon.svg';
import back from '../../images/back-icon.svg';
import deleteIcon from '../../images/delete-icon.svg';

// Components
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import NavBtn from '../../components/Buttons/NavBtn/NavBtn';
import UIBtn from '../../components/Buttons/UIBtn/UIBtn';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import InputField from '../../components/InputField/InputField';
import Spinner from '../../components/LoadingSpinner/LoadingSpinner';

// Styles
import styles from './UpdateProfile.module.css';

const UpdateProfile = () => {
  // Authentication
  const auth = useContext(AuthContext);

  // History context
  const history = useHistory();

  // Taille de la fenêtre
  const { width } = useWindowDimensions();

  // Requête Hook Backend
  const { isLoading, sendRequest } = useHttpRequest();

  // Profile useState
  const [userDataState, setUserDataState] = useState();

  // Supprimer message useState
  const [showInfo, setShowInfo] = useState(false);

  // Confirme model useState
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Form useState
  const [formState, inputHandler, setFormState] = useForm(
    {
      image: {
        value: null,
        isValid: false,
      },
      firstName: {
        value: '',
        isValid: false,
      },
      lastName: {
        value: '',
        isValid: false,
      },
      email: {
        value: '',
        isValid: false,
      },
      role: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  // Fetch User et initialiser le formState
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/profile/${auth.userId}`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.token,
          }
        );
        setUserDataState(userData);
        setFormState(
          {
            image: {
              value: userData.photo_url,
              isValid: false,
            },
            firstName: {
              value: userData.firstName,
              isValid: true,
            },
            lastName: {
              value: userData.lastName,
              isValid: true,
            },
            role: {
              value: userData.role,
              isValid: true,
            },
            email: {
              value: userData.email,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, auth.userId, auth.token, setFormState]);

  // Mettre à jour les données de l'utilisateur
  const updateProfileHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', formState.inputs.image.value);
    formData.append('firstName', formState.inputs.firstName.value);
    formData.append('lastName', formState.inputs.lastName.value);
    formData.append('role', formState.inputs.role.value);
    formData.append('email', formState.inputs.email.value);

    try {
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/profile/update`,
        'PATCH',
        formData,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );

      openConfirmModalHandler();
    } catch (err) {}
  };

  // Mettre à jour le mot de passe de l'utilisateur
  const updatePasswordHandler = async (event) => {
    event.preventDefault();

    try {
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/profile/update`,
        'PUT',
        JSON.stringify({
          password: formState.inputs.password.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );

      // Écran de confirmation
      openConfirmModalHandler();
    } catch (err) {}
  };

  // Souhait de Supprimer l'utilisateur
  const showDeleteMessage = (event) => {
    event.preventDefault();
    if (showInfo === false) {
      setShowInfo(true);
    } else {
      setShowInfo(false);
    }
  };

  //  Supprimer l'utilisateur
  const deleteUserHandler = async (event) => {
    event.preventDefault();

    try {
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/profile/${auth.userId}`,
        'DELETE',
        null,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
      auth.logout();
      history.push(`/`);
    } catch (err) {}
  };

  // Écran de confirmation
  const openConfirmModalHandler = () => {
    setShowConfirmModal(true);
  };

  const closeConfirmModalHandler = () => {
    setShowConfirmModal(false);
    setTimeout(() => {
      history.push(`/profile/${auth.userId}`);
    }, 300);
  };

  //  Affichage Nav desktop
  let desktopNav;

  let btnStyle = styles.btnStyle;
  let iconStyle = `${styles.iconStyle} icon_red`;

  if (width >= 1024) {
    desktopNav = (
      <NavBtn
        id="back"
        name="Retourner"
        icon={back}
        link={`/profile/${auth.userId}`}
        btnStyle={btnStyle}
        iconColor={iconStyle}
      />
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

  if (!userDataState) {
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
      <ConfirmModal
        show={showConfirmModal}
        message="Votre profil a été bien mis a jour !"
        onCancel={closeConfirmModalHandler}
      />
      <div className={`container ${styles.class_mod}`}>
        {!isLoading && userDataState && (
          <div className={styles.wrapper}>
            <div className={styles.background_img}></div>
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Choisissez une image"
              photo_url={userDataState.photo_url}
            />
            <h4 className={styles.title}>Vos informations personnelles</h4>
            {desktopNav}
            <form
              id="update-form"
              className={styles.update_list}
              onSubmit={updateProfileHandler}
            >
              <InputField
                id="firstName"
                label="Prénom :"
                name="firstName"
                type="text"
                placeholder="Votre prénom"
                autocomplete="given-name"
                maxLength="45"
                element="input"
                hasLabel="yes"
                textIsWhite="no"
                validators={[MinLength(2), MaxLength(45), isText()]}
                errorText="Veuillez rentrer votre prénom"
                onInput={inputHandler}
                initialValue={userDataState.firstName}
                initialValid={true}
              />
              <InputField
                id="lastName"
                label="Nom :"
                name="lastName"
                type="text"
                placeholder="Votre nom"
                autocomplete="family-name"
                maxLength="45"
                element="input"
                hasLabel="yes"
                textIsWhite="no"
                validators={[MinLength(2), MaxLength(45), isText()]}
                errorText="Veuillez rentrer votre nom"
                onInput={inputHandler}
                initialValue={userDataState.lastName}
                initialValid={true}
              />
              <InputField
                id="email"
                label="E-mail :"
                name="email"
                type="email"
                placeholder="Votre e-mail"
                autocomplete="email"
                maxLength="100"
                element="input"
                hasLabel="yes"
                textIsWhite="no"
                validators={[isEmail(), MinLength(6), MaxLength(100)]}
                errorText="Votre email n'est pas valide"
                onInput={inputHandler}
                initialValue={userDataState.email}
                initialValid={true}
              />

              <InputField
                id="role"
                label="Description du poste :"
                name="role"
                type="text"
                placeholder="Description du poste"
                maxLength="65"
                element="textarea"
                hasLabel="yes"
                textIsWhite="no"
                validators={[MaxLength(65), isText()]}
                errorText="Uniquement des lettres"
                onInput={inputHandler}
                initialValue={userDataState.role}
                initialValid={true}
              />
            </form>
            <UIBtn
              id="update-profile-btn"
              form="update-form"
              name="Mettre à jour mon profil"
              type="submit"
              btnType="valid"
            />
            <h4 className={styles.title}>Changer mon mot de passe</h4>
            <form
              id="update-password-form"
              className={styles.update_list}
              onSubmit={updatePasswordHandler}
            >
              <InputField
                id="password"
                label="Mot de passe :"
                name="password"
                type="password"
                placeholder="Votre nouveau mot de passe"
                icon={password}
                alt="password icon"
                maxLength="50"
                element="input"
                hasLabel="yes"
                textIsWhite="no"
                validators={[MinLength(8), MaxLength(50)]}
                errorText="8 caractères min, au moins une majuscule et un chiffre"
                onInput={inputHandler}
                initialValue={formState.inputs.password.value}
                initialValid={formState.inputs.password.isValid}
              />
            </form>
            <UIBtn
              id="update-password-btn"
              form="update-password-form"
              name="Changer mon mot de passe"
              type="submit"
              btnType="valid"
            />
            <h4 className={styles.title}>Supprimer mon compte</h4>
            <UIBtn
              id="delete-profile-btn"
              icon={deleteIcon}
              name="Supprimer"
              onClick={showDeleteMessage}
              btnType="warning"
              iconColor="icon_white"
            />
            <div style={{ display: showInfo === true ? 'block' : 'none' }}>
              <p className={styles.role}>Vous allez supprimer votre compte</p>
              <h5 className={styles.title}>Êtes-vous sûr(e)?</h5>
              <div className={styles.btn_block}>
                <UIBtn
                  id="accept-btn"
                  name="Oui"
                  type="submit"
                  onClick={deleteUserHandler}
                  btnType="warning"
                />
                <UIBtn
                  id="cancel-btn"
                  name="Annuler"
                  onClick={showDeleteMessage}
                  btnType="cancel"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UpdateProfile;
