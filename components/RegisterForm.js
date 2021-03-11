import React, {useContext, useState} from 'react';
import {StyleSheet, View, ToastAndroid, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {
  User as UserIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  Check as CheckIcon,
  Eye as EyeIcon,
} from 'react-native-feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useConfirm} from 'react-native-confirm-dialog';

import {MainContext} from '../contexts/MainContext';
import InputTextBox from '../components/InputTextBox';
import CustomButton from '../components/CustomButton';
import Colours from './../utils/Colours';
import {useAuthentication, useUser} from '../hooks/ApiHooks';
import useSignUpForm from '../hooks/RegisterHooks';

const RegisterForm = ({navigation}) => {
  const confirmRegister = useConfirm();
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
  } = useSignUpForm();
  const {registerNewUser} = useUser();
  const {postLogin} = useAuthentication();
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

  const doRegister = async () => {
    if (!validateOnSend()) {
      return;
    }

    delete inputs.confirmPassword;

    const additionalUserData = {
      fullName: '',
      favouriteBook: '',
      booksSwapped: 0,
      rating: '100%',
      numberOfPosts: 0,
    };

    const registerData = {
      username: inputs.username,
      email: inputs.email,
      password: inputs.password,
      full_name: JSON.stringify(additionalUserData),
    };

    try {
      await registerNewUser(registerData);
      confirmRegister({
        title: 'Registration was Successful!',
        titleStyle: {fontFamily: 'ProximaSoftRegular'},
        buttonLabelStyle: {fontFamily: 'ProximaSoftRegular'},
        buttonStyle: {
          backgroundColor: Colours.accentOrange,
          elevation: 1,
        },
        confirmButtonStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        showCancel: false,
        onConfirm: async () => {
          const userData = await postLogin(inputs);
          await AsyncStorage.setItem('userToken', userData.token);
          setUser(userData.user);
          setIsLoggedIn(true);
        },
      });
    } catch (error) {
      console.error('registration error', error);
      announceToast('Registeration Failed');
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
        secureTextEntry={isShown}
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
        secureTextEntry={isShown}
        errorMessage={registerErrors.confirmPassword}
        leftIcon={
          <LockIcon strokeWidth={1.5} size={24} color={Colours.textDark} />
        }
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
        title="Register"
        onPress={doRegister}
        disable={
          registerErrors.username != null ||
          registerErrors.email != null ||
          registerErrors.password != null ||
          registerErrors.confirmPassword != null
        }
        extraStyle={{marginTop: 30}}
      />
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
