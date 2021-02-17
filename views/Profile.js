import React, {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import AppLoading from 'expo-app-loading';
import {StyleSheet, Text, View, Button} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';
import Colours from './../utils/Colours';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({navigation}) => {
  const {loaded, setIsLoggedIn} = useContext(MainContext);

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
  };

  if (!loaded) {
    console.log('loaded: ', loaded);
    return <AppLoading onError={console.warn} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" style="light" />
      <Text style={styles.text}>Profile Tab</Text>
      <Button
        title="Details"
        onPress={() => {
          navigation.navigate('Details', {
            customText: 'Details from Profile tag',
          });
        }}
      />
      <Button
        title="Logout"
        onPress={() => {
          logout();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.secondaryNeutral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'ProximaSoftMedium',
    fontSize: 30,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
