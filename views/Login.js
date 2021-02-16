import React, {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import AppLoading from 'expo-app-loading';
import {StyleSheet, ImageBackground, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import TitleSvg from '../assets/svg/TitleSvg';
import LoginSelector from '../components/LoginSelector';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import Colours from './../utils/Colours';
import {SafeAreaView} from 'react-native-safe-area-context';

const Login = () => {
  const {loaded, signInScreen} = useContext(MainContext);
  console.log(signInScreen);

  if (!loaded) {
    return <AppLoading onError={console.warn} />;
  }

  return (
    <SafeAreaView style={styles.view}>
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
          {signInScreen ? <LoginForm /> : <RegisterForm />}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff4',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    backgroundColor: Colours.transparentDark,
    marginTop: 200,
  },
});

export default Login;
