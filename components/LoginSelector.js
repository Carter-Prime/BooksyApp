import React, {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const LoginSelector = () => {
  const offset = useSharedValue(0);
  const windowWidth = Dimensions.get('window').width;
  const {setSignInScreen} = useContext(MainContext);

  const customSpringStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(offset.value, {
            damping: 20,
            stiffness: 90,
          }),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <TouchableOpacity
          onPress={() => {
            setSignInScreen(true);

            offset.value = withSpring(0);
            console.log('SignIn pressed. Offset is: ', offset.value);
          }}
        >
          <Text style={styles.text}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSignInScreen(false);
            offset.value = withSpring(windowWidth / 2 - 30);
            console.log('Register pressed. Offset is: ', offset.value);
          }}
        >
          <Text style={styles.text}>Register</Text>
        </TouchableOpacity>
        <Animated.View style={[styles.barHighlight, customSpringStyles]} />
        <View style={styles.bar}></View>
      </View>
    </View>
  );
};

export default LoginSelector;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  sliderContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  text: {
    fontFamily: 'ProximaSoftMedium',
    fontSize: 20,
    color: 'white',
    marginBottom: 5,
  },
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: '90%',
    height: 2,
  },
  barHighlight: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    backgroundColor: 'white',
    width: '45%',
    height: 2,
  },
});
