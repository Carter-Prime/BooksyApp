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
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {useTransition, animated} from 'react-spring';

const LoginSelector = () => {
  const offset = useSharedValue(0);
  const windowWidth = Dimensions.get('window').width;
  const [screen, setScreen] = useState(false);

  const AnimatedView = animated(View);
  const transitions = useTransition(screen, null, {
    from: {position: 'absolute', translateX: -500},
    enter: {position: 'absolute', translateX: 0},
    leave: {position: 'absolute', translateX: -500},
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
            setScreen(false);
            offset.value = withSpring(0);
          }}
          style={styles.btns}
        >
          <Text style={styles.text}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setScreen(true);
            offset.value = withSpring(windowWidth / 2 - 20);
          }}
          style={styles.btns}
        >
          <Text style={styles.text}>Register</Text>
        </TouchableOpacity>
        <Animated.View style={[styles.box1, customSpringStyles]} />
        <View style={styles.box}></View>
      </View>
      <View style={styles.formContainer}>
        {transitions.map(({item, key, props}) =>
          item ? (
            <AnimatedView native key={key} style={[styles.form, props]}>
              <RegisterForm />
            </AnimatedView>
          ) : (
            <AnimatedView native key={key} style={[styles.form, props]}>
              <LoginForm />
            </AnimatedView>
          )
        )}
      </View>
    </View>
  );
};

export default LoginSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 200,
    justifyContent: 'flex-start',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20,
    width: '100%',
    // backgroundColor: Colours.transparentDark,
    padding: 10,
  },
  formContainer: {
    flex: 0.5,
    flexDirection: 'row',

    width: '100%',
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
  box: {
    position: 'absolute',
    left: 20,
    bottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: '90%',
    height: 2,
  },
  box1: {
    position: 'absolute',
    left: 20,
    bottom: 10,
    backgroundColor: 'white',
    width: '45%',
    height: 2,
  },
  form: {
    width: '100%',
  },
  btns: {
    flex: 1,
    alignItems: 'center',
  },
});
