import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import PropTypes from 'prop-types';

import Colours from './../utils/Colours';

const RoundButton = ({extraStyle, btnStyle, ...otherProps}) => {
  return (
    <Button
      {...otherProps}
      raised
      titleStyle={styles.titleStyle}
      buttonStyle={[styles.buttonStyle, btnStyle]}
      containerStyle={[styles.containerStyle, extraStyle]}
    />
  );
};

export default RoundButton;

const styles = StyleSheet.create({
  buttonStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colours.accentOrange,
  },
  titleStyle: {
    fontFamily: 'ProximaSoftMedium',
    fontSize: 20,
    paddingVertical: 0,
    color: Colours.textDark,
  },
  containerStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colours.accentOrange,
  },
});

RoundButton.propTypes = {
  extraStyle: PropTypes.object,
  btnStyle: PropTypes.object,
};
