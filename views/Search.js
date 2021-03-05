import React, {useContext, useRef, useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AppLoading from 'expo-app-loading';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const Search = ({navigation}) => {
  const {loaded} = useContext(MainContext);
  const tabAnimation1 = require('../assets/lottie/WatchingNoText.json');
  const tabAnimation2 = require('../assets/lottie/MyPostNoText.json');

  const watchingAnimation = useRef();
  const myPostAnimation = useRef();
  const [isVisible, setIsVisible] = useState(true);

  const playWatchingAnimation = () => {
    watchingAnimation.current.play(0, 149);
  };

  const playMyPostAnimation = () => {
    myPostAnimation.current.play(0, 149);
  };

  useEffect(() => {
    isVisible ? playWatchingAnimation() : playMyPostAnimation();
  }, [isVisible]);

  if (!loaded) {
    console.log('loaded: ', loaded);
    return <AppLoading onError={console.warn} />;
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.animationContainer}>
          {isVisible ? (
            <LottieView
              ref={watchingAnimation}
              source={tabAnimation1}
              loop={false}
              autoPlay={false}
              progress={0}
              style={styles.animation}
            />
          ) : (
            <LottieView
              ref={myPostAnimation}
              source={tabAnimation2}
              loop={false}
              autoPlay={false}
              progress={0}
              style={styles.animation}
            />
          )}
        </View>
        <View style={styles.textContainer}>
          <TouchableOpacity
            onPress={() => {
              setIsVisible(true);
            }}
          >
            <Text style={styles.text}>Watching</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsVisible(false);
            }}
          >
            <Text style={styles.text}>My Posts</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  animationContainer: {
    marginLeft: 0,
    borderWidth: 2,
  },
  animation: {
    width: windowWidth * 1.1,
    marginLeft: -3,
  },
  textContainer: {
    width: windowWidth * 0.7,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 50,
    position: 'absolute',
    top: 10,
  },
  text: {
    fontFamily: 'ProximaSoftRegular',
    fontSize: 24,
    marginRight: 50,
  },
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
