import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AppLoading from 'expo-app-loading';
import SectionHeader from '../components/SectionHeader';
import List from '../components/List';
import {useLoadMedia} from '../hooks/LoadMediaHooks';
import ListVertical from './../components/ListVertical';

const Home = ({navigation}) => {
  const {loaded} = useContext(MainContext);
  const {currentUserFavouritePostArray, latestPostsArray} = useLoadMedia();

  if (!loaded) {
    return <AppLoading onError={console.warn} />;
  }

  return (
    <View contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="black" style="light" />
      <SectionHeader content="Watching" />
      <List
        navigation={navigation}
        loadData={currentUserFavouritePostArray}
        horizontal
        style={{height: 200, marginTop: 10}}
      />
      <SectionHeader content="Latest Posts" />
      <ListVertical
        navigation={navigation}
        loadData={latestPostsArray}
        style={{height: '70%', marginTop: 10}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontFamily: 'ProximaSoftMedium',
    fontSize: 30,
  },
  lastestPostContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: 10,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
