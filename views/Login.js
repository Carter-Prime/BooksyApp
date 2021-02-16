import React, {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import AppLoading from 'expo-app-loading';
import {StyleSheet, ImageBackground, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import TitleSvg from '../assets/svg/TitleSvg';
import LoginSelector from '../components/LoginSelector';
import LoginForm from '../components/LoginForm';
import Colours from './../utils/Colours';

const Login = () => {
  const {loaded, setIsLoggedIn} = useContext(MainContext);

  if (!loaded) {
    return <AppLoading onError={console.warn} />;
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/images/loginBackgroundMain.png')}
    >
      <StatusBar backgroundColor="black" style="light" />
      <View style={styles.titleContainer}>
        <TitleSvg width="340" height="120" />
      </View>
      <View style={styles.loginSelector}>
        <LoginSelector />
        <LoginForm />
      </View>
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
    fontFamily: 'ProximaSoftMedium',
    fontSize: 30,
    color: 'white',
  },
  loginSelector: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: Colours.transparentDark,
  },
});

export default Login;
