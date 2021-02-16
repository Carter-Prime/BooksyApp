import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colours from './../utils/Colours';

const SearchResult = () => {
  return (
    <View>
      <Text style={styles.text}></Text>
    </View>
  );
};

export default SearchResult;

const styles = StyleSheet.create({
  text: {
    color: Colours.textDark,
  },
});
