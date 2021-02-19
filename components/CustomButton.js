import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import Colours from './../utils/Colours';
import PropTypes from 'prop-types';

const CustomButton = ({extraStyle, ...otherProps}) => {
  return (
    <Button
      {...otherProps}
      raised
      titleStyle={styles.titleStyle}
      buttonStyle={styles.buttonStyle}
      containerStyle={[styles.containerStyle, extraStyle]}
    />
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: Colours.accentOrange,
  },
  titleStyle: {
    fontFamily: 'ProximaSoftMedium',
    fontSize: 20,
    paddingVertical: 0,
    color: Colours.textDark,
  },
  containerStyle: {
    width: '90%',
    marginLeft: 20,
    marginTop: 20,
  },
});

CustomButton.propTypes = {
  extraStyle: PropTypes.object,
};
