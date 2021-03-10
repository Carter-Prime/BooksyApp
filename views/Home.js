import React, {useContext, useState} from 'react';
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
import {ChevronDown, ChevronUp} from 'react-native-feather';
import Colours from './../utils/Colours';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Home = ({navigation}) => {
  const {loaded, update} = useContext(MainContext);
  const {
    currentUserFavouritePostArray,
    latestPostsArray,
    currentUserPostArray,
  } = useLoadMedia();
  const {isWatchingVisible} = useContext(MainContext);
  const [showList, setShowList] = useState(true);

  if (!loaded) {
    return <AppLoading onError={console.warn} />;
  }

  return (
    <View contentContainerStyle={styles.container}>
      <StatusBar style="light" />

      <View
        style={{
          marginBottom: -10,
          marginTop: 10,
          flexDirection: 'row',
        }}
      >
        <AnimatedTabHeader />
        <View style={styles.dropDownIconContainer}>
          <TouchableOpacity
            onPress={() => {
              setShowList(!showList);
            }}
          >
            {showList ? (
              <ChevronUp
                strokeWidth={1.5}
                color={Colours.primaryBlue}
                width={30}
                height={30}
              />
            ) : (
              <ChevronDown
                strokeWidth={1.5}
                color={Colours.primaryBlue}
                width={30}
                height={30}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {showList && (
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
          contentContainerStyle={{paddingRight: 40, paddingBottom: 70}}
        />
      )}

      <SectionHeader
        content="Latest Posts"
        containerStyle={showList ? {marginTop: 0} : {marginTop: 10}}
      />
      <ListVertical
        ListHeaderComponent={<></>}
        numColumns={2}
        navigation={navigation}
        loadData={latestPostsArray}
        style={styles.verticalListContainer}
        extraContentContainerStyle={
          showList ? {paddingBottom: 345} : {paddingBottom: 100}
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
    paddingLeft: 17,
  },
  verticalListContainer: {
    marginTop: 10,
    marginLeft: 3,
  },
  dropDownIconContainer: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 8,
    right: 20,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
