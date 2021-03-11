import React, {useContext, useEffect, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SearchComponent from '../components/SearchComponent';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import SectionHeader from '../components/SectionHeader';
import ListVertical from '../components/ListVertical';
import SearchBrowserComponent from '../components/SearchBrowserComponent';
import LottieView from 'lottie-react-native';
import {Dimensions} from 'react-native';
import Colours from './../utils/Colours';

const windowWidth = Dimensions.get('window').width;

const Search = ({navigation}) => {
  const {searchResultArray, searchIsEmpty, setSearchIsEmpty} = useContext(
    MainContext
  );
  const loadingSpinAnimation = require('../assets/lottie/data.json');
  const loadAnimation = useRef();
  useEffect(() => {
    setSearchIsEmpty(false);
  }, []);

  return (
    <ListVertical
      ListHeaderComponent={
        <>
          <SearchBrowserComponent />
          <SearchComponent />
          <SectionHeader
            content="Search Result"
            containerStyle={{marginTop: 10, marginBottom: 10}}
          />
          {searchIsEmpty && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: -30,
              }}
            >
              <LottieView
                ref={loadAnimation}
                source={loadingSpinAnimation}
                loop={true}
                autoPlay={true}
                progress={0}
                style={styles.animation}
              />
              <Text style={styles.text}>...Search was empty!</Text>
            </View>
          )}
        </>
      }
      numColumns={2}
      navigation={navigation}
      loadData={searchResultArray}
      style={styles.verticalListContainer}
      load
    />
  );
};

export default Search;

Search.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  verticalListContainer: {
    marginTop: 10,
    marginLeft: 3,
    backgroundColor: 'white',
  },
  animation: {
    width: windowWidth * 0.5,
    marginLeft: 0,
  },
  text: {
    fontFamily: 'ProximaSoftMedium',
    fontSize: 18,
    color: Colours.primaryBlue,
  },
});
