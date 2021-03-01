import React, {useContext, useState, useEffect} from 'react';
import {MainContext} from '../contexts/MainContext';
import AppLoading from 'expo-app-loading';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import {Card, Avatar} from 'react-native-elements';
import {StatusBar} from 'expo-status-bar';
import PropTypes from 'prop-types';
import Colours from './../utils/Colours';
import {uploadsUrl} from '../utils/Variable';
import SectionHeader from '../components/SectionHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser, useTag, useComment} from '../hooks/ApiHooks';
import moment from 'moment';
import {Video} from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import {Plus} from 'react-native-feather';
import CommentListItem from './../components/CommentListItem';
import RoundButton from '../components/RoundButton';
import {Dimensions} from 'react-native';
import ModalAddComment from './../components/ModalAddComment';
import Actionbar from '../components/Actionbar';

const Details = ({route}) => {
  const {file} = route.params;
  const {loaded, update} = useContext(MainContext);
  const [videoRef, setVideoRef] = useState(null);
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const [owner, setOwner] = useState({username: 'somebody'});
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();
  const {getCommentsByFileId} = useComment();

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

  const fetchComments = async () => {
    try {
      const commentList = await getCommentsByFileId(file.file_id);
      setComments(commentList.reverse());
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

  const toggleVisibility = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    unlock();
    fetchAvatar();
    fetchOwner();
    fetchComments();

    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      if (evt.orientationInfo.orientation > 2) {
        // show video in fullscreen
        showVideoInFullscreen();
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, [videoRef, update]);

  if (!loaded) {
    return <AppLoading onError={console.warn} />;
  }

  return (
    <>
      <FlatList
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={{width: Dimensions.get('window').width}}>
            <StatusBar backgroundColor="black" style="light" />
            <Card containerStyle={styles.cardContainer}>
              <SectionHeader
                content={file.title}
                dividerStyle={styles.dividerHeader}
                containerStyle={styles.title}
                textStyle={styles.titleText}
              />
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
              <Actionbar postData={file} />
              <View style={[styles.userStats]}>
                <Avatar
                  rounded
                  size="medium"
                  containerStyle={styles.avatar}
                  source={{uri: avatar}}
                />
                <Text style={styles.username}>{owner.username}</Text>
                <Text style={styles.time}>
                  {moment(file.time_added).format('LLL')}
                </Text>
              </View>

              <Card.Divider style={styles.divider} />
              <Text style={styles.descriptionText}>{file.description}</Text>
            </Card>
            <SectionHeader
              content="Comments"
              dividerStyle={styles.dividerHeader}
              containerStyle={styles.commentTitle}
              textStyle={styles.titleText}
            />
            <ModalAddComment
              modalVisible={modalVisible}
              isVisible={toggleVisibility}
              fileId={file.file_id}
            />
          </View>
        }
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <CommentListItem commentMedia={item} />}
      />
      <RoundButton
        extraStyle={styles.addCommentBtn}
        btnStyle={styles.addBtn}
        icon={
          <Plus
            width={40}
            height={40}
            strokeWidth={1.5}
            color={Colours.primaryBlue}
          />
        }
        onPress={() => {
          setModalVisible(true);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  cardContainer: {
    width: '92%',
    borderRadius: 5,
    borderColor: Colours.primaryBlue,
    backgroundColor: Colours.secondaryNeutral,
  },
  text: {
    fontFamily: 'ProximaSoftRegular',
    fontSize: 30,
  },
  title: {
    marginTop: -10,
    marginBottom: 0,
  },
  titleText: {
    marginLeft: 0,
  },
  commentTitle: {
    width: Dimensions.get('window').width * 0.9,
    marginLeft: 20,
    marginRight: 20,
  },
  avatar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 5,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colours.accentOrange,
    marginTop: 20,
  },
  dividerHeader: {
    marginBottom: 20,
    marginLeft: 0,
    marginRight: 0,
  },
  time: {
    position: 'absolute',
    left: 60,
    bottom: 5,
    fontFamily: 'ProximaSoftRegular',
    fontSize: 16,
    color: Colours.primaryBlue,
  },
  username: {
    position: 'absolute',
    left: 60,
    bottom: 25,
    fontFamily: 'ProximaSoftMedium',
    fontSize: 20,
    color: Colours.primaryBlue,
  },
  userStats: {
    width: '100%',
    height: 50,
    marginTop: 20,
  },
  descriptionText: {
    width: '100%',
    marginTop: 0,
    fontFamily: 'ProximaSoftRegular',
    fontSize: 16,
  },
  addCommentBtn: {
    position: 'absolute',
    right: 20,
    bottom: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  addBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

Details.propTypes = {
  customText: PropTypes.string,
  route: PropTypes.object,
  singleMedia: PropTypes.object,
};

export default Details;
