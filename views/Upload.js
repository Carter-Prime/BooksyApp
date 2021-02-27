import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Image} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Feather} from 'react-native-vector-icons';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier} from '../utils/Variable';
import {Video} from 'expo-av';
import CustomButton from './../components/CustomButton';
import InputTextBox from './../components/InputTextBox';
import Colours from './../utils/Colours';
import SectionHeader from '../components/SectionHeader';
import RoundButton from './../components/RoundButton';
import TagCheckboxSelector from '../components/TagCheckboxSelector';

const Upload = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [filetype, setFiletype] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const {uploadFile} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate, tagState, setTagState} = useContext(MainContext);
  const placeholderImage = require('../assets/images/imagePlaceholder2.jpg');

  const {handleInputChange, inputs, uploadErrors, reset} = useUploadForm();

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

  const doUpload = async () => {
    const formData = new FormData();
    // add text to formData
    formData.append('title', inputs.title);
    formData.append('description', inputs.description);
    // add image to formData
    const filename = image.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `${filetype}/${match[1]}` : filetype;
    if (type === 'image/jpg') type = 'image/jpeg';
    formData.append('file', {
      uri: image,
      name: filename,
      type: type,
    });
    try {
      setIsUploading(true);

      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await uploadFile(formData, userToken);
      console.log(resp);
      await postTag(
        {
          file_id: resp.file_id,
          tag: appIdentifier,
        },
        userToken
      );
      const tagList = createAddTags();

      for (let i = 0; i < tagList.length; i++) {
        await postTag(
          {
            file_id: resp.file_id,
            tag: tagList[i],
          },
          userToken
        );
      }

      Alert.alert(
        'Upload',
        'File uploaded',
        [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              doReset();
              navigation.navigate('Home');
            },
          },
        ],
        {cancelable: false}
      );
    } catch (error) {
      Alert.alert('Upload', 'Failed');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert(
            'Sorry, we need camera roll and camera permissions to make this work!'
          );
        }
      }
    })();
  }, []);

  const pickImage = async (library) => {
    let result = null;
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    };
    if (library) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      result = await ImagePicker.launchCameraAsync(options);
    }

    if (!result.cancelled) {
      setFiletype(result.type);
      setImage(result.uri);
    }
  };

  const doReset = () => {
    setImage(null);
    reset();
    resetCheckBox();
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <SectionHeader content="Post Details" />
      {!image && (
        <Image source={placeholderImage} style={styles.placeholderImage} />
      )}
      {image && (
        <>
          {filetype === 'image' ? (
            <Image source={{uri: image}} style={styles.placeholderImage} />
          ) : (
            <Video
              source={{uri: image}}
              style={styles.placeholderImage}
              useNativeControls={true}
            />
          )}
        </>
      )}
      <View style={styles.btnContainer}>
        <RoundButton
          icon={<Feather name="folder" size={24} color={Colours.textDark} />}
          onPress={() => pickImage(true)}
          extraStyle={{marginRight: 10}}
        />
        <RoundButton
          icon={<Feather name="camera" size={24} color={Colours.textDark} />}
          onPress={() => pickImage(false)}
        />
      </View>

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
      {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
      <View style={styles.submitBtnContainer}>
        <CustomButton title="Reset" onPress={doReset} extraStyle={styles.btn} />
        <CustomButton
          title="Upload file"
          onPress={doUpload}
          disabled={
            uploadErrors.title !== null ||
            uploadErrors.description !== null ||
            uploadErrors.tags !== null ||
            image === null
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: -50,
  },
  submitBtnContainer: {
    width: '100%',
    flex: 1,
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
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
