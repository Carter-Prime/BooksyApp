import React, {useContext} from 'react';
import {View, Alert, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Feather} from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useAuthentication} from '../hooks/ApiHooks';
import useLoginForm from '../hooks/LoginHooks';
import InputTextBox from '../components/InputTextBox';
import CustomButton from '../components/CustomButton';
import Colours from './../utils/Colours';
import {MainContext} from '../contexts/MainContext';

const LoginForm = ({navigation}) => {
  const {inputs, handleInputChange} = useLoginForm();
  const {postLogin} = useAuthentication();
  const {setUser, setIsLoggedIn} = useContext(MainContext);

  const doLogin = async () => {
    try {
      const userData = await postLogin(inputs);
      setUser(userData.user);
      await AsyncStorage.setItem('userToken', userData.token);
      await setIsLoggedIn(true);
    } catch (error) {
      console.log(error.message);
      Alert.alert('Invalid username or password');
    }
  };

  return (
    <View contentContainerStyle={styles.view}>
      <InputTextBox
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
        leftIcon={<Feather name="mail" size={24} color={Colours.textDark} />}
      />
      <InputTextBox
        secureTextEntry={true}
        placeholder="password"
        onChangeText={(txt) => {
          handleInputChange('password', txt);
        }}
        leftIcon={<Feather name="lock" size={24} color={Colours.textDark} />}
      />
      <CustomButton title="Login" onPress={doLogin} />
    </View>
  );
};

LoginForm.propTypes = {
  navigation: PropTypes.object,
};

export default LoginForm;

const styles = StyleSheet.create({
  view: {
    width: '100%',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 20,
  },
});
