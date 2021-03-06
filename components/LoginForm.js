import React, {useContext} from 'react';
import {View, Alert, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Mail as MailIcon, Lock as LockIcon} from 'react-native-feather';
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
  const {user, setUser, setIsLoggedIn, setUserStats} = useContext(MainContext);

  const doLogin = async () => {
    try {
      const userData = await postLogin(inputs);
      setUser(userData.user);
      const data = JSON.parse(user.full_name);
      setUserStats(data);
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
        leftIcon={<MailIcon strokeWidth={1.5} color={Colours.primaryBlue} />}
      />
      <InputTextBox
        secureTextEntry={true}
        placeholder="password"
        onChangeText={(txt) => {
          handleInputChange('password', txt);
        }}
        leftIcon={<LockIcon strokeWidth={1.5} color={Colours.primaryBlue} />}
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
