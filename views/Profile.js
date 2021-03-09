import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AppLoading from 'expo-app-loading';
import {StyleSheet, ToastAndroid} from 'react-native';
import {Avatar} from 'react-native-elements';
import PropTypes from 'prop-types';
import Colours from './../utils/Colours';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AccountInfoHeader from '../components/AccountInfoHeader';
import AccountInfoCard from '../components/AccountInfoCard';
import CustomButton from '../components/CustomButton';
import AccountStatisticCard from '../components/AccountStatisticCard';
import {uploadsUrl} from '../utils/Variable';
import {useTag, useUser} from '../hooks/ApiHooks';
import SectionHeader from './../components/AccountInfoHeader';
import List from '../components/List';
import {useLoadMedia} from '../hooks/LoadMediaHooks';

const Profile = ({navigation}) => {
  const {loaded, setIsLoggedIn, user, setUser, update} = useContext(
    MainContext
  );
  const {getFilesByTag} = useTag();
  const {checkCurrentUserToken} = useUser();
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const {swappedPostsArray} = useLoadMedia();

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
  };

  if (!loaded) {
    console.log('loaded: ', loaded);
    return <AppLoading onError={console.warn} />;
  }

  const announceToast = (message) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM
    );
  };

  const getCurrentUserData = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      try {
        const userData = await checkCurrentUserToken(userToken);
        setUser(userData);
      } catch (error) {
        announceToast('Get User Data Failed!');
      }
    }
  };

  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + user.user_id);
      if (avatarList.length > 0) {
        setAvatar(uploadsUrl + avatarList.pop().filename);
      }
    } catch (error) {
      announceToast('Fetch Avatar Failed!');
    }
  };

  useEffect(() => {
    fetchAvatar();
    getCurrentUserData();
  }, [update]);

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <Avatar
        size={250}
        source={{
          uri: avatar,
        }}
        imageProps={{
          borderRadius: 5,
          borderWidth: 2,
          borderColor: Colours.primaryBlue,
        }}
      ></Avatar>

      <AccountInfoHeader
        content="Account Information"
        toggleIcon
        navigation={navigation}
      />
      <AccountInfoCard accountInfo={user} />
      <SectionHeader content="Account Statistics" />
      <AccountStatisticCard listLength={swappedPostsArray.length} />
      <SectionHeader content="Books Swapped" />
      <List
        navigation={navigation}
        loadData={swappedPostsArray}
        horizontal
        style={styles.horizontalListContainer}
        contentContainerStyle={{paddingRight: 40}}
      />
      <CustomButton
        extraStyle={styles.logoutBtn}
        title="Logout"
        onPress={() => {
          logout();
        }}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingBottom: 60,
    backgroundColor: 'white',
  },
  text: {
    fontFamily: 'ProximaSoftMedium',
    fontSize: 30,
  },
  editIcon: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderWidth: 0,
    borderRadius: 50,
    padding: 5,
    backgroundColor: Colours.accentOrange,
    color: Colours.primaryBlue,
    elevation: 2,
  },
  logoutBtn: {
    width: '91%',
    marginRight: 20,
  },
  horizontalListContainer: {
    marginTop: 10,
    marginLeft: 0,
    marginRight: 0,
    paddingBottom: 10,
    paddingLeft: 20,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
