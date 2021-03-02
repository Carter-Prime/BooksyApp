import React from 'react';

import {StyleSheet, View, Text} from 'react-native';
import {Divider} from 'react-native-elements';
import PropTypes from 'prop-types';
import Colours from '../utils/Colours';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const SectionHeader = ({
  navigation,
  content,
  containerStyle,
  dividerStyle,
  textStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.text, textStyle]} {...props}>
        {content}
      </Text>

      <Divider style={[styles.divider, dividerStyle]} />
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
  },
  text: {
    fontFamily: 'ProximaSoftRegular',
    fontSize: 24,
    color: Colours.primaryBlue,
    marginLeft: 20,
  },
  divider: {
    width: windowWidth * 0.9,
    backgroundColor: Colours.accentOrange,
    marginHorizontal: 20,
    height: 1.5,
  },
  editIcon: {
    position: 'absolute',
    right: 20,
    bottom: 2,
    borderRadius: 10,
    padding: 5,
    color: Colours.primaryBlue,
    backgroundColor: Colours.secondaryNeutral,
  },
});

SectionHeader.propTypes = {
  content: PropTypes.string,
  navigation: PropTypes.object,
  containerStyle: PropTypes.object,
  dividerStyle: PropTypes.object,
  textStyle: PropTypes.object,
};
