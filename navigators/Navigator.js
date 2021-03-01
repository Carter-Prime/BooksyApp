import React, {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PropTypes from 'prop-types';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  User as UserIcon,
  Upload as UploadIcon,
  ArrowLeft,
} from 'react-native-feather';
import {
  Details,
  EditPost,
  EditProfile,
  Home,
  Login,
  Profile,
  Search,
  SearchResult,
  Upload,
  UploadAvatar,
} from '../views/index';
import Colours from './../utils/Colours';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const backImage = () => (
  <ArrowLeft
    strokeWidth={1.5}
    width={32}
    height={32}
    color={Colours.textLight}
  />
);

const HeaderOptions = ({route, navigation}) => {
  return {
    headerTitle: getFocusedRouteNameFromRoute(route),
    headerStyle: {
      backgroundColor: Colours.primaryBlue,
      height: 70,
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontSize: 24,
      fontFamily: 'ProximaSoftRegular',
      alignSelf: 'center',
    },
    headerTitleContainerStyle: {
      left: 0,
    },
    headerRightContainerStyle: {
      right: 10,
    },
    headerBackImage: backImage,
  };
};

const TabScreen = () => {
  const screenOptions = ({route}) => ({
    tabBarIcon: function tabIcons({focused, color}) {
      switch (route.name) {
        case 'Home':
          return focused ? (
            <HomeIcon
              width={28}
              height={28}
              stroke={color}
              fill="none"
              strokeWidth={1}
            />
          ) : (
            <HomeIcon
              width={28}
              height={28}
              stroke={color}
              fill="none"
              strokeWidth={1}
            />
          );

        case 'Profile':
          return focused ? (
            <UserIcon
              width={28}
              height={28}
              stroke={color}
              fill="none"
              strokeWidth={1}
            />
          ) : (
            <UserIcon
              width={28}
              height={28}
              stroke={color}
              fill="none"
              strokeWidth={1}
            />
          );
        case 'Search':
          return focused ? (
            <SearchIcon
              width={28}
              height={28}
              stroke={color}
              fill="none"
              strokeWidth={1}
            />
          ) : (
            <SearchIcon
              width={28}
              height={28}
              stroke={color}
              fill="none"
              strokeWidth={1}
            />
          );
        case 'Upload':
          return focused ? (
            <UploadIcon
              width={28}
              height={28}
              stroke={color}
              fill="none"
              strokeWidth={1}
            />
          ) : (
            <UploadIcon
              width={28}
              height={28}
              stroke={color}
              fill="none"
              strokeWidth={1}
            />
          );
      }
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
          fontFamily: 'ProximaSoftRegular',
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
      <Tab.Screen name="Upload" component={Upload} />
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
          <Stack.Screen
            name="UploadAvatar"
            component={UploadAvatar}
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
