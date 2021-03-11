import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useMedia, useFavourite, useTag} from './ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl, appIdentifier} from '../utils/Variable';
import {ToastAndroid} from 'react-native';

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
  const [swappedPostsArray, setSwappedPostsArray] = useState([]);
  const [latestPostsArray, setLatestPostsArray] = useState([]);
  const {update, user, setSearchResultArray, setSearchIsEmpty} = useContext(
    MainContext
  );
  const {getListOfFilesOfCurrentUser} = useMedia();
  const {getListOfFavouritesByCurrentUser} = useFavourite();
  const {getFilesByTag} = useTag();
  const [searchIsLoading, setSearchIsLoading] = useState(false);

  useEffect(() => {
    currentUserPostMedia();
    currentUserFavouritePosts();
    latestPosts();
    currentUserSwappedPosts();
  }, [update]);

  const doTagSearch = async (tag) => {
    try {
      setSearchResultArray([]);
      setSearchIsEmpty(false);
      setSearchIsLoading(true);
      const tagResponse = await getFilesByTag(tag);
      const tagMediaSearch = await Promise.all(
        tagResponse.map(async (item) => {
          const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
          return fileJson;
        })
      );
      const filtedTagMediaSearch = tagMediaSearch.filter(
        (value, index, self) => {
          return (
            self.findIndex((item) => item.file_id === value.file_id) === index
          );
        }
      );
      setSearchResultArray(filtedTagMediaSearch);
    } catch (error) {
      console.error('Tag search Failed');
    } finally {
      setSearchIsLoading(false);
    }
  };

  const doSearch = async (searchData, tagSearch, searchInput) => {
    let titleSearch = [];
    let descriptionSearch = [];
    let tagMediaSearch = [];

    if (searchInput === '') {
      ToastAndroid.showWithGravity(
        'Search is empty. Please try again.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }

    try {
      setSearchResultArray([]);
      setSearchIsEmpty(false);
      setSearchIsLoading(true);
      if (Object.keys(searchData).length != 0) {
        const listJson = await doFetch(baseUrl + 'tags/' + appIdentifier);
        const media = await Promise.all(
          listJson.map(async (item) => {
            const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
            return fileJson;
          })
        );
        const newArray = media.filter(
          (item) => !item.title.includes('Avatar_')
        );

        if ('title' in searchData) {
          const data = searchData.title.toLowerCase();
          titleSearch = newArray.filter((item) => {
            if (item.title.toLowerCase().includes(data)) {
              return item;
            }
          });
        }

        if ('description' in searchData) {
          const data = searchData.description.toLowerCase();
          descriptionSearch = newArray.filter((item) => {
            if (item.description.toLowerCase().includes(data)) {
              return item;
            }
          });
        }
      }
      if (tagSearch) {
        const tagResponse = await getFilesByTag(searchInput);
        tagMediaSearch = await Promise.all(
          tagResponse.map(async (item) => {
            const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
            return fileJson;
          })
        );
      }
      let finalSearchArray = titleSearch
        .concat(descriptionSearch)
        .concat(tagMediaSearch);

      finalSearchArray = [
        ...new Set([...titleSearch, ...descriptionSearch, ...tagMediaSearch]),
      ];
      const filtedfinalSearchArray = finalSearchArray.filter(
        (value, index, self) => {
          return (
            self.findIndex((item) => item.file_id === value.file_id) === index
          );
        }
      );
      if (finalSearchArray.length == 0) {
        setSearchIsEmpty(true);
      } else {
        setSearchResultArray(filtedfinalSearchArray);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSearchIsLoading(false);
    }
  };

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
      const unswappedArray = filteredArray.filter((item) => {
        const moreData = JSON.parse(item.description);
        if (!moreData.swapped) {
          return item;
        }
      });
      setcurrentUserPostArray(unswappedArray.reverse());
    } catch (error) {
      console.error('currentUserPostMedia error: ', error.message);
    }
  };

  const currentUserSwappedPosts = async () => {
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
      const swappedArray = filteredArray.filter((item) => {
        const moreData = JSON.parse(item.description);
        if (moreData.swapped) {
          return item;
        }
      });
      setSwappedPostsArray(swappedArray.reverse());
    } catch (error) {
      console.error('currentUserSwappedPosts error: ', error.message);
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
      console.error('currentUserFavouritePosts error: ', error.message);
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
        .slice(Math.max(newArray.length - 30, 0), newArray.length)
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
    swappedPostsArray,
    doSearch,
    searchIsLoading,
    doTagSearch,
  };
};

export {useLoadMedia};
