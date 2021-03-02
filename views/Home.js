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
import AnimatedTabHeader from './../components/animatedTabHeader';

const Home = ({navigation}) => {
  const {loaded} = useContext(MainContext);
  const {
    currentUserFavouritePostArray,
    latestPostsArray,
    currentUserPostArray,
  } = useLoadMedia();
  const {isWatchingVisible} = useContext(MainContext);

  if (!loaded) {
    return <AppLoading onError={console.warn} />;
  }

  return (
    <View contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="black" style="light" />
      <View style={{marginBottom: -10, marginTop: 10}}>
        <AnimatedTabHeader />
      </View>

      <List
        navigation={navigation}
        loadData={
          isWatchingVisible
            ? currentUserFavouritePostArray
            : currentUserPostArray
        }
        horizontal
        style={styles.horizontalListContainer}
      />
      <SectionHeader content="Latest Posts" />
      <ListVertical
        numColumns={2}
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
  horizontalListContainer: {
    height: 210,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 10,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
