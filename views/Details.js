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
import {Image, Divider, Avatar} from 'react-native-elements';
import {LinearGradient} from 'expo-linear-gradient';
import PropTypes from 'prop-types';
import Colours from './../utils/Colours';
import {uploadsUrl} from '../utils/Variable';
import SectionHeader from '../components/SectionHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser, useTag, useComment, useMedia} from '../hooks/ApiHooks';
import moment from 'moment';
import {Video} from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import {Edit, Plus, Trash2} from 'react-native-feather';
import CommentListItem from './../components/CommentListItem';
import RoundButton from '../components/RoundButton';
import {Dimensions, Alert} from 'react-native';
import ModalAddComment from './../components/ModalAddComment';
import Actionbar from '../components/Actionbar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useConfirm} from 'react-native-confirm-dialog';

const windowWidth = Dimensions.get('window').width;

const Details = ({route, navigation}) => {
  const {file} = route.params;
  const moreData = JSON.parse(file.description);
  const {loaded, update, setUpdate, user} = useContext(MainContext);
  const [videoRef, setVideoRef] = useState(null);
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const [owner, setOwner] = useState({username: 'somebody'});
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();
  const {getCommentsByFileId} = useComment();
  const [isUserPost, setIsUserPost] = useState(false);
  const confirmDelete = useConfirm();
  const {deleteFile} = useMedia();
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    fetchAvatar();
    fetchOwner();
    fetchComments();
    checkUser();
    unlock();

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

  const checkUser = () => {
    if (file.user_id === user.user_id) {
      setIsUserPost(true);
    }
  };

  const deletePost = async () => {
    confirmDelete({
      title: 'Do you want to delete this post?',
      titleStyle: {fontFamily: 'ProximaSoftRegular'},
      buttonLabelStyle: {fontFamily: 'ProximaSoftRegular'},
      buttonStyle: {
        flex: 0.5,
        width: 30,
        height: 30,
        backgroundColor: Colours.accentOrange,
        elevation: 1,
      },
      onConfirm: async () => {
        try {
          const userToken = await AsyncStorage.getItem('userToken');
          await deleteFile(file.file_id, userToken);
          setIsDeleted(true);
          Alert.alert(
            'Upload',
            'File uploaded',
            [
              {
                text: 'Ok',
                onPress: () => {
                  setUpdate(update + 1);
                  navigation.navigate('Home');
                },
              },
            ],
            {cancelable: false}
          );
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  if (!loaded) {
    return <AppLoading onError={console.warn} />;
  }

  return (
    <View style={styles.containerSafeView}>
      <FlatList
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={{width: Dimensions.get('window').width}}>
            <View style={styles.titleContainer}>
              <LinearGradient
                // Background Linear Gradient
                colors={['rgba(0,0,0,0.7)', 'transparent']}
                start={[0, 0]}
                end={[0, 0.6]}
                style={styles.background}
              />
              <Text style={styles.titleText}>{file.title}</Text>
            </View>

            {file.media_type === 'image' ? (
              <Image
                source={{uri: uploadsUrl + file.thumbnails.w640}}
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
            <Actionbar postData={file} isDeleted={isDeleted} />
            <Divider style={styles.divider} />
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
              {isUserPost && (
                <>
                  <View style={styles.postOptionContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('EditPost', {file: file});
                      }}
                    >
                      <Edit
                        width={30}
                        height={30}
                        strokeWidth={1.5}
                        color={Colours.primaryBlue}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        deletePost();
                      }}
                    >
                      <Trash2
                        width={30}
                        height={30}
                        strokeWidth={1.5}
                        color={Colours.primaryBlue}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>

            <Divider style={styles.divider} />
            <Text style={styles.descriptionText}>{moreData.description}</Text>

            <SectionHeader
              content="Comments"
              dividerStyle={styles.dividerHeader}
              containerStyle={styles.commentTitle}
              textStyle={styles.commentTitleText}
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
    </View>
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
    paddingTop: -10,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: windowWidth,
    height: 100,
  },
  text: {
    fontFamily: 'ProximaSoftRegular',
    fontSize: 30,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    elevation: 2,
  },
  titleText: {
    width: windowWidth,
    fontFamily: 'ProximaSoftMedium',
    fontSize: 30,
    color: Colours.textLight,
    textAlign: 'center',
  },
  commentTitle: {
    width: windowWidth * 0.9,
    marginLeft: 15,
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
    borderRadius: 1,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colours.accentOrange,
    marginTop: 20,
  },
  dividerHeader: {
    marginBottom: 20,
    marginLeft: 0,
    overflow: 'hidden',
    width: windowWidth * 0.91,
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
    marginHorizontal: 15,
  },
  descriptionText: {
    width: windowWidth,
    paddingTop: 10,
    paddingHorizontal: 15,

    marginTop: 5,
    paddingBottom: 10,
    fontFamily: 'ProximaSoftRegular',
    fontSize: 16,
    backgroundColor: 'white',
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
  commentTitleText: {
    marginLeft: 0,
    marginTop: 10,
  },
  postOptionContainer: {
    width: 80,
    position: 'absolute',
    right: 30,
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

Details.propTypes = {
  customText: PropTypes.string,
  route: PropTypes.object,
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default Details;
