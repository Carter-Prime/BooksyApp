import React, {useContext, useState} from 'react';
import {ScrollView, Alert, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthentication} from '../hooks/ApiHooks';
import useLoginForm from '../hooks/LoginHooks';
import InputTextBox from '../components/InputTextBox';
import CustomButton from '../components/CustomButton';
import {Feather} from 'react-native-vector-icons';
import Colours from './../utils/Colours';

const LoginForm = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {inputs, handleInputChange} = useLoginForm();
  const {postLogin} = useAuthentication();
  const {setUser, setIsLoggedIn} = useContext(MainContext);

  const doLogin = async () => {
    setLoading(true);
    try {
      console.log(inputs);
      const userData = await postLogin(inputs);
      setUser(userData.user);
      setIsLoggedIn(true);
      await AsyncStorage.setItem('userToken', userData.token);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('postLogin error', error.message);
      Alert.alert('Invalid username or password');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.view}>
      <InputTextBox
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
        leftIcon={<Feather name="mail" size={24} color={Colours.textDark} />}
      />
      <InputTextBox
        placeholder="password"
        onChangeText={(txt) => {
          handleInputChange('password', txt);
        }}
        secureTextEntry={true}
        leftIcon={<Feather name="lock" size={24} color={Colours.textDark} />}
      />
      <CustomButton title="Login" onPress={doLogin} loading={loading} />
    </ScrollView>
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
    paddingBottom: 60,
    // backgroundColor: Colours.transparentDark,
    padding: 10,
  },
  text: {
    fontSize: 20,
  },
});
