import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {Divider} from 'react-native-elements';
import {Eye, ThumbsUp} from 'react-native-feather';
import Colours from './../utils/Colours';
import PropTypes from 'prop-types';
import {useFavourite, useRating} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Actionbar = ({postData}) => {
  const [isLiked, setIsLiked] = useState(false);
  const {
    postFavourite,
    getListOfFavouritesByCurrentUser,
    deleteFavourite,
  } = useFavourite();
  const {postRating, deleteRating, getListOfRatingsByFileId} = useRating();
  const [isWatching, setIsWatching] = useState(false);
  const {update, setUpdate} = useContext(MainContext);

  const addWatching = async () => {
    if (isWatching) {
      return null;
    }
    const userToken = await AsyncStorage.getItem('userToken');
    const data = {
      file_id: postData.file_id,
    };

    try {
      postFavourite(data, userToken);
      setIsWatching(true);
      setUpdate(update + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const removeWatching = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    try {
      deleteFavourite(postData.file_id, userToken);
      setIsWatching(false);
      setUpdate(update + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const getWatching = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    try {
      const listOfWatching = await getListOfFavouritesByCurrentUser(userToken);

      const newArray = await listOfWatching.filter((item) => {
        if (item.file_id == postData.file_id) {
          return item;
        }
      });
      if (newArray.length > 0) {
        setIsWatching(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWatching();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.iconContainerLeft}>
          <TouchableOpacity
            style={styles.iconContainerLeft}
            onPress={() => {
              if (isWatching) {
                removeWatching();
              } else {
                addWatching();
              }
            }}
          >
            {isWatching ? (
              <Eye
                width={28}
                height={28}
                stroke={Colours.primaryBlue}
                fill={Colours.accentOrange}
                strokeWidth={1.5}
              />
            ) : (
              <Eye
                width={28}
                height={28}
                stroke={Colours.primaryBlue}
                fill="none"
                strokeWidth={1.5}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.iconContainerRight}>
          <Text style={styles.likesText}>23</Text>
          <TouchableOpacity
            style={styles.iconContainerRight}
            onPress={() => {
              setIsLiked(!isLiked);
            }}
          >
            {isLiked ? (
              <ThumbsUp
                width={28}
                height={28}
                stroke={Colours.primaryBlue}
                fill="none"
                strokeWidth={1.5}
              />
            ) : (
              <ThumbsUp
                width={28}
                height={28}
                stroke={Colours.primaryBlue}
                fill={Colours.accentOrange}
                strokeWidth={1.5}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Divider style={styles.divider} />
    </>
  );
};

export default Actionbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: -10,
  },
  iconContainerLeft: {
    flexDirection: 'row',
    paddingRight: 10,
  },
  iconContainerRight: {
    flexDirection: 'row',
    paddingLeft: 5,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colours.accentOrange,
    marginTop: 20,
  },
  likesText: {
    textAlignVertical: 'center',
    paddingLeft: 10,
    paddingTop: 5,
    fontFamily: 'ProximaSoftRegular',
    fontSize: 18,
    color: Colours.primaryBlue,
  },
});

Actionbar.propTypes = {
  postData: PropTypes.object,
};
