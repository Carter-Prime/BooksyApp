import React, {useContext, useState} from 'react';
import {View, StyleSheet, ToastAndroid, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {
  Mail as MailIcon,
  Lock as LockIcon,
  Eye as EyeIcon,
} from 'react-native-feather';
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
  const [isShown, setIsShown] = useState(true);

  const announceToast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
      0,
      -180
    );
  };

  const doLogin = async () => {
    try {
      const userData = await postLogin(inputs);
      setUser(userData.user);
      await AsyncStorage.setItem('userToken', userData.token);
      await setIsLoggedIn(true);
    } catch (error) {
      announceToast('Invalid username or password');
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
        secureTextEntry={isShown}
        placeholder="password"
        onChangeText={(txt) => {
          handleInputChange('password', txt);
        }}
        leftIcon={<LockIcon strokeWidth={1.5} color={Colours.primaryBlue} />}
        rightIcon={
          <TouchableOpacity
            onPress={() => {
              setIsShown(!isShown);
            }}
          >
            <EyeIcon strokeWidth={1.5} color={Colours.primaryBlue} />
          </TouchableOpacity>
        }
      />
      <CustomButton
        title="Login"
        onPress={doLogin}
        extraStyle={{marginTop: 30}}
      />
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
