import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View, ToastAndroid} from 'react-native';
import {Card} from 'react-native-elements';
import {useMedia, useRating} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colours from './../utils/Colours';

const AccountStatisticCard = ({listLength}) => {
  const {update} = useContext(MainContext);
  const {getListOfFilesOfCurrentUser} = useMedia();
  const {getListOfRatingsByFileId} = useRating();
  const [rating, setRating] = useState(0);
  const [numberOfPosts, setNumberOfPosts] = useState(0);

  const announceToast = (message) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM
    );
  };

  useEffect(() => {
    getUserRating();
    getNumberOfPosts();
  }, [update]);

  const calculateRatingPercent = (number) => {
    const value = (number / 5) * 100;
    return value.toFixed(2);
  };

  const getNumberOfPosts = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await getListOfFilesOfCurrentUser(userToken);
      const newArray = await response.filter((item) => {
        if (!item.title.includes('Avatar_')) {
          return item;
        }
      });
      setNumberOfPosts(newArray.length);
    } catch (error) {
      announceToast('Get Number of Posts Failed');
      console.error(error);
    }
  };

  const average = (array) => {
    if (array.length == 0) {
      return 0;
    } else {
      return array.reduce((a, b) => a + b) / array.length;
    }
  };

  const getUserRating = async () => {
    const arrayRatings = [];
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await getListOfFilesOfCurrentUser(userToken);
      const fileRatings = await Promise.all(
        response.map(async (item) => {
          const fileJson = await getListOfRatingsByFileId(item.file_id);
          return fileJson;
        })
      );
      if (fileRatings.length > 0) {
        fileRatings.map((item) => {
          item.map((element) => {
            arrayRatings.push(element.rating);
          });
        });
      }
      if (arrayRatings.length == 0) {
        setRating([0]);
      } else {
        setRating(average(arrayRatings));
      }
    } catch (error) {
      announceToast('Get User Rating Failed');
      console.error(error);
    }
  };

  return (
    <Card containerStyle={styles.card}>
      <View style={styles.cardSection}>
        <Text style={[styles.text, styles.labels]}>User Rating:</Text>
        <Text style={[styles.text, styles.info]}>
          {calculateRatingPercent(rating)}%
        </Text>
      </View>
      <Card.Divider style={styles.divider} />
      <View style={styles.cardSection}>
        <Text style={[styles.text, styles.labels]}>Number of Posts: </Text>
        <Text style={[styles.text, styles.info]}>{numberOfPosts}</Text>
      </View>
      <Card.Divider style={styles.divider} />
      <View style={styles.cardSection}>
        <Text style={[styles.text, styles.labels]}>
          Number of Swapped Books:
        </Text>
        <Text style={[styles.text, styles.info]}>{listLength}</Text>
      </View>
      <Card.Divider style={styles.divider} />
    </Card>
  );
};

export default AccountStatisticCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colours.primaryBlue,
    backgroundColor: Colours.secondaryNeutral,
  },
  cardSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    flex: 1,
    fontFamily: 'ProximaSoftRegular',
    fontSize: 16,
    width: '100%',
    color: Colours.textDark,
    marginLeft: 5,
    marginRight: 5,
    textAlignVertical: 'bottom',
  },
  labels: {
    textAlign: 'left',
    flexGrow: 1.5,
    fontFamily: 'ProximaSoftRegular',
    color: Colours.textDark,
  },
  info: {
    flexGrow: 0.5,
    textAlign: 'right',
  },
  divider: {
    backgroundColor: Colours.accentOrange,
    marginHorizontal: 5,
    height: 0.75,
  },
});

AccountStatisticCard.propTypes = {
  listLength: PropTypes.number,
};
