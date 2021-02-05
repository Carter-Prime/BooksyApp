import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PropTypes from 'prop-types';

import Home from '../views/Home.js';
import Search from '../views/Search.js';
import Profile from '../views/Profile.js';
import Login from '../views/Login.js';
import Icon from 'react-native-vector-icons/Feather';
import Details from './../views/Details';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HeaderOptions = ({route}) => {
  return {
    headerTitle: getFocusedRouteNameFromRoute(route),
    headerStyle: {
      backgroundColor: '#55AAAA',
      height: 50,
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
};

const TabScreen = () => {
  const screenOptions = ({route}) => ({
    tabBarIcon: function tabIcons({focused, color}) {
      let iconName;

      if (route.name === 'Home') {
        iconName = focused ? 'home' : 'home';
      } else if (route.name === 'Profile') {
        iconName = focused ? 'user' : 'user';
      } else if (route.name === 'Search') {
        iconName = focused ? 'search' : 'search';
      }

      return <Icon name={iconName} size={30} color={color} />;
    },
  });

  return (
    <Tab.Navigator
      screenOptions={screenOptions}
      tabBarOptions={{
        activeTintColor: '#55AAAA',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};
const StackScreen = () => {
  const [isLoggedIn] = useState(true);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Home"
            component={TabScreen}
            options={HeaderOptions}
          />

          <Stack.Screen
            name="Details"
            component={Details}
            options={HeaderOptions}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

TabScreen.propTypes = {
  focused: PropTypes.string,
  color: PropTypes.string,
};

export default Navigator;
