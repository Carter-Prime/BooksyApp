import axios from 'axios';
import {appIdentifier, baseUrl} from '../utils/variables';

// General function for fetching (options default value is empty object)
const doFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (json.error) {
    throw new Error(json.message + ': ' + json.error);
  } else if (!response.ok) {
    throw new Error('doFetch failed');
  } else {
    return json;
  }
};

// Authentication endpoint from API
const useAuthentication = () => {
  const postLogin = async (userCredentials) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userCredentials),
    };
    try {
      const userData = await doFetch(baseUrl + 'login', options);
      return userData;
    } catch (error) {
      throw new Error('postLogin error: ' + error.message);
    }
  };

  return {postLogin};
};
// User endpoints from API
const useUser = () => {
  const checkIsUsernameAvailable = async (username) => {
    try {
      const result = await doFetch(baseUrl + 'users/username/' + username);
      return result.available;
    } catch (error) {
      throw new Error('apihooks checkIsUserAvailable', error.message);
    }
  };

  const registerNewUser = async (inputs) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    try {
      const userData = await doFetch(baseUrl + 'users', options);
      console.log('register resp', userData);
      return userData;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const checkCurrentUserToken = async (token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const userData = await doFetch(baseUrl + 'users/user', options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getUser = async (id, token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const userData = await doFetch(baseUrl + 'users/' + id, options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getUsersList = async (id, token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const userListData = await doFetch(baseUrl + 'users/', options);
      return userListData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const deleteUser = async (id, token) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {'x-access-token': token},
      };
      const response = await doFetch(baseUrl + 'users/' + id, options);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const modifyUser = async (inputs, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(inputs),
    };
    try {
      const response = await doFetch(baseUrl + 'users', options);
      return response;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return {
    registerNewUser,
    checkCurrentUserToken,
    checkIsUsernameAvailable,
    getUser,
    getUsersList,
    deleteUser,
    modifyUser,
  };
};

// Media endpoints from API
const useMedia = () => {
  const uploadFile = async (fileData, token) => {
    const options = {
      method: 'POST',
      headers: {'x-access-token': token},
      data: fileData,
      url: baseUrl + 'media',
    };
    try {
      const response = await axios(options);
      return response.data;
    } catch (e) {
      throw new Error('UploadFile error: ', e.message);
    }
  };

  const updateFile = async (fileId, fileInfo, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'x-access-token': token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(fileInfo),
    };
    try {
      const response = await doFetch(baseUrl + 'media/' + fileId, options);
      return response;
    } catch (error) {
      throw new Error('updateFile error: ' + error.message);
    }
  };

  const deleteFile = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      const response = await doFetch(baseUrl + 'media/' + fileId, options);
      return response;
    } catch (error) {
      throw new Error('deleteFile error: ' + error.message);
    }
  };

  const getFileById = async (fileId) => {
    const options = {
      method: 'GET',
    };
    try {
      const fileData = await doFetch(baseUrl + 'media/' + fileId, options);
      return fileData;
    } catch (error) {
      throw new Error('getFIleById error: ' + error.message);
    }
  };

  const getListOfFilesByUser = async (userId) => {
    const options = {
      method: 'GET',
    };
    try {
      const listOfFiles = await doFetch(
        baseUrl + 'media/user/' + userId,
        options
      );
      return listOfFiles;
    } catch (error) {
      throw new Error('getFIleById error: ' + error.message);
    }
  };

  const getListOfFilesOfCurrentUser = async (token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    try {
      const listOfCurrentUsersFiles = await doFetch(
        baseUrl + 'media/user/',
        options
      );
      return listOfCurrentUsersFiles;
    } catch (error) {
      throw new Error('getFIleById error: ' + error.message);
    }
  };

  const getListofAllMediaFiles = async () => {
    try {
      const listAllAppMedia = await doFetch(baseUrl + 'tags/' + appIdentifier);
      const appMediaList = await Promise.all(
        listAllAppMedia.map(async (item) => {
          const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
          return fileJson;
        })
      );
      return appMediaList;
    } catch (error) {
      console.error('getListofAllMediaFiles error', error.message);
    }
  };

  const searchMediaFiles = async (token, search) => {
    const options = {
      method: 'POST',
      headers: {'x-access-token': token},
      body: JSON.stringify(search),
    };
    try {
      const searchResult = await doFetch(baseUrl + 'media/search/', options);
      return searchResult;
    } catch (error) {
      throw new Error('getFIleById error: ' + error.message);
    }
  };

  return {
    uploadFile,
    updateFile,
    deleteFile,
    getFileById,
    getListOfFilesByUser,
    getListOfFilesOfCurrentUser,
    getListofAllMediaFiles,
    searchMediaFiles,
  };
};

// Comment endpoints from API
const useComment = () => {};

// Favourite endpoints from API
const useFavourite = () => {};

// Rating endpoints from API
const useRating = () => {};

// Tag endpoints from APi
const useTag = () => {};

export {
  useAuthentication,
  useUser,
  useMedia,
  useComment,
  useFavourite,
  useRating,
  useTag,
};
