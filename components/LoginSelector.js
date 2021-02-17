import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {animated, useSpring} from 'react-spring';

import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const LoginSelector = () => {
  const offset = useSharedValue(0);
  const windowWidth = Dimensions.get('window').width;
  const [screen, setScreen] = useState(true);

  const AnimatedView = animated(View);
  const loginProp = useSpring({
    opacity: screen ? 1 : 0,
    marginLeft: screen ? 0 : -500,
    position: 'absolute',
  });
  const registerProp = useSpring({
    opacity: screen ? 0 : 1,
    marginLeft: screen ? 500 : 0,
    position: 'absolute',
  });

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
      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={() => {
            setScreen(true);
            offset.value = withSpring(0);
          }}
          style={styles.btns}
        >
          <Text style={styles.text}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setScreen(false);
            offset.value = withSpring(windowWidth / 2 - 30);
          }}
          style={styles.btns}
        >
          <Text style={styles.text}>Register</Text>
        </TouchableOpacity>
        <Animated.View style={[styles.box1, customSpringStyles]} />
        <View style={styles.box}></View>
      </View>

      <AnimatedView native style={[styles.form, loginProp]}>
        <LoginForm />
      </AnimatedView>
      <AnimatedView native style={[styles.form, registerProp]}>
        <RegisterForm />
      </AnimatedView>
    </View>
  );
};

export default LoginSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  btnContainer: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20,
    width: '100%',
    padding: 10,
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
  box: {
    position: 'absolute',
    left: 30,
    bottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: '89%',
    height: 2,
  },
  box1: {
    position: 'absolute',
    left: 30,
    bottom: 10,
    backgroundColor: 'white',
    width: '45%',
    height: 2,
  },
  form: {
    position: 'absolute',
    top: 60,
    width: '100%',
  },
  btns: {
    flex: 1,
    alignItems: 'center',
  },
});
