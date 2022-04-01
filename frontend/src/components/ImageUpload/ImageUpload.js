import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

// Icones
import Image from '../../images/image-icon.svg';

// Image par défaut
import GenProfile from '../../images/generic_profile_picture.jpg';

// Styles
import styles from './ImageUpload.module.css';

const ImageUpload = (props) => {
  // Use state de l'image
  const [file, setFile] = useState();

  // Use state de la prévisualisation de l'image
  const [previewUrl, setPreviewUrl] = useState();

  // Use state de la validation
  const [isValid, setIsValid] = useState(false);

  // Localisation actuelle de l'app
  const path = props.location.pathname;

  useEffect(() => {
    // Vérifier s'il y a une image dans le useState
    if (!file) {
      return;
    }

    // Prévisualisation de l'image puis transfère à useState
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  // Prend l'image
  const pickedImageHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;

    // S'il y a une image dans l'événement
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      // Rendre l'image optionnelle
      setIsValid(true);
      fileIsValid = true;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  // Page nouvelle publication
  if (path === '/posts/new') {
    return (
      <>
        <label htmlFor="upload-button" className={styles.image_container}>
          {previewUrl ? (
            <>
              <img
                className={styles.preview_post}
                src={previewUrl}
                alt="Prévisualisation de la publication"
              />
              <div className={styles.red_banner_post}>
                <span className={styles.banner_text_post}>Changer l'image</span>
              </div>
            </>
          ) : (
            <div className={styles.icon_block}>
              <img className={styles.icon} src={Image} alt="" />
              <span className={styles.text}>
                Choisissez une image en cliquant ici
              </span>
            </div>
          )}
        </label>
        <input
          type="file"
          accept=".jpeg,.jpg,.gif"
          id="upload-button"
          style={{ display: 'none' }}
          onChange={pickedImageHandler}
        />
      </>
    );
  }

  // Page modifer le profil
  return (
    <>
      <label htmlFor="upload-button" className={styles.photo_container}>
        {previewUrl ? (
          <>
            <img
              className={styles.preview_img}
              src={previewUrl}
              alt="Prévisualisation du profil"
            />

            <div className={styles.red_banner}>
              <span className={styles.banner_text}>Changer</span>
            </div>
          </>
        ) : (
          <div>
            <img
              className={styles.profile_photo}
              src={props.photo_url || GenProfile}
              alt=""
            />
            <div className={styles.red_banner}>
              <span className={styles.banner_text}>Changer</span>
            </div>
          </div>
        )}
      </label>
      <input
        type="file"
        accept=".jpeg,.jpg"
        id="upload-button"
        style={{ display: 'none' }}
        onChange={pickedImageHandler}
      />
    </>
  );
};

export default withRouter(ImageUpload);
