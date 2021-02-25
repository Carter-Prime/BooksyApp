import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useMedia, useFavourite} from './ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../utils/Variable';

// general function for fetching (options default value is empty object)
const doFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (json.error) {
    // if API response contains error message (use Postman to get further details)
    throw new Error(json.message + ': ' + json.error);
  } else if (!response.ok) {
    // if API response does not contain error message, but there is some other error
    throw new Error('doFetch failed');
  } else {
    // if all goes well
    return json;
  }
};
const useLoadMedia = () => {
  const [currentUserPostArray, setcurrentUserPostArray] = useState([]);
  const [
    currentUserFavouritePostArray,
    setcurrentUserFavouritePostArray,
  ] = useState([]);
  const {update, user} = useContext(MainContext);
  const {getListOfFilesOfCurrentUser} = useMedia();
  const {getListOfFavouritesByCurrentUser} = useFavourite();

  useEffect(() => {
    currentUserPostMedia();
    currentUserFavouritePosts();
  }, [update]);

  const currentUserPostMedia = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await getListOfFilesOfCurrentUser(userToken);
      const media = await Promise.all(
        response.map(async (item) => {
          const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
          return fileJson;
        })
      );
      const filteredArray = media.filter(
        (item) => item.title != 'Avatar_' + user.user_id
      );
      setcurrentUserPostArray(filteredArray);
    } catch (error) {
      console.log('data error: ', error.message);
    }
  };

  const currentUserFavouritePosts = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await getListOfFavouritesByCurrentUser(userToken);
      const media = await Promise.all(
        response.map(async (item) => {
          const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
          return fileJson;
        })
      );
      setcurrentUserFavouritePostArray(media);
    } catch (error) {
      console.log('data error: ', error.message);
    }
  };

  return {
    currentUserPostArray,
    currentUserFavouritePostArray,
  };
};

export {useLoadMedia};
