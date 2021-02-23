import React from 'react';

import {StyleSheet, View, Text} from 'react-native';
import {Divider} from 'react-native-elements';
import PropTypes from 'prop-types';

import Colours from '../utils/Colours';

const SectionHeader = ({navigation, content, ...props}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text} {...props}>
        {content}
      </Text>

      <Divider style={styles.divider} />
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: -20,
  },
  text: {
    fontFamily: 'ProximaSoftRegular',
    fontSize: 30,
    color: Colours.primaryBlue,
    marginLeft: 20,
    marginTop: 20,
  },
  divider: {
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
};
