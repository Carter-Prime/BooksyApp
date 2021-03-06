import React, {useContext, useEffect, useState, useRef} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useConfirm} from 'react-native-confirm-dialog';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import useUploadForm from '../hooks/UploadHooks';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import CustomButton from './../components/CustomButton';
import InputTextBox from './../components/InputTextBox';
import Colours from './../utils/Colours';
import SectionHeader from '../components/SectionHeader';
import TagCheckboxSelector from '../components/TagCheckboxSelector';

const windowWidth = Dimensions.get('window').width;

const EditPost = ({navigation, route}) => {
  const {file} = route.params;
  const moreData = JSON.parse(file.description);
  const [isUploading, setIsUploading] = useState(false);
  const {updateFile} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate, tagState, setTagState} = useContext(MainContext);
  const confirmUpdatePost = useConfirm();
  const loadingSpinAnimation = require('../assets/lottie/Loading.json');
  const loadAnimation = useRef();

  const {handleInputChange, inputs, uploadErrors, reset} = useUploadForm();

  useEffect(() => {
    handleInputChange('title', file.title);
    handleInputChange('description', moreData.description);
  }, []);

  // Creates an array of tags to be added to post.
  const createAddTags = () => {
    const tagArray = tagState
      .filter((element) => element.value === true)
      .map((element) => element.tag);
    tagArray.push(inputs.tags);
    return tagArray;
  };

  const resetCheckBox = () => {
    const tagArray = tagState
      .filter((element) => element.value === true || element.value === false)
      .map((element) => element);
    for (let i = 0; i < tagArray.length; i++) {
      if (tagArray[i].value == true) {
        tagArray[i].value = false;
      }
    }
    setTagState(tagArray);
  };

  const doUpdate = async () => {
    const newData = {
      description: inputs.description,
      swapped: moreData.swapped,
    };
    const data = {
      title: inputs.title,
      description: JSON.stringify(newData),
    };

    try {
      setIsUploading(true);

      const userToken = await AsyncStorage.getItem('userToken');
      await updateFile(file.file_id, data, userToken);

      const tagList = createAddTags();
      if (tagList.length > 0) {
        for (let i = 0; i < tagList.length; i++) {
          await postTag(
            {
              file_id: file.file_id,
              tag: tagList[i],
            },
            userToken
          );
        }
      }

      confirmUpdatePost({
        title: 'Post was updated!',
        titleStyle: {fontFamily: 'ProximaSoftRegular'},
        buttonLabelStyle: {
          fontFamily: 'ProximaSoftRegular',
          color: Colours.primaryBlue,
        },
        buttonStyle: {
          backgroundColor: Colours.accentOrange,
          elevation: 1,
          color: Colours.primaryBlue,
        },
        confirmButtonStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        showCancel: false,
        onConfirm: () => {
          setUpdate(update + 1);
          doReset();
          navigation.navigate('Home');
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const doReset = () => {
    reset();
    resetCheckBox();
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <SectionHeader
        content="Update Post Details"
        containerStyle={{marginBottom: 20}}
      />

      <InputTextBox
        placeholder="title"
        value={inputs.title}
        onChangeText={(txt) => handleInputChange('title', txt)}
        errorMessage={uploadErrors.title}
      />
      <InputTextBox
        placeholder="description"
        value={inputs.description}
        onChangeText={(txt) => handleInputChange('description', txt)}
        errorMessage={uploadErrors.description}
      />

      <InputTextBox
        placeholder="tag"
        value={inputs.tags}
        onChangeText={(txt) => handleInputChange('tags', txt)}
        errorMessage={uploadErrors.tags}
      />
      <TagCheckboxSelector />
      {isUploading && (
        <LottieView
          ref={loadAnimation}
          source={loadingSpinAnimation}
          loop={true}
          autoPlay={true}
          progress={0}
          style={styles.animation}
        />
      )}
      <View style={styles.submitBtnContainer}>
        <CustomButton title="Reset" onPress={doReset} extraStyle={styles.btn} />
        <CustomButton
          title="Upload file"
          onPress={doUpdate}
          disabled={
            uploadErrors.title !== null || uploadErrors.description !== null
          }
          extraStyle={styles.btn}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingBottom: 60,
  },
  placeholderImage: {
    width: '90%',
    height: undefined,
    aspectRatio: 1,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: Colours.primaryBlue,
  },
  btn: {
    flex: 0.5,
    marginRight: 20,
    marginTop: 0,
  },
  btnContainer: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: -50,
  },
  submitBtnContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  addTagIcon: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  animation: {
    width: windowWidth * 0.1,
    marginLeft: 0,
  },
});

EditPost.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default EditPost;
