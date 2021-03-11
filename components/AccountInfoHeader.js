import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Divider} from 'react-native-elements';
import PropTypes from 'prop-types';
import {Edit} from 'react-native-feather';

import Colours from '../utils/Colours';

const windowWidth = Dimensions.get('window').width;

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
            navigation.navigate('EditProfile');
          }}
        >
          <Edit
            width={32}
            height={32}
            strokeWidth={1.5}
            color={Colours.primaryBlue}
          />
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
    fontSize: 24,
    color: Colours.primaryBlue,
    marginLeft: 20,
    marginTop: 20,
  },
  divider: {
    width: windowWidth * 0.9,
    backgroundColor: Colours.accentOrange,
    marginHorizontal: 20,
    height: 1.5,
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    bottom: 0,
    padding: 4,
    borderRadius: 50,
  },
});

AccountInfoHeader.propTypes = {
  content: PropTypes.string,
  toggleIcon: PropTypes.bool,
  navigation: PropTypes.object,
};
