import React, {useState, useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
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
import Colours from './../utils/Colours';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HeaderOptions = ({route}) => {
  const {loaded} = useContext(MainContext);

  if (!loaded) {
    return null;
  }
  return {
    headerTitle: getFocusedRouteNameFromRoute(route),
    headerStyle: {
      backgroundColor: Colours.primaryBlue,
      height: 80,
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontSize: 24,
      fontFamily: 'McLarenRegular',
      alignSelf: 'center',
    },
    headerTitleContainerStyle: {
      left: 0, // THIS RIGHT HERE
    },
  };
};

const TabScreen = () => {
  const {loaded} = useContext(MainContext);

  if (!loaded) {
    return null;
  }
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

      return <Icon name={iconName} size={26} color={color} />;
    },
  });

  return (
    <Tab.Navigator
      screenOptions={screenOptions}
      tabBarOptions={{
        activeTintColor: Colours.accentOrange,
        inactiveTintColor: Colours.textLight,
        labelStyle: {
          fontFamily: 'ProximaSoftMedium',
          fontSize: 14,
        },
        tabStyle: {
          backgroundColor: Colours.primaryBlue,
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};
const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
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
