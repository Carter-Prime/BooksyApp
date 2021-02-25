import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Image} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Feather} from 'react-native-vector-icons';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier} from '../utils/Variable';
import CustomButton from './../components/CustomButton';
import Colours from './../utils/Colours';
import SectionHeader from '../components/SectionHeader';
import RoundButton from './../components/RoundButton';

const UploadAvatar = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [filetype, setFiletype] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const {uploadFile} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate, user} = useContext(MainContext);
  const placeholderImage = require('../assets/images/imagePlaceholder2.jpg');

  const doUpload = async () => {
    const formData = new FormData();
    // add text to formData
    formData.append('title', 'Avatar_' + user.user_id);
    formData.append('description', 'Avatar Image');
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
      console.log('upload response', resp);
      await postTag(
        {
          file_id: resp.file_id,
          tag: appIdentifier,
        },
        userToken
      );

      await postTag(
        {
          file_id: resp.file_id,
          tag: 'Avatar_' + user.user_id,
        },
        userToken
      );

      Alert.alert(
        'Upload',
        'File uploaded',
        [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              doReset();
              navigation.navigate('EditProfile');
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
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <SectionHeader content="Change Avatar Picture" />
      {!image && (
        <Image source={placeholderImage} style={styles.placeholderImage} />
      )}
      {image && <Image source={{uri: image}} style={styles.placeholderImage} />}
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
      {filetype === 'video' && (
        <Text style={styles.errorText}>Error upload must be an image file</Text>
      )}

      {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
      <View style={styles.submitBtnContainer}>
        <CustomButton title="Reset" onPress={doReset} extraStyle={styles.btn} />
        <CustomButton
          title="Upload file"
          onPress={doUpload}
          disabled={filetype !== 'image'}
          extraStyle={styles.btn}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colours.secondaryNeutral,
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
    borderWidth: 3,
    borderColor: Colours.accentOrange,
  },
  btn: {
    flex: 0.5,
    marginRight: 20,
    marginTop: 0,
    height: 44,
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
    height: 0,
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
  errorText: {
    fontFamily: 'ProximaSoftMedium',
    color: 'red',
    marginBottom: 20,
    fontSize: 18,
  },
});

UploadAvatar.propTypes = {
  navigation: PropTypes.object,
};

export default UploadAvatar;
