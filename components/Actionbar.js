import React, {useState, useContext, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {AirbnbRating} from 'react-native-elements';
import {Eye} from 'react-native-feather';
import Colours from './../utils/Colours';
import PropTypes from 'prop-types';
import {useFavourite, useRating} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Actionbar = ({postData}) => {
  const {
    postFavourite,
    getListOfFavouritesByCurrentUser,
    deleteFavourite,
  } = useFavourite();
  const {postRating, deleteRating, getListOfRatingsByFileId} = useRating();
  const [isWatching, setIsWatching] = useState(false);
  const {update, setUpdate, user} = useContext(MainContext);
  const [isRated, setIsRated] = useState(true);
  const [averagePostRating, setAveragePostRating] = useState(0);

  const addRating = async (rating) => {
    const userToken = await AsyncStorage.getItem('userToken');

    const data = {
      file_id: postData.file_id,
      rating: rating,
    };
    try {
      postRating(data, userToken);
      if (isRated) setIsRated(false);
      setUpdate(update + 1);
    } catch (error) {
      console.log('postRating error: ', error);
    }
  };

  const modifyRating = async (rating) => {
    const userToken = await AsyncStorage.getItem('userToken');

    try {
      await deleteRating(userToken, postData.file_id);

      await addRating(rating);
    } catch (error) {
      console.log(error);
    }
  };

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

  const getRating = async () => {
    let avgRating = 0;
    try {
      const listOfRating = await getListOfRatingsByFileId(postData.file_id);

      const totalRatingArray = await listOfRating.map((item) => item.rating);
      const userRated = listOfRating.filter(
        (item) => item.user_id === user.user_id
      );
      if (userRated.length > 0) {
        setIsRated(false);
        totalRatingArray.map((item) => {
          avgRating = avgRating + item / totalRatingArray.length;
        });
      }
      setAveragePostRating(avgRating);

      // console.log('average rating is ', avgRating);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWatching();
    getRating();
  }, [update]);

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

        {isRated ? (
          <>
            <Text style={styles.ratingText}>Rate this post: </Text>
            <AirbnbRating
              count={5}
              defaultRating={0}
              size={16}
              showRating={false}
              onFinishRating={(rating) => {
                addRating(rating);
              }}
              style={styles.iconContainerRight}
            />
          </>
        ) : (
          <>
            <Text style={styles.ratingText}>Average post rating: </Text>
            <AirbnbRating
              count={5}
              defaultRating={averagePostRating}
              size={16}
              showRating={false}
              onFinishRating={(rating) => {
                modifyRating(rating);
              }}
            />
          </>
        )}
      </View>
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
    marginHorizontal: 15,
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
  ratingText: {
    textAlignVertical: 'center',
    paddingLeft: 10,
    paddingTop: 0,
    fontFamily: 'ProximaSoftRegular',
    fontSize: 16,
    marginLeft: 35,
    color: Colours.primaryBlue,
  },
});

Actionbar.propTypes = {
  postData: PropTypes.object,
};
