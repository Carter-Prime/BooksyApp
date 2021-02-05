import React, {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import AppLoading from 'expo-app-loading';
import {StyleSheet, Text, ImageBackground} from 'react-native';
import {StatusBar} from 'expo-status-bar';

const Login = () => {
  const {loaded} = useContext(MainContext);

  if (!loaded) {
    console.log('loaded: ', loaded);
    return <AppLoading onError={console.warn} />;
  }
  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/images/loginBackground.png')}
    >
      <StatusBar backgroundColor="black" style="light" />
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
  text: {
    fontFamily: 'ProximaSoftMedium',
  },
});

export default Login;
