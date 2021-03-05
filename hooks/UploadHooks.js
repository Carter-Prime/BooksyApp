import {useState} from 'react';
import {validator} from '../utils/validator';

const constraints = {
  title: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 3,
      maximum: 20,
      tooLong: 'max length is 20 characters',
      tooShort: 'min length is 3 characters',
    },
    format: {
      pattern: '[a-zA-Z0-9,!".\'?@#ÖÄöä ]+',
      flags: 'i',
      message: 'can only contain a-z, (!"\'.?@ÖÄöä), and 0-9',
    },
  },
  description: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 5,
      maximum: 255,
      tooLong: 'max length is 255 characters',
      tooShort: 'min length is 5 characters',
    },
    format: {
      pattern: '[a-zA-Z0-9,!".\'?@#ÖÄöä ]+',
      flags: 'i',
      message: 'can only contain a-z, (!"\'.?@ÖÄöä), and 0-9',
    },
  },
  tags: {
    length: {
      maximum: 20,
      tooLong: 'max length is 20 characters',
    },
    format: {
      pattern: '^$|[a-zA-Z0-9,!".?@#ÖÄöä]+',
      flags: 'i',
      message: 'can only contain a-z, (!".?@ÖÄöä), and 0-9. No spaces.',
    },
  },
};

const useUploadForm = (callback) => {
  const [inputs, setInputs] = useState({
    title: '',
    description: '',
    tags: '',
  });
  const [uploadErrors, setUploadErrors] = useState({tags: null});

  const handleInputChange = (name, text) => {
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
    const error = validator(name, text, constraints);
    setUploadErrors((uploadErrors) => {
      return {
        ...uploadErrors,
        [name]: error,
      };
    });
  };

  const reset = () => {
    setInputs({
      title: '',
      description: '',
      tags: '',
    });
    setUploadErrors({tags: null});
  };

  return {
    handleInputChange,
    inputs,
    setInputs,
    uploadErrors,
    reset,
  };
};

export default useUploadForm;
