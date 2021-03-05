import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Card, ListItem as RNEListItem, Avatar} from 'react-native-elements';
import PropTypes from 'prop-types';
import Colours from './../utils/Colours';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser, useTag, useComment} from '../hooks/ApiHooks';
import moment from 'moment';
import {uploadsUrl} from '../utils/Variable';
import {Dimensions} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {Trash2} from 'react-native-feather';
import {useConfirm} from 'react-native-confirm-dialog';

const CommentListItem = ({commentMedia}) => {
  const {getUserById} = useUser();
  const [owner, setOwner] = useState([]);
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const {getFilesByTag} = useTag();
  const {deleteComment} = useComment();
  const {user} = useContext(MainContext);
  const [showCommands, setShowCommands] = useState(false);
  const {update, setUpdate} = useContext(MainContext);
  const confirmDelete = useConfirm();

  const deleteUserComment = async () => {
    confirmDelete({
      title: 'Do you want to delete this comment?',
      titleStyle: {fontFamily: 'ProximaSoftRegular'},
      body: commentMedia.comment,
      bodyStyle: {fontFamily: 'ProximaSoftRegular'},
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
          await deleteComment(commentMedia.comment_id, userToken);
          setUpdate(update + 1);
        } catch (error) {
          console.error(error.message);
        }
      },
    });
  };
  const ownComment = () => {
    if (commentMedia.user_id === user.user_id) {
      setShowCommands(true);
    }
  };

  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + commentMedia.user_id);
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
      const userData = await getUserById(commentMedia.user_id, userToken);
      setOwner(userData.username);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    ownComment();
    fetchOwner();
    fetchAvatar();
  }, [update]);

  return (
    <RNEListItem
      containerStyle={styles.itemContainer}
      underlayColor={Colours.transparentLight}
    >
      <Card containerStyle={styles.cardContainer}>
        <View style={styles.postDetails}>
          <Avatar
            rounded
            size="medium"
            source={{uri: avatar}}
            containerStyle={styles.avatar}
          />
          <Text style={styles.username}>{owner}</Text>
          <Text style={styles.time}>
            {moment(commentMedia.time_added).format('LLL')}
          </Text>
          {showCommands && (
            <TouchableOpacity
              style={styles.icon}
              onPress={() => deleteUserComment()}
            >
              <Trash2 strokeWidth={1.5} color={Colours.primaryBlue} />
            </TouchableOpacity>
          )}
        </View>
        <Card.Divider style={styles.divider} />

        <Text style={styles.comment}>{commentMedia.comment}</Text>
      </Card>
    </RNEListItem>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    padding: 5,
    borderRadius: 3,
  },
  cardContainer: {
    width: Dimensions.get('window').width * 0.91,
    elevation: 2,
    borderRadius: 5,
    backgroundColor: 'white',
    marginLeft: 10,
    marginTop: 0,
  },
  user: {
    fontSize: 20,
  },
  icon: {
    position: 'absolute',
    right: 5,
    bottom: 7,
  },
  comment: {
    fontSize: 14,
    fontFamily: 'ProximaSoftRegular',
    marginTop: -10,
  },
  avatar: {
    position: 'absolute',
    left: 0,
    bottom: -5,
  },
  time: {
    position: 'absolute',
    left: 60,
    bottom: 0,
    fontFamily: 'ProximaSoftRegular',
    color: Colours.primaryBlue,
  },
  username: {
    position: 'absolute',
    left: 60,
    bottom: 20,
    fontFamily: 'ProximaSoftMedium',
    fontSize: 16,
    color: Colours.primaryBlue,
  },
  postDetails: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colours.accentOrange,
  },
});

CommentListItem.propTypes = {
  commentMedia: PropTypes.object,
};

export default CommentListItem;
