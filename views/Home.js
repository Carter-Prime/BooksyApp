import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AppLoading from 'expo-app-loading';
import SectionHeader from '../components/SectionHeader';
import List from '../components/List';
import {useLoadMedia} from '../hooks/LoadMediaHooks';
import ListVertical from './../components/ListVertical';
import AnimatedTabHeader from './../components/animatedTabHeader';
import {StatusBar} from 'expo-status-bar';

const Home = ({navigation}) => {
  const {loaded, update} = useContext(MainContext);
  const {
    currentUserFavouritePostArray,
    latestPostsArray,
    currentUserPostArray,
  } = useLoadMedia();
  const {isWatchingVisible} = useContext(MainContext);
  const [isEmptyList, setIsEmpty] = useState(false);

  if (!loaded) {
    return <AppLoading onError={console.warn} />;
  }

  useEffect(() => {
    isEmpty();
  }, [isWatchingVisible]);

  const isEmpty = () => {
    if (isWatchingVisible) {
      if (currentUserFavouritePostArray.length == 0) {
        setIsEmpty(true);
      } else {
        setIsEmpty(false);
      }
    } else {
      if (currentUserPostArray.length == 0) {
        setIsEmpty(true);
      } else {
        setIsEmpty(false);
      }
    }
  };

  return (
    <View contentContainerStyle={styles.container}>
      <StatusBar style="light" />

      <View style={{marginBottom: -10, marginTop: 10}}>
        <AnimatedTabHeader />
      </View>

      <List
        navigation={navigation}
        extraData={update}
        loadData={
          isWatchingVisible
            ? currentUserFavouritePostArray
            : currentUserPostArray
        }
        horizontal
        style={styles.horizontalListContainer}
        contentContainerStyle={
          isEmptyList
            ? {paddingRight: 40, paddingBottom: 0}
            : {paddingRight: 40, paddingBottom: 70}
        }
      />
      <SectionHeader content="Latest Posts" />
      <ListVertical
        numColumns={2}
        navigation={navigation}
        loadData={latestPostsArray}
        style={styles.verticalListContainer}
        extraContentContainerStyle={
          isEmptyList ? {paddingBottom: 100} : {paddingBottom: 335}
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  horizontalListContainer: {
    marginTop: 10,
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 20,
  },
  verticalListContainer: {
    marginTop: 10,
    marginLeft: 10,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
