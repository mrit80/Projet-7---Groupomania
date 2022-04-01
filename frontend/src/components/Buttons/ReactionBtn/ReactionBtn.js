import React from 'react';
import { Link } from 'react-router-dom';

// Icones
import comment from '../../../images/comment-icon.svg';
import comments from '../../../images/comments-icon.svg';

// Styles
import styles from './ReactionBtn.module.css';

const ReactionBtn = (props) => {
  //
  let reactionColor = '';

  switch (props.reaction) {
    case null:
      reactionColor = '';
      break;
    default:
      console.log('Erreur');
  }

  // Type d'icônes
  let icon;
  switch (props.icon) {
    case 'comment':
      icon = comment;
      break;
    case 'comments':
      icon = comments;
      break;
    default:
      console.log("Erreur pas d'icônes");
  }

  // Type de boutons
  let btn;
  switch (props.btnType) {
    case 'link':
      btn = (
        <Link
          to={props.link}
          className={`${styles.reaction_btn} ${props.styling}`}
        >
          <img
            className={`${styles.icon} ${reactionColor}`}
            src={icon}
            alt=""
          />
          <span>{props.text}</span>
        </Link>
      );
      break;
    case 'decor':
      btn = (
        <div className={`${styles.reaction_btn} ${props.styling}`}>
          <img
            className={`${styles.icon} ${reactionColor}`}
            src={icon}
            alt=""
          />
          <span>{props.text}</span>
        </div>
      );
      break;
    default:
      console.log('Erreur');
  }

  return <>{btn}</>;
};

export default ReactionBtn;
