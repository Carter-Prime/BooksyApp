import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';

const Login = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="yellow" barStyle="light-content" />
      <Text>Login Page</Text>
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
});

export default Login;
