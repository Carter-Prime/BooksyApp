import React, {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import AppLoading from 'expo-app-loading';
import {StyleSheet, ImageBackground, View, Button} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import TitleOutline from '../assets/svg/TitleOutline';
import LoginSelector from '../components/LoginSelector';

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
        <TitleOutline width="350" height="120" />
      </View>
      <View style={styles.loginSelector}>
        <LoginSelector />
      </View>

      <Button
        title="Login"
        onPress={() => {
          setIsLoggedIn(true);
        }}
      />
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
    flex: 0.1,
    width: '100%',
    marginBottom: 40,
  },
});

export default Login;
