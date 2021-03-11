import {useState} from 'react';

import {useUser} from '../hooks/ApiHooks';
import {validator} from '../utils/validator';

const constraints = {
  username: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 3,
      maximum: 100,
      tooLong: 'max length is 100 characters',
      message: 'min length is 3 characters',
    },
    format: {
      pattern: '[a-z0-9]+',
      flags: 'i',
      message: 'can only contain a-z and 0-9',
    },
  },
  password: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 5,
      message: 'min length is 5 characters',
    },
  },
  confirmPassword: {
    equality: 'password',
  },
  email: {
    presence: {
      message: 'cannot be empty',
    },
    email: {
      message: 'is not valid',
    },
  },
};

const useSignUpForm = (callback) => {
  const [registerErrors, setRegisterErrors] = useState({});
  const {checkIsUsernameAvailable} = useUser();
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isPasswordAvailable, setIsPasswordAvailable] = useState(false);
  const [doPasswordMatch, setDoPasswordMatch] = useState(false);

  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    email: '',
  });

  const handleInputChange = (name, text) => {
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };

  const handleInputEnd = (name, text) => {
    if (text === '') {
      text = null;
    }
    let error;
    if (name === 'confirmPassword') {
      error = validator(
        name,
        {
          password: inputs.password,
          confirmPassword: text,
        },
        constraints
      );
    } else {
      error = validator(name, text, constraints);
    }

    // if (name == 'email') {
    //   if (error == null) {
    //     setIsEmailAvailable(true);
    //   } else {
    //     setIsEmailAvailable(false);
    //   }
    // }

    switch (name) {
      case 'email':
        error == null ? setIsEmailAvailable(true) : setIsEmailAvailable(false);
        break;
      case 'password':
        error == null
          ? setIsPasswordAvailable(true)
          : setIsPasswordAvailable(false);
        break;
      case 'confirmPassword':
        error == null ? setDoPasswordMatch(true) : setDoPasswordMatch(false);
        break;
    }

    setRegisterErrors((registerErrors) => {
      return {
        ...registerErrors,
        [name]: error,
      };
    });
  };

  const checkUserAvailable = async (event) => {
    if (event.nativeEvent.text === '') {
      return;
    }
    try {
      const result = await checkIsUsernameAvailable(event.nativeEvent.text);
      if (!result) {
        setIsUsernameAvailable(false);
        setRegisterErrors((registerErrors) => {
          return {
            ...registerErrors,
            username: 'Username already exists',
          };
        });
      } else {
        setIsUsernameAvailable(true);
      }
    } catch (error) {
      console.error('reg checkUserAvailable', error.message);
    }
  };

  const validateOnSend = () => {
    const usernameError = validator('username', inputs.username, constraints);
    const passwordError = validator('password', inputs.password, constraints);
    const confirmError = validator(
      'confirmPassword',
      {
        password: inputs.password,
        confirmPassword: inputs.confirmPassword,
      },
      constraints
    );
    const emailError = validator('email', inputs.email, constraints);

    setRegisterErrors((registerErrors) => {
      return {
        ...registerErrors,
        username: usernameError,
        password: passwordError,
        confirmPassword: confirmError,
        email: emailError,
      };
    });

    if (
      usernameError !== null ||
      passwordError !== null ||
      confirmError !== null ||
      emailError !== null
    ) {
      return false;
    } else {
      return true;
    }
  };

  return {
    handleInputChange,
    handleInputEnd,
    inputs,
    checkUserAvailable,
    registerErrors,
    validateOnSend,
    isUsernameAvailable,
    isEmailAvailable,
    isPasswordAvailable,
    doPasswordMatch,
  };
};

export default useSignUpForm;
