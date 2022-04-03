import React, { useReducer, useEffect } from 'react';
import { validate } from '../../utils/validators';

// Styles
import styles from './InputField.module.css';

// En fonction de l'état de l'objet HTML (Change = Écriture / Touch = l'utilisateur change de champ)
const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        // Copier les valeurs avant le changement et ajoute le nouvel élément
        ...state,
        value: action.val,
        // Changer la validation en fonction des validateurs de l'objet HTML
        isValid: validate(action.val, action.validators),
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

// Component
const InputField = (props) => {
  // État de départ du composant
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false,
  });

  // Composition de props et inputState
  const { id, onInput } = props;
  const { value, isValid } = inputState;

  // Capture la saisie et valorise onInput
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  // Capturer le changement de l'état du composant
  const changeHandler = (event) => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators,
    });
  };

  // Capturer le changement de l'état du composant (changer de champ)
  const touchHandler = () => {
    dispatch({
      type: 'TOUCH',
    });
  };

  // Validation visuelle et type d'objet HTML (input/textarea)
  let typeOfBox;
  let borderColor;

  if (props.textIsWhite === 'yes') {
    typeOfBox = styles.white_box;
    borderColor = styles.border_white;
  } else {
    typeOfBox = styles.box;
    borderColor = '';
  }

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        className={`${typeOfBox} ${styles.input_height} `}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        autoComplete={props.autocomplete}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={touchHandler}
      ></input>
    ) : (
      <textarea
        id={props.id}
        className={`${typeOfBox} ${styles.textarea}`}
        name={props.name}
        type={props.type}
        rows={props.rows || 3}
        placeholder={props.placeholder}
        autoComplete={props.autocomplete}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={touchHandler}
      />
    );

  return (
    <>
      <div
        className={`${styles.block} ${borderColor}
        ${!inputState.isValid && inputState.isTouched && styles.invalid}`}
      >
        <div className={styles.wrapper}>{element}</div>
      </div>
      {!inputState.isValid && inputState.isTouched && (
        <p className={styles.input_error}>{props.errorText}</p>
      )}
    </>
  );
  // });
};

export default InputField;
