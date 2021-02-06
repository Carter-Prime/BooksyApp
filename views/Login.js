import React from 'react';

import {StyleSheet, Text, ImageBackground, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import TitleOutline from '../assets/svg/TitleOutline';
import Colours from './../utils/Colours';
import {useFonts} from 'expo-font';

const Login = () => {
  const {loaded} = useFonts({
    McLarenRegular: require('../assets/fonts/McLaren-Regular.ttf'),
    ProximaSoftMedium: require('../assets/fonts/ProximaSoft-Medium.ttf'),
    ProximaSoftRegular: require('../assets/fonts/ProximaSoft-Regular.ttf'),
  });

  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/images/loginBackgroundMain.png')}
    >
      <StatusBar backgroundColor="black" style="light" />
      <View style={styles.titleContainer}>
        <TitleOutline width={350} height={120} />
      </View>
      <Text style={styles.text}>Login Page</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    position: 'absolute',
    top: 40,
  },
  text: {
    fontFamily: 'McLarenRegular',
    color: Colours.textLight,
    fontSize: 30,
  },
});

export default Login;
