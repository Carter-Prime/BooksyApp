import React from 'react';
import {StyleSheet} from 'react-native';
import {Input} from 'react-native-elements';
import Colours from './../utils/Colours';

const InputTextBox = ({...otherProps}) => {
  return (
    <Input
      {...otherProps}
      autoCapitalize="none"
      containerStyle={styles.containerStyle}
      inputStyle={styles.inputStyle}
      inputContainerStyle={styles.inputContainerStyle}
      placeholderTextColor={Colours.placeholderText}
      leftIconContainerStyle={styles.leftIconContainerStyle}
    />
  );
};

export default InputTextBox;

const styles = StyleSheet.create({
  containerStyle: {
    marginLeft: 20,
    marginRight: 20,
    width: '90%',
  },
  inputStyle: {
    fontFamily: 'ProximaSoftRegular',
    paddingLeft: 10,
  },
  inputContainerStyle: {
    backgroundColor: Colours.transparentLight,
    borderRadius: 5,
  },
  leftIconContainerStyle: {
    marginTop: 0,
    marginVertical: 0,
    marginLeft: 5,
    paddingVertical: 1,
  },
});
