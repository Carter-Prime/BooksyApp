import React from 'react';

import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Divider} from 'react-native-elements';
import PropTypes from 'prop-types';
import {Edit} from 'react-native-feather';
import Colours from '../utils/Colours';
import EditProfile from '../views/EditProfile';

const AccountInfoHeader = ({navigation, content, toggleIcon, ...props}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text} {...props}>
        {content}
      </Text>
      {toggleIcon && (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            navigation.navigate(EditProfile);
          }}
        >
          <Edit strokeWidth={1.5} color={Colours.primaryBlue} />
        </TouchableOpacity>
      )}
      <Divider style={styles.divider} />
    </View>
  );
};

export default AccountInfoHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
  iconContainer: {
    position: 'absolute',
    right: 20,
    bottom: 3,
    padding: 4,
    borderRadius: 50,
  },
});

AccountInfoHeader.propTypes = {
  content: PropTypes.string,
  toggleIcon: PropTypes.bool,
  navigation: PropTypes.object,
};
