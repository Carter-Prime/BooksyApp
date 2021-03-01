import React, {useContext} from 'react';
import {StyleSheet, Alert, View} from 'react-native';
import PropTypes from 'prop-types';
import {
  User as UserIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  Check as CheckIcon,
} from 'react-native-feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {MainContext} from '../contexts/MainContext';
import InputTextBox from '../components/InputTextBox';
import CustomButton from '../components/CustomButton';
import Colours from './../utils/Colours';
import {useAuthentication, useUser} from '../hooks/ApiHooks';
import useSignUpForm from '../hooks/RegisterHooks';

const RegisterForm = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {
    inputs,
    handleInputChange,
    handleInputEnd,
    checkUserAvailable,
    registerErrors,
    validateOnSend,
    isUsernameAvailable,
    isEmailAvailable,
    isPasswordAvailable,
    doPasswordMatch,
  } = useSignUpForm();
  const {registerNewUser} = useUser();
  const {postLogin} = useAuthentication();

  const doRegister = async () => {
    if (!validateOnSend()) {
      console.log('validator on send failed');
      return;
    }

    delete inputs.confirmPassword;

    try {
      const result = await registerNewUser(inputs);
      console.log('doRegister ok', result.message);
      Alert.alert(result.message);
      const userData = await postLogin(inputs);
      await AsyncStorage.setItem('userToken', userData.token);
      setUser(userData.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.log('registration error', error);
      Alert.alert(error.message);
    }
  };

  const checkIcon = () => {
    if (isUsernameAvailable) {
      return <CheckIcon strokeWidth={1.5} size={24} color="green" />;
    }
  };

  const checkIconEmail = () => {
    if (isEmailAvailable) {
      return <CheckIcon strokeWidth={1.5} size={24} color="green" />;
    }
  };

  const checkIconPassword = () => {
    if (isPasswordAvailable) {
      return <CheckIcon strokeWidth={1.5} size={24} color="green" />;
    }
  };
  const checkIconConfirmPassword = () => {
    if (doPasswordMatch) {
      return <CheckIcon strokeWidth={1.5} size={24} color="green" />;
    }
  };

  return (
    <View style={styles.view}>
      <InputTextBox
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
        onEndEditing={(event) => {
          checkUserAvailable(event);
          handleInputEnd('username', event.nativeEvent.text);
        }}
        errorMessage={registerErrors.username}
        leftIcon={
          <UserIcon strokeWidth={1.5} size={24} color={Colours.textDark} />
        }
        rightIcon={checkIcon}
      />
      <InputTextBox
        placeholder="email"
        onChangeText={(txt) => handleInputChange('email', txt)}
        onEndEditing={(event) => {
          handleInputEnd('email', event.nativeEvent.text);
        }}
        errorMessage={registerErrors.email}
        leftIcon={
          <MailIcon strokeWidth={1.5} size={24} color={Colours.textDark} />
        }
        rightIcon={checkIconEmail}
      />
      <InputTextBox
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        onEndEditing={(event) =>
          handleInputEnd('password', event.nativeEvent.text)
        }
        secureTextEntry={true}
        errorMessage={registerErrors.password}
        leftIcon={
          <LockIcon strokeWidth={1.5} size={24} color={Colours.textDark} />
        }
        rightIcon={checkIconPassword}
      />
      <InputTextBox
        placeholder="confirm password"
        onChangeText={(txt) => handleInputChange('confirmPassword', txt)}
        onEndEditing={(event) =>
          handleInputEnd('confirmPassword', event.nativeEvent.text)
        }
        secureTextEntry={true}
        errorMessage={registerErrors.confirmPassword}
        leftIcon={
          <LockIcon strokeWidth={1.5} size={24} color={Colours.textDark} />
        }
        rightIcon={checkIconConfirmPassword}
      />
      <CustomButton title="Register" onPress={doRegister} />
    </View>
  );
};

RegisterForm.propTypes = {
  navigation: PropTypes.object,
};

export default RegisterForm;

const styles = StyleSheet.create({
  view: {
    width: '100%',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 20,
  },
});
