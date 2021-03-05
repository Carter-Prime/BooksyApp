import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/Variable';
import {Image, ListItem as RNEListItem} from 'react-native-elements';
import Colours from './../utils/Colours';
import {LinearGradient} from 'expo-linear-gradient';

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
      />
      <LinearGradient
        // Background Linear Gradient
        colors={['rgba(0,0,0,0.7)', 'transparent']}
        start={[0, 0]}
        end={[0, 0.4]}
        style={styles.background}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{singleMedia.title}</Text>
      </View>
    </RNEListItem>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    padding: 0,
    width: 180,
    margin: 2,
    borderRadius: 5,
  },
  image: {
    width: 180,
    height: 165,
    borderRadius: 5,
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
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: 180,
    height: 165,
    borderRadius: 5,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  isMyFile: PropTypes.bool,
};

export default ListItem;
