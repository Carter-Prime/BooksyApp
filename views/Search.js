import React, {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import AppLoading from 'expo-app-loading';
import {StyleSheet, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';

const Search = ({navigation}) => {
  const {loaded} = useContext(MainContext);

  if (!loaded) {
    console.log('loaded: ', loaded);
    return <AppLoading onError={console.warn} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'ProximaSoftMedium',
    fontSize: 30,
  },
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
