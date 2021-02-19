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
      message: 'min length is 3 characters',
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
};

const useEditForm = (callback) => {
  const [editErrors, setEditErrors] = useState({});
  const {checkIsUsernameAvailable} = useUser();

  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirmPassword: '',
  });
  const handleInputChange = (name, text) => {
    console.log(name, text);
    console.log('inputs state', inputs);
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
      // console.log('checking confirm pw', error);
    } else {
      error = validator(name, text, constraints);
      // console.log('checking something else', error);
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
