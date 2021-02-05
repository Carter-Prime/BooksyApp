import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';

const Details = ({route}) => {
  const {customText} = route.params;
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <Text>{customText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Details.propTypes = {
  customText: PropTypes.string,
  route: PropTypes.object,
};

export default Details;
