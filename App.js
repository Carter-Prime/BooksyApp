import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useFonts} from 'expo-font';

const App = () => {
  const [loaded] = useFonts({
    McLarenRegular: require('./assets/fonts/McLaren-Regular.ttf'),
    ProximaSoftMedium: require('./assets/fonts/ProximaSoft-Medium.ttf'),
    ProximaSoftRegular: require('./assets/fonts/ProximaSoft-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Open up App.js to start working on your app! Booksy
      </Text>
      <StatusBar style="auto" />
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

export default App;
