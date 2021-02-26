import React, {useContext, useState, useEffect} from 'react';
import {MainContext} from '../contexts/MainContext';
import AppLoading from 'expo-app-loading';
import {StyleSheet, View, ActivityIndicator, Text} from 'react-native';
import {Card, Avatar, ListItem} from 'react-native-elements';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';
import Colours from './../utils/Colours';
import {uploadsUrl} from '../utils/Variable';
import SectionHeader from '../components/SectionHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser, useTag} from '../hooks/ApiHooks';
import moment from 'moment';
import {Video} from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';

const Details = ({route}) => {
  const {file} = route.params;
  const {loaded} = useContext(MainContext);
  const [videoRef, setVideoRef] = useState(null);
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const [owner, setOwner] = useState({username: 'somebody'});
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();

  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + file.user_id);
      if (avatarList.length > 0) {
        setAvatar(uploadsUrl + avatarList.pop().filename);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchOwner = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await getUserById(file.user_id, userToken);
      setOwner(userData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error('unlock', error.message);
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.error('lock', error.message);
    }
  };

  const handleVideoRef = (component) => {
    setVideoRef(component);
  };

  const showVideoInFullscreen = async () => {
    try {
      if (videoRef) {
        await videoRef.presentFullscreenPlayer();
      } else {
        dismissVideoFullscreen();
      }
    } catch (error) {
      console.error('fullscreen', error.message);
    }
  };

  const dismissVideoFullscreen = async () => {
    try {
      if (videoRef) await videoRef.dismissFullscreenPlayer();
    } catch (error) {
      console.error('fullscreen error', error);
    }
  };

  useEffect(() => {
    unlock();
    fetchAvatar();
    fetchOwner();

    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      console.log('orientation', evt);
      if (evt.orientationInfo.orientation > 2) {
        // show video in fullscreen
        showVideoInFullscreen();
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, [videoRef]);

  if (!loaded) {
    console.log('loaded: ', loaded);
    return <AppLoading onError={console.warn} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" style="light" />
      <Card containerStyle={styles.cardContainer}>
        <SectionHeader content={file.title} dividerStyle={styles.divider} />
        {file.media_type === 'image' ? (
          <Card.Image
            source={{uri: uploadsUrl + file.filename}}
            style={styles.image}
            PlaceholderContent={<ActivityIndicator />}
          />
        ) : (
          <Video
            ref={handleVideoRef}
            source={{uri: uploadsUrl + file.filename}}
            style={styles.image}
            useNativeControls={true}
            resizeMode="cover"
            onError={(err) => {
              console.error('video', err);
            }}
            posterSource={{uri: uploadsUrl + file.screenshot}}
          />
        )}
        <Card.Title>{moment(file.time_added).format('LLL')}</Card.Title>
        <Text style={styles.description}>{file.description}</Text>
        <ListItem>
          <Avatar source={{uri: avatar}} />
          <Text>{owner.username}</Text>
        </ListItem>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.secondaryNeutral,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardContainer: {
    width: '90%',
  },
  text: {
    fontFamily: 'ProximaSoftRegular',
    fontSize: 30,
  },
  image: {
    width: '100%',
    height: 400,
  },
  divider: {
    marginHorizontal: 0,
    marginBottom: 20,
  },
});

Details.propTypes = {
  customText: PropTypes.string,
  route: PropTypes.object,
  singleMedia: PropTypes.object,
};

export default Details;
