import React, {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import AppLoading from 'expo-app-loading';
import {StyleSheet, Text, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';

const Details = ({route}) => {
  const {customText} = route.params;
  const {loaded} = useContext(MainContext);

  if (!loaded) {
    console.log('loaded: ', loaded);
    return <AppLoading onError={console.warn} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" style="light" />
      <Text style={styles.text}>{customText}</Text>
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
  text: {
    fontFamily: 'ProximaSoftRegular',
  },
});

Details.propTypes = {
  customText: PropTypes.string,
  route: PropTypes.object,
};

export default Details;
