import React, {useContext} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import useCommentForm from '../hooks/AddCommentHooks';
import PropTypes from 'prop-types';
import InputTextBox from './InputTextBox';
import Colours from './../utils/Colours';
import RoundButton from './RoundButton';
import {Feather} from 'react-native-vector-icons';
import {Send} from 'react-native-feather';
import {MainContext} from '../contexts/MainContext';
import {useComment} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ModalAddComment = ({isVisible, modalVisible, fileId}) => {
  const {handleInputChange, inputs, uploadErrors, reset} = useCommentForm();
  const {postComment} = useComment();
  const {update, setUpdate} = useContext(MainContext);

  const addComment = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const commentObject = {
      file_id: fileId,
      comment: inputs.comment,
    };
    try {
      const response = postComment(commentObject, userToken);
      if (response) {
        setUpdate(update + 1);
      }
    } catch (error) {
      console.log('add comment error: ', error.message);
    }
  };

  const doReset = () => {
    reset();
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => {
        isVisible();
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <InputTextBox
            extraInputContainerStyle={styles.input}
            placeholder="comment"
            value={inputs.comment}
            onChangeText={(txt) => handleInputChange('comment', txt)}
            errorMessage={uploadErrors.comment}
            multiline={true}
          />
          <RoundButton
            extraStyle={styles.addCommentBtn}
            btnStyle={styles.addBtn}
            iconContainerStyle={{transform: {rotate: '90deg'}}}
            icon={
              <Send
                strokeWidth={1.5}
                color={Colours.primaryBlue}
                style={styles.rotate}
              />
            }
            onPress={async () => {
              await addComment();
              doReset();
              isVisible();
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalAddComment;

ModalAddComment.propTypes = {
  modalVisible: PropTypes.bool,
  fileId: PropTypes.number,
  isVisible: PropTypes.func,
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colours.transparentDark,
  },
  inputContainer: {
    backgroundColor: Colours.secondaryNeutral,
    paddingTop: 10,
  },
  input: {
    marginRight: 50,
  },
  addCommentBtn: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  rotate: {
    marginTop: 0,
    marginRight: 5,
    transform: [{rotate: '45deg'}],
  },
});
