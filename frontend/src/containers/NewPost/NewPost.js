import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import { useForm } from '../../hooks/form-hook';
import { useWindowDimensions } from '../../hooks/window-hook';
import { useHttpRequest } from '../../hooks/httpRequest-hook';
import { MinLength, MaxLength } from '../../utils/validators';

// Icones
import backIcon from '../../images/back-icon.svg';

// Components
import UIBtn from '../../components/Buttons/UIBtn/UIBtn';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import InputField from '../../components/InputField/InputField';
import Spinner from '../../components/LoadingSpinner/LoadingSpinner';

// Styles
import styles from './NewPost.module.css';

const NewPost = (props) => {
  // Authentication
  const auth = useContext(AuthContext);

  // History context
  const history = useHistory();

  // Requête Hook
  const { isLoading, sendRequest } = useHttpRequest();

  // Taille de la fenêtre
  const { width } = useWindowDimensions();

  // Form State
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      image: {
        value: null,
        isValid: true,
      },
    },
    false
  );

  // Envoyer Post au Backend
  const sendPostHandler = async (event) => {
    event.preventDefault();

    if (!formState.isValid) {
      console.log(formState);
      return;
    }

    const formData = new FormData();
    formData.append('title', formState.inputs.title.value);
    formData.append('image', formState.inputs.image.value);
    try {
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/posts`,
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      history.push(`/posts`);
    } catch (err) {}
  };

  // Bouton retour
  const backHandle = (e) => {
    e.preventDefault();
    props.history.goBack();
  };

  // Afficher les boutons pour Desktop
  let sendBtn;
  let backBtn;

  if (width >= 1024) {
    sendBtn = (
      <div className={styles.send_btn}>
        <UIBtn
          id="send-post-btn"
          form="send-post-form"
          name="Publier"
          type="submit"
          btnType="valid"
        />
      </div>
    );
    backBtn = (
      <button className={styles.back_btn} onClick={backHandle}>
        <img className="icon_red" src={backIcon} alt="" />
      </button>
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

  return (
    <>
      {!isLoading && (
        <>
          <header className={styles.head}>
            <div className={styles.tab}>
              {backBtn}
              <div className={styles.tab_border}>
                <h3 className={styles.title}>Nouvelle Publication</h3>
              </div>
            </div>
          </header>
          <div className="container">
            <form
              className={styles.form}
              id="send-post-form"
              onSubmit={sendPostHandler}
            >
              <InputField
                id="title"
                name="title"
                type="text"
                placeholder="Titre ou message de la publication"
                maxLength="100"
                element="textarea"
                hasLabel="no"
                textIsWhite="no"
                validators={[MinLength(2), MaxLength(100)]}
                errorText="Veuillez écrire un commentaire"
                onInput={inputHandler}
                initialValue={formState.inputs.title.value}
                initialValid={formState.inputs.title.isValid}
              />
              <ImageUpload
                center
                id="image"
                onInput={inputHandler}
                errorText="Choisissez une Image ou un gif !"
              />
              {sendBtn}
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default NewPost;
