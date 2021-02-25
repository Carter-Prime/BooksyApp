import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AppLoading from 'expo-app-loading';
import Colours from './../utils/Colours';
import SectionHeader from '../components/SectionHeader';
import List from '../components/List';
import {useLoadMedia} from '../hooks/LoadMediaHooks';
import ListVertical from './../components/ListVertical';

const Home = ({navigation}) => {
  const {loaded} = useContext(MainContext);
  const {currentUserFavouritePostArray} = useLoadMedia();

  if (!loaded) {
    return <AppLoading onError={console.warn} />;
  }

  return (
    <View contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="black" style="light" />
      <SectionHeader content="Favourite Posts" />
      <List
        loadData={currentUserFavouritePostArray}
        horizontal
        style={{height: '30%', marginTop: 10}}
      />
      <SectionHeader content="Latest Posts" containerStyle={{marginTop: -20}} />
      <ListVertical
        loadData={currentUserFavouritePostArray}
        style={{height: '70%', marginTop: 10}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.secondaryNeutral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'ProximaSoftMedium',
    fontSize: 30,
  },
  lastestPostContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
