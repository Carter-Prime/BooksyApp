import React from 'react';
import {StyleSheet} from 'react-native';
import {CheckBox} from 'react-native-elements';
import PropTypes from 'prop-types';

import Colours from './../utils/Colours';

export const CustomCheckbox = ({label, state, updateState}) => {
  return (
    <CheckBox
      title={label}
      checked={state}
      onPress={() => updateState(label, !state)}
      containerStyle={styles.container}
      textStyle={styles.textStyle}
      checkedColor={Colours.accentOrange}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    backgroundColor: 'white',
    margin: 2,
    padding: 0,
  },
  textStyle: {
    fontFamily: 'ProximaSoftRegular',
    fontWeight: '500',
  },
});

CustomCheckbox.propTypes = {
  label: PropTypes.string,
  state: PropTypes.bool,
  updateState: PropTypes.func,
};
