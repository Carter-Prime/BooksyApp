import axios from 'axios';
import {appIdentifier, baseUrl} from '../utils/Variable';

// General function for fetching (options default value is empty object)
const doFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (json.error) {
    throw new Error(json.message + ': ' + json.error);
  } else if (!response.ok) {
    throw new Error('doFetch failed', response.message);
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

  const getUserById = async (id, token) => {
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
    getUserById,
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
      throw new Error('getListOfFilesOfCurrentUser error: ' + error.message);
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
      throw new Error('searchMediaFiles error: ' + error.message);
    }
  };

  return {
    uploadFile,
    updateFile,
    deleteFile,
    getFileById,
    getListOfFilesOfCurrentUser,
    getListofAllMediaFiles,
    searchMediaFiles,
  };
};

// Comment endpoints from API
const useComment = () => {
  const postComment = async (comment, token) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(comment),
    };
    try {
      const response = await doFetch(baseUrl + 'comments', options);
      return response;
    } catch (error) {
      throw new Error('postComment error: ' + error.message);
    }
  };

  const deleteComment = async (commentId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      const response = await doFetch(
        baseUrl + 'comments/' + commentId,
        options
      );
      return response;
    } catch (error) {
      throw new Error('deleteComment error: ' + error.message);
    }
  };

  // Request a list of comments of a specific file.
  const getCommentsByFileId = async (fileId) => {
    const options = {
      method: 'GET',
    };
    try {
      const listOfComments = await doFetch(
        baseUrl + 'comments/file/' + fileId,
        options
      );
      return listOfComments;
    } catch (error) {
      throw new Error('getCommentsByFileId error: ' + error.message);
    }
  };

  return {
    postComment,
    deleteComment,
    getCommentsByFileId,
  };
};

// Favourite endpoints from API
const useFavourite = () => {
  // Request a list of favourite entries of specific file.
  const getListOfFavouritesByFileId = async (fileId) => {
    const options = {
      method: 'GET',
    };
    try {
      const response = await doFetch(baseUrl + 'favourites' + fileId, options);
      return response;
    } catch (error) {
      throw new Error('getListOfFavouritesByFileId error: ' + error.message);
    }
  };

  // Request a list of favourite files added by authenticated user.
  const getListOfFavouritesByCurrentUser = async (token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    try {
      const listOfFavourites = await doFetch(baseUrl + 'favourites', options);
      return listOfFavourites;
    } catch (error) {
      throw new Error(
        'getListOfFavouritesByCurrentUser error: ' + error.message
      );
    }
  };

  const postFavourite = async (fileId, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(fileId),
    };
    try {
      await doFetch(baseUrl + 'favourites', options);
    } catch (error) {
      throw new Error('postFavourite error: ' + error.message);
    }
  };

  const deleteFavourite = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      await doFetch(baseUrl + 'favourites/file/' + fileId, options);
    } catch (error) {
      throw new Error('deleteFavourite error: ' + error.message);
    }
  };

  return {
    getListOfFavouritesByFileId,
    getListOfFavouritesByCurrentUser,
    postFavourite,
    deleteFavourite,
  };
};

// Rating endpoints from API
const useRating = () => {
  const postRating = async (rating, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(rating),
    };
    try {
      const response = await doFetch(baseUrl + 'ratings', options);
      return response;
    } catch (error) {
      throw new Error('postRating error: ' + error.message);
    }
  };
  const deleteRating = async (token, fileId) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      const response = await doFetch(
        baseUrl + 'ratings/file/' + fileId,
        options
      );
      return response;
    } catch (error) {
      throw new Error('deleteRating error: ' + error.message);
    }
  };

  // Request a list of ratings of a specific file.
  const getListOfRatingsByFileId = async (fileId) => {
    const options = {
      method: 'GET',
    };
    try {
      const response = await doFetch(
        baseUrl + 'ratings/file/' + fileId,
        options
      );
      return response;
    } catch (error) {
      throw new Error('getListOfRatingsByFileId error: ' + error.message);
    }
  };

  // Request a list of files rated by the authenticated user.
  const getListOfRatingsByCurrentUser = async (token) => {
    const options = {
      method: 'GET',
      headers: {'x-access-token': token},
    };
    try {
      const listOfRatings = await doFetch(baseUrl + 'ratings', options);
      return listOfRatings;
    } catch (error) {
      throw new Error('getListOfRatingsByCurrentUser error: ' + error.message);
    }
  };

  return {
    postRating,
    deleteRating,
    getListOfRatingsByFileId,
    getListOfRatingsByCurrentUser,
  };
};

// Tag endpoints from API
const useTag = () => {
  const deleteTag = async (token, tagId) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      const response = await doFetch(baseUrl + 'comments/' + tagId, options);
      return response;
    } catch (error) {
      throw new Error('deleteTag error: ' + error.message);
    }
  };

  const postTag = async (tag, token) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify(tag),
    };
    try {
      const result = await doFetch(baseUrl + 'tags', options);
      return result;
    } catch (error) {
      throw new Error('postTag error: ' + error.message);
    }
  };

  const getFilesByTag = async (tag) => {
    try {
      const tagList = await doFetch(baseUrl + 'tags/' + tag);
      return tagList;
    } catch (error) {
      throw new Error('getFilesByTag error: ' + error.message);
    }
  };

  const getListOfTagsByFileId = async (fileId) => {
    const options = {
      method: 'GET',
    };
    try {
      const listOfTags = await doFetch(baseUrl + 'tags/' + fileId, options);
      return listOfTags;
    } catch (error) {
      throw new Error('getListOfTagsByFileId error: ' + error.message);
    }
  };

  return {
    getFilesByTag,
    postTag,
    deleteTag,
    getListOfTagsByFileId,
  };
};

export {
  useAuthentication,
  useUser,
  useMedia,
  useComment,
  useFavourite,
  useRating,
  useTag,
};
