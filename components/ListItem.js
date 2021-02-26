import React from 'react';
import {StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/Variable';
import {Image, ListItem as RNEListItem} from 'react-native-elements';
import Colours from './../utils/Colours';
import {BlurView} from 'expo-blur';

const ListItem = ({navigation, singleMedia}) => {
  return (
    <RNEListItem
      containerStyle={styles.itemContainer}
      underlayColor={Colours.transparentLight}
      bottomDivider
      onPress={() => {
        navigation.navigate('Details', {file: singleMedia});
      }}
    >
      <Image
        style={styles.image}
        source={{uri: uploadsUrl + singleMedia.thumbnails.w160}}
      ></Image>

      <BlurView intensity={20} tint="dark" style={styles.titleContainer}>
        <Text style={styles.title}>{singleMedia.title}</Text>
      </BlurView>
    </RNEListItem>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    padding: 0,
    width: 180,
    margin: 2,
    borderRadius: 3,
  },
  image: {
    width: 180,
    height: 165,
    borderRadius: 3,
  },
  title: {
    width: '100%',
    paddingHorizontal: 4,
    paddingVertical: 0,
    fontFamily: 'ProximaSoftMedium',
    color: Colours.textLight,
    fontSize: 24,
    textAlign: 'center',
  },
  titleContainer: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  isMyFile: PropTypes.bool,
};

export default ListItem;
