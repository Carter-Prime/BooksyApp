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
      message: 'min length is 3 characters',
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
      // console.log('checking confirm pw', error);
    } else {
      error = validator(name, text, constraints);
      // console.log('checking something else', error);
    }

    setRegisterErrors((registerErrors) => {
      return {
        ...registerErrors,
        [name]: error,
      };
    });
  };

  const checkUserAvailable = async (event) => {
    try {
      const result = await checkIsUsernameAvailable(event.nativeEvent.text);
      if (!result) {
        setRegisterErrors((registerErrors) => {
          return {
            ...registerErrors,
            username: 'Username already exists',
          };
        });
      }
    } catch (error) {
      console.error('reg checkUserAvailable', error);
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
  };
};

export default useSignUpForm;
