import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useMedia, useFavourite} from './ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl, appIdentifier} from '../utils/Variable';

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
const useLoadMedia = () => {
  const [currentUserPostArray, setcurrentUserPostArray] = useState([]);
  const [
    currentUserFavouritePostArray,
    setcurrentUserFavouritePostArray,
  ] = useState([]);
  const [latestPostsArray, setLatestPostsArray] = useState([]);
  const {update, user} = useContext(MainContext);
  const {getListOfFilesOfCurrentUser} = useMedia();
  const {getListOfFavouritesByCurrentUser} = useFavourite();

  useEffect(() => {
    currentUserPostMedia();
    currentUserFavouritePosts();
    latestPosts();
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
        (item) => !item.title.includes('Avatar_')
      );
      setcurrentUserPostArray(filteredArray.reverse());
    } catch (error) {
      console.log('data error: ', error.message);
    }
  };

  const currentUserFavouritePosts = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await getListOfFavouritesByCurrentUser(userToken);
      let media = await Promise.all(
        response.map(async (item) => {
          const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
          return fileJson;
        })
      );
      media = media.reverse();
      setcurrentUserFavouritePostArray(media);
    } catch (error) {
      console.log('data error: ', error.message);
    }
  };

  const latestPosts = async () => {
    try {
      const listJson = await doFetch(baseUrl + 'tags/' + appIdentifier);
      const media = await Promise.all(
        listJson.map(async (item) => {
          const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
          return fileJson;
        })
      );
      let newArray = media
        .filter((item) => item.user_id !== user.user_id)
        .filter((item) => !item.title.includes('Avatar_'));

      newArray = newArray
        .slice(Math.max(newArray.length - 10, 0), newArray.length)
        .reverse();
      setLatestPostsArray(newArray);
    } catch (error) {
      console.error('latestPosts error', error.message);
    }
  };

  return {
    currentUserPostArray,
    currentUserFavouritePostArray,
    latestPostsArray,
  };
};

export {useLoadMedia};
