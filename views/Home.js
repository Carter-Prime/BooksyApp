import React, {useContext} from 'react';
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

  if (!loaded) {
    return <AppLoading onError={console.warn} />;
  }

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
        contentContainerStyle={{paddingRight: 40}}
      />
      <SectionHeader content="Latest Posts" />
      <ListVertical
        numColumns={2}
        navigation={navigation}
        loadData={latestPostsArray}
        style={styles.verticalListContainer}
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
    marginLeft: 0,
    marginRight: 0,
    paddingBottom: 10,
    paddingLeft: 20,
  },
  verticalListContainer: {
    height: '70%',
    marginTop: 10,
    marginLeft: 10,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
