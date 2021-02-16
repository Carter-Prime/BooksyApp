import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import Colours from './../utils/Colours';

const CustomButton = ({...otherProps}) => {
  return (
    <Button
      {...otherProps}
      raised
      titleStyle={styles.titleStyle}
      buttonStyle={styles.buttonStyle}
      containerStyle={styles.containerStyle}
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
    width: '85%',
    marginLeft: 30,
    marginRight: 30,
  },
});
