import {useState} from 'react';
import {validator} from '../utils/validator';

const constraints = {
  comment: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 2,
      maximum: 255,
      tooShort: 'min length is 3 characters',
      tooLong: 'max length is 255 characters',
    },
  },
};

const useCommentForm = (callback) => {
  const [inputs, setInputs] = useState({
    comment: '',
  });
  const [uploadErrors, setUploadErrors] = useState({});

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
      comment: '',
    });
    setUploadErrors({});
  };

  return {
    handleInputChange,
    inputs,
    setInputs,
    uploadErrors,
    reset,
  };
};

export default useCommentForm;
