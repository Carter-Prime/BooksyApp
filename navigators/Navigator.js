import React, {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PropTypes from 'prop-types';
import {Feather} from '@expo/vector-icons';

import {
  ChangePassword,
  Details,
  EditPost,
  EditProfile,
  Home,
  Login,
  Profile,
  Search,
  SearchResult,
} from '../views/index';
import Colours from './../utils/Colours';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HeaderOptions = ({route}) => {
  return {
    headerTitle: getFocusedRouteNameFromRoute(route),
    headerStyle: {
      backgroundColor: Colours.primaryBlue,
      height: 80,
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontSize: 24,
      fontFamily: 'ProximaSoftMedium',
      alignSelf: 'center',
    },
    headerTitleContainerStyle: {
      left: 0,
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

      return <Feather name={iconName} size={26} color={color} />;
    },
  });

  return (
    <Tab.Navigator
      screenOptions={screenOptions}
      tabBarOptions={{
        activeTintColor: Colours.accentOrange,
        inactiveTintColor: Colours.textLight,
        labelStyle: {
          fontSize: 14,
          fontFamily: 'ProximaSoftMedium',
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

          <Stack.Screen
            name="Profile"
            component={Profile}
            options={HeaderOptions}
          />

          <Stack.Screen
            name="Change Password"
            component={ChangePassword}
            options={HeaderOptions}
          />

          <Stack.Screen
            name="Edit Post"
            component={EditPost}
            options={HeaderOptions}
          />

          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={HeaderOptions}
          />

          <Stack.Screen
            name="SearchResult"
            component={SearchResult}
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
