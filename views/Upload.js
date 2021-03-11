import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Image} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Folder as FolderIcon, Camera as CameraIcon} from 'react-native-feather';
import {Video} from 'expo-av';
import {useConfirm} from 'react-native-confirm-dialog';
import LottieView from 'lottie-react-native';

import useUploadForm from '../hooks/UploadHooks';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier} from '../utils/Variable';
import CustomButton from './../components/CustomButton';
import InputTextBox from './../components/InputTextBox';
import Colours from './../utils/Colours';
import SectionHeader from '../components/SectionHeader';
import RoundButton from './../components/RoundButton';
import TagCheckboxSelector from '../components/TagCheckboxSelector';

const windowWidth = Dimensions.get('window').width;

const Upload = ({navigation}) => {
  const confirmUpload = useConfirm();
  const [image, setImage] = useState(null);
  const [filetype, setFiletype] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const {uploadFile} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate, tagState, setTagState} = useContext(MainContext);
  const placeholderImage = require('../assets/images/imagePlaceholder2.jpg');
  const loadingSpinAnimation = require('../assets/lottie/Loading.json');
  const loadAnimation = useRef();

  const {handleInputChange, inputs, uploadErrors, reset} = useUploadForm();

  const createAddTags = () => {
    const tagArray = tagState
      .filter((element) => element.value === true)
      .map((element) => element.tag);
    if (inputs.tags !== '') {
      tagArray.push(inputs.tags);
    }
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
    const moreData = {
      description: inputs.description,
      swapped: false,
    };
    formData.append('description', JSON.stringify(moreData));
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

      confirmUpload({
        title: 'Post was uploaded successfully!',
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
      announceToast('Post Upload Failed!');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const announceToast = (message) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM
    );
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
  }, [uploadErrors]);

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
          icon={<FolderIcon strokeWidth={1.5} color={Colours.primaryBlue} />}
          onPress={() => pickImage(true)}
          extraStyle={{marginRight: 10}}
        />
        <RoundButton
          icon={<CameraIcon strokeWidth={1.5} color={Colours.primaryBlue} />}
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
      <SectionHeader
        content="Search Tags (Optional)"
        containerStyle={{marginBottom: 20}}
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
  animation: {
    width: windowWidth * 0.1,
    marginLeft: 0,
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
