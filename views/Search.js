import React, {useContext, useEffect} from 'react';
import {StyleSheet, View, Button, ToastAndroid} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AppLoading from 'expo-app-loading';
import {useConfirm} from 'react-native-confirm-dialog';
import PropTypes from 'prop-types';
import Colours from './../utils/Colours';

const Search = ({navigation}) => {
  const {loaded, update, setUpdate} = useContext(MainContext);
  const differentConfirm = useConfirm();

  useEffect(() => {}, []);

  if (!loaded) {
    console.log('loaded: ', loaded);
    return <AppLoading onError={console.warn} />;
  }

  const anotherAlert = (anotherMessage) => {
    differentConfirm({
      title: 'Do you want to delete this post?',
      titleStyle: {fontFamily: 'ProximaSoftRegular'},
      buttonLabelStyle: {fontFamily: 'ProximaSoftRegular'},
      buttonStyle: {
        flex: 0.5,
        width: 30,
        height: 30,
        backgroundColor: Colours.accentOrange,
        elevation: 1,
      },
      onConfirm: () => {
        alertUser(anotherMessage);
        setUpdate(update + 1);
        navigation.navigate('Home');
      },
    });
  };

  const alertUser = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      150
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Alert" onPress={() => anotherAlert('THis is a test')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
