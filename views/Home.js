import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {useFonts} from 'expo-font';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';

const Home = ({navigation}) => {
  const [loaded] = useFonts({
    McLarenRegular: require('../assets/fonts/McLaren-Regular.ttf'),
    ProximaSoftMedium: require('../assets/fonts/ProximaSoft-Medium.ttf'),
    ProximaSoftRegular: require('../assets/fonts/ProximaSoft-Regular.ttf'),
  });

  if (!loaded) {
    console.log(loaded);
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      <Text style={styles.text}>
        Open up App.js to start working on your app! Booksy
      </Text>
      <Button
        title="Details"
        onPress={() => {
          navigation.navigate('Details', {
            customText: 'Details from Home tag',
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'ProximaSoftRegular',
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
