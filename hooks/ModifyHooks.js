import {useState} from 'react';

import {validator} from '../utils/validator';
import {useUser} from '../hooks/ApiHooks';

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
  email: {
    presence: {
      message: 'cannot be empty',
    },
    email: {
      message: 'is not valid',
    },
  },
  password: {
    length: {
      minimum: 5,
      message: 'min length is 5 characters',
    },
  },
  confirmPassword: {
    equality: 'password',
  },
  fullName: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      maximum: 100,
      tooLong: 'max length is 100 characters',
    },
    format: {
      pattern: '[a-zA-Z0-9,!".\'?@#ÖÄöä ]+',
      flags: 'i',
      message: 'can only contain a-z, (!"\'.?@ÖÄöä), and 0-9',
    },
  },
  favouriteBook: {
    length: {
      maximum: 100,
      tooLong: 'max length is 100 characters',
    },
    format: {
      pattern: '[a-zA-Z0-9,!".\'?@#ÖÄöä ]+',
      flags: 'i',
      message: 'can only contain a-z, (!"\'.?@ÖÄöä), and 0-9',
    },
  },
};

const useEditForm = (callback) => {
  const [editErrors, setEditErrors] = useState({});
  const {checkIsUsernameAvailable} = useUser();

  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    fullName: '',
    favouriteBook: '',
    password: '',
    confirmPassword: '',
  });
  const handleInputChange = (name, text) => {
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
    const error = validator(name, text, constraints);
    setEditErrors((editErrors) => {
      return {
        ...editErrors,
        [name]: error,
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

    setEditErrors((editErrors) => {
      return {
        ...editErrors,
        [name]: error,
      };
    });
  };

  const checkUserAvailable = async (event) => {
    try {
      const result = await checkIsUsernameAvailable(event.nativeEvent.text);
      if (!result) {
        setEditErrors((editErrors) => {
          return {
            ...editErrors,
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
    const fullNameError = validator('fullName', inputs.fullName, constraints);
    const favouriteBookError = validator(
      'favouriteBook',
      inputs.favouriteBook,
      constraints
    );
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

    setEditErrors((editErrors) => {
      return {
        ...editErrors,
        username: usernameError,
        password: passwordError,
        confirmPassword: confirmError,
        email: emailError,
        fullName: fullNameError,
        favouriteBook: favouriteBookError,
      };
    });

    if (
      usernameError !== null ||
      passwordError !== null ||
      confirmError !== null ||
      emailError !== null ||
      favouriteBookError !== null ||
      fullNameError !== null
    ) {
      return false;
    } else {
      return true;
    }
  };

  const reset = () => {
    setEditErrors({});
  };

  return {
    checkUserAvailable,
    handleInputChange,
    handleInputEnd,
    inputs,
    setInputs,
    editErrors,
    reset,
    validateOnSend,
  };
};

export default useEditForm;
