import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colours from './../utils/Colours';

const EditPost = () => {
  return (
    <View>
      <Text style={styles.text}></Text>
    </View>
  );
};

export default EditPost;

const styles = StyleSheet.create({
  text: {
    color: Colours.textDark,
  },
});
