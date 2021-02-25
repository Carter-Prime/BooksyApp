import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/Variable';
import {Image, ListItem as RNEListItem} from 'react-native-elements';
import Colours from '../utils/Colours';

const LargeListItem = ({navigation, singleMedia}) => {
  return (
    <RNEListItem
      containerStyle={styles.itemContainer}
      bottomDivider
      onPress={() => {
        // navigation.navigate('Details', {file: singleMedia});
      }}
    >
      <Image
        style={styles.image}
        source={{uri: uploadsUrl + singleMedia.thumbnails.w160}}
      ></Image>

      <RNEListItem.Title style={styles.title}>
        {singleMedia.title}
      </RNEListItem.Title>
      <RNEListItem.Subtitle style={styles.subtitle}>
        {singleMedia.description}
      </RNEListItem.Subtitle>
    </RNEListItem>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    padding: 0,
    width: 300,
    margin: 2,
  },
  image: {
    width: 300,
    height: 300,
  },
  title: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    paddingHorizontal: 4,
    paddingVertical: 0,
    fontFamily: 'ProximaSoftMedium',
    color: Colours.textLight,
    backgroundColor: Colours.transparentDark,
    fontSize: 36,
  },
  subtitle: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingHorizontal: 4,
    paddingVertical: 0,
    fontFamily: 'ProximaSoftMedium',
    color: Colours.textLight,
    backgroundColor: Colours.transparentDark,
    fontSize: 30,
  },
});

LargeListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  isMyFile: PropTypes.bool,
};

export default LargeListItem;
