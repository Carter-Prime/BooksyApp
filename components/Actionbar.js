import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ToastAndroid,
} from 'react-native';
import {AirbnbRating} from 'react-native-elements';
import {Eye, BookOpen} from 'react-native-feather';
import Colours from './../utils/Colours';
import PropTypes from 'prop-types';
import {useFavourite, useRating, useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Actionbar = ({postData, isDeleted}) => {
  const {
    postFavourite,
    getListOfFavouritesByCurrentUser,
    deleteFavourite,
  } = useFavourite();
  const {postRating, deleteRating, getListOfRatingsByFileId} = useRating();
  const {updateFile} = useMedia();
  const [isWatching, setIsWatching] = useState(false);
  const {update, setUpdate, user} = useContext(MainContext);
  const [isRated, setIsRated] = useState(true);
  const [averagePostRating, setAveragePostRating] = useState(0);
  const [isSwapped, setIsSwapped] = useState(false);
  const {getFileById} = useMedia();
  let moreData = {};

  const checkSwapped = async () => {
    if (isDeleted) {
      return;
    }
    try {
      const fileData = await getFileById(postData.file_id);
      moreData = JSON.parse(fileData.description);
    } catch (error) {
      console.log(error);
    } finally {
      moreData.swapped ? setIsSwapped(true) : setIsSwapped(false);
    }
  };

  const addSwapped = async () => {
    const newData = {
      description: moreData.description,
      swapped: true,
    };
    const data = {
      title: postData.title,
      description: JSON.stringify(newData),
    };

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      await updateFile(postData.file_id, data, userToken);
      setUpdate(update + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const removeSwapped = async () => {
    const newData = {
      description: moreData.description,
      swapped: false,
    };
    const data = {
      title: postData.title,
      description: JSON.stringify(newData),
    };

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      await updateFile(postData.file_id, data, userToken);
      setUpdate(update + 1);
    } catch (error) {
      console.error(error);
    }
  };

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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWatching();
    getRating();
    checkSwapped();
  }, [update]);

  return (
    <>
      <View style={styles.container}>
        <View>
          {isWatching ? (
            <View style={styles.iconView}>
              <TouchableOpacity
                onPress={() => {
                  removeWatching();
                }}
              >
                <Eye
                  width={30}
                  height={30}
                  strokeWidth={1.5}
                  color={Colours.primaryBlue}
                  fill={Colours.accentOrange}
                />
              </TouchableOpacity>
              <Text style={styles.iconText}>Watching</Text>
            </View>
          ) : (
            <View style={styles.iconView}>
              <TouchableOpacity
                onPress={() => {
                  addWatching();
                }}
              >
                <Eye
                  width={30}
                  height={30}
                  strokeWidth={1.5}
                  color={Colours.primaryBlue}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View>
          {isSwapped ? (
            <View style={styles.iconView}>
              <TouchableOpacity
                onPress={() => {
                  if (postData.user_id === user.user_id) {
                    removeSwapped();
                  }
                }}
              >
                <BookOpen
                  width={30}
                  height={30}
                  strokeWidth={1.5}
                  color={Colours.primaryBlue}
                  fill={Colours.accentOrange}
                />
              </TouchableOpacity>
              <Text style={styles.iconText}>Swapped</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (postData.user_id === user.user_id) {
                  addSwapped();
                } else {
                  ToastAndroid.showWithGravity(
                    'This is not your post. You cannot swap it!',
                    ToastAndroid.CENTER,
                    ToastAndroid.LONG
                  );
                }
              }}
            >
              <BookOpen
                width={30}
                height={30}
                strokeWidth={1.5}
                color={Colours.primaryBlue}
              />
            </TouchableOpacity>
          )}
        </View>

        {isRated ? (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>Rate this post: </Text>
            <AirbnbRating
              count={5}
              defaultRating={0}
              size={16}
              showRating={false}
              onFinishRating={(rating) => {
                addRating(rating);
                ToastAndroid.showWithGravity(
                  'Rating has been updated!',
                  ToastAndroid.CENTER,
                  ToastAndroid.LONG
                );
              }}
              style={styles.iconContainerRight}
            />
          </View>
        ) : (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>Average post rating: </Text>
            <AirbnbRating
              count={5}
              defaultRating={averagePostRating}
              size={16}
              showRating={false}
              onFinishRating={(rating) => {
                modifyRating(rating);
                ToastAndroid.showWithGravity(
                  'Rating has been updated!',
                  ToastAndroid.CENTER,
                  ToastAndroid.LONG
                );
              }}
            />
          </View>
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
    height: 40,
  },
  iconContainerLeft: {
    width: 80,
    flexDirection: 'row',
    paddingRight: 10,
  },
  iconContainerRight: {
    width: 100,
    flexDirection: 'row',
    paddingLeft: 5,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colours.accentOrange,
    marginTop: 20,
  },
  ratingContainer: {
    width: 250,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ratingText: {
    textAlignVertical: 'center',
    paddingLeft: 10,
    paddingTop: 0,
    fontFamily: 'ProximaSoftRegular',
    fontSize: 16,
    color: Colours.primaryBlue,
  },
  iconText: {
    fontFamily: 'ProximaSoftRegular',
    fontSize: 10,
  },
  iconView: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

Actionbar.propTypes = {
  postData: PropTypes.object,
  isDeleted: PropTypes.bool,
};
