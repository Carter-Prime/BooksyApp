import React from 'react';
import {StyleSheet} from 'react-native';
import {Input} from 'react-native-elements';
import Colours from './../utils/Colours';
import PropTypes from 'prop-types';

const InputTextBox = ({extraInputContainerStyle, ...otherProps}) => {
  return (
    <Input
      {...otherProps}
      autoCapitalize="none"
      containerStyle={styles.containerStyle}
      inputStyle={styles.inputStyle}
      inputContainerStyle={[
        styles.inputContainerStyle,
        extraInputContainerStyle,
      ]}
      placeholderTextColor={Colours.placeholderText}
      leftIconContainerStyle={styles.leftIconContainerStyle}
      rightIconContainerStyle={styles.rightIconContainerStyle}
    />
  );
};

export default InputTextBox;

const styles = StyleSheet.create({
  containerStyle: {
    marginLeft: 10,
    marginRight: 10,
    width: '95%',
  },
  inputStyle: {
    fontFamily: 'ProximaSoftRegular',
    paddingLeft: 10,
    padding: 4,
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
  rightIconContainerStyle: {
    marginTop: 0,
    marginVertical: 0,
    marginRight: 5,
    paddingVertical: 1,
  },
});

InputTextBox.propTypes = {
  extraInputContainerStyle: PropTypes.object,
};
