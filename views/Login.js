import React, {useContext, useEffect} from 'react';
import AppLoading from 'expo-app-loading';
import {StyleSheet, ImageBackground, View} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

import {MainContext} from '../contexts/MainContext';
import TitleSvg from '../assets/svg/TitleSvg';
import {useUser} from '../hooks/ApiHooks';
import LoginSelector from '../components/LoginSelector';

const Login = ({navigation}) => {
  const {loaded, setIsLoggedIn, setUser} = useContext(MainContext);
  const {checkCurrentUserToken} = useUser();

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      try {
        const userData = await checkCurrentUserToken(userToken);
        setUser(userData);
        setIsLoggedIn(true);
        navigation.navigate('Home');
      } catch (error) {
        console.log('token check failed', error.message);
      }
    }
  };
  useEffect(() => {
    getToken();
  }, []);

  if (!loaded) {
    return <AppLoading onError={console.warn} />;
  }

  return (
    <View style={styles.view}>
      <ImageBackground
        style={styles.container}
        source={require('../assets/images/loginBackgroundDark.png')}
      >
        <TitleSvg width="340" height="120" style={styles.titleContainer} />
        <LoginSelector />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleContainer: {
    marginTop: 30,
    marginBottom: 10,
  },
  text: {
    fontFamily: 'ProximaSoftMedium',
    fontSize: 30,
    color: 'white',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
