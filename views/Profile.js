import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';

const Profile = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <Text>Profile Tab</Text>
      <Button
        title="Details"
        onPress={() => {
          navigation.navigate('Details', {
            customText: 'Details from Profile tag',
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
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
