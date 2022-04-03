import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from '../../hooks/form-hook';
import { useHttpRequest } from '../../hooks/httpRequest-hook';
import { AuthContext } from '../../context/auth-context';
import { isEmail, MinLength } from '../../utils/validators';

// Logo
import logo from '../../images/logo.png';

// Icones
import password from '../../images/password-icon.svg';
import person from '../../images/person-icon.svg';

// Components
import InputField from '../../components/InputField/InputField';

// Styles
import '../Home/Home.css';

const Login = () => {
  // Authentication // Hooks de React qui valorise AuthContext
  const auth = useContext(AuthContext);

  // History librairie qui sauvegarde le parcours pour retourner en arrière
  const history = useHistory();

  // Requête Hook
  const { error, sendRequest } = useHttpRequest();

  // Hook useForm pour gérer l'input email et password
  const [formState, inputHandler] = useForm(
    // inputHandler ajourne formState
    {
      email: {
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

  const loginHandler = async (event) => {
    event.preventDefault();

    if (!formState.isValid) {
      return;
    }

    try {
      const data = {
        // Récupère la valeur des données stocker dans formState
        email: formState.inputs.email.value,
        password: formState.inputs.password.value,
      };
      // sendRequest Hook pour faire des requête au Backend en utilisant fetch
      const responseData = await sendRequest(
        `${process.env.REACT_APP_API_URL}/login`,
        'POST',
        JSON.stringify(data), // envoi des données au format json de la const data au backend
        {
          'Content-Type': 'application/json',
        }
      ); // réponse du backend
      auth.login(responseData.userId, responseData.token, responseData.account);
      history.push('/posts'); // Pour tenir compte de l'history de ma navigation
    } catch (err) {}
  };

  return (
    <>
      <div className="background_image">
        <img src={logo} className="logo" alt="Logo de Groupomania" />
        <form id="login-form" className="input_list" onSubmit={loginHandler}>
          <InputField
            id="email"
            name="email"
            type="email"
            onInput={inputHandler}
            placeholder="email"
            autocomplete="email"
            icon={person}
            alt="email icon"
            element="input"
            textIsWhite="yes"
            validators={[isEmail(), MinLength(6)]}
            errorText="L'email n'est pas valide"
            initialValue={formState.inputs.email.value}
            initialValid={formState.inputs.email.isValid}
          />
          <InputField
            id="password"
            name="password"
            type="password"
            onInput={inputHandler}
            placeholder="mot de passe"
            autocomplete="current-password"
            icon={password}
            alt="password icon"
            element="input"
            hasLabel="no"
            textIsWhite="yes"
            validators={[MinLength(8)]}
            errorText="Mot de passe non valide"
            initialValue={formState.inputs.password.value}
            initialValid={formState.inputs.password.isValid}
          />
        </form>
        <p className="error_message">{error}</p>
      </div>
      <div className="background_blur"></div>
    </>
  );
};

export default Login;
