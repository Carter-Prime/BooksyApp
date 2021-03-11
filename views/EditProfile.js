import React, {useContext, useEffect, useState, useRef} from 'react';
import {MainContext} from '../contexts/MainContext';
import {View, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-elements';
import PropTypes from 'prop-types';
import Colours from './../utils/Colours';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../components/CustomButton';
import {uploadsUrl} from '../utils/Variable';
import {useTag} from '../hooks/ApiHooks';
import InputTextBox from '../components/InputTextBox';
import useEditForm from '../hooks/ModifyHooks';
import {useUser} from '../hooks/ApiHooks';
import {
  Edit as EditIcon,
  User as UserIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  Users as UsersIcon,
  Book as BookIcon,
} from 'react-native-feather';
import EditHeader from '../components/SectionHeader';
import RoundButton from './../components/RoundButton';
import {useConfirm} from 'react-native-confirm-dialog';
import LottieView from 'lottie-react-native';
import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;

const EditProfile = ({navigation}) => {
  const {update, setUpdate, user} = useContext(MainContext);
  const {getFilesByTag} = useTag();
  const [isUploading, setIsUploading] = useState(false);
  const {modifyUser} = useUser();
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const {
    handleInputChange,
    handleInputEnd,
    inputs,
    setInputs,
    editErrors,
    reset,
    validateOnSend,
    checkUserAvailable,
  } = useEditForm();
  const confirmUpdateProfile = useConfirm();
  const loadingSpinAnimation = require('../assets/lottie/Loading.json');
  const loadAnimation = useRef();

  useEffect(() => {
    fetchAvatar();
    const userData = JSON.parse(user.full_name);
    setInputs({
      username: user.username,
      email: user.email,
      fullName: userData.fullName,
      favouriteBook: userData.favouriteBook,
    });
  }, []);

  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + user.user_id);
      if (avatarList.length > 0) {
        setAvatar(uploadsUrl + avatarList.pop().filename);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const doUpdate = async () => {
    if (!validateOnSend()) {
      console.log('validator on send failed');
      return;
    }

    delete inputs.confirmPassword;

    const additionalUserData = {
      fullName: inputs.fullName,
      favouriteBook: inputs.favouriteBook,
    };

    const uploadData = {
      username: inputs.username,
      email: inputs.email,
      full_name: JSON.stringify(additionalUserData),
    };

    try {
      setIsUploading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      await modifyUser(uploadData, userToken);

      confirmUpdateProfile({
        title: 'Profile was updated!',
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
          navigation.pop();
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
    setInputs({
      username: user.username,
      email: user.email,
      full_name: user.full_name.full_name,
    });
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <Avatar
        size={250}
        source={{
          uri: avatar,
        }}
        imageProps={{
          borderRadius: 5,
          borderWidth: 3,
          borderColor: Colours.primaryBlue,
        }}
      ></Avatar>
      <RoundButton
        icon={<EditIcon strokeWidth={1.5} color={Colours.primaryBlue} />}
        onPress={() => navigation.navigate('UploadAvatar')}
        extraStyle={styles.editAvatarBtn}
      />

      <EditHeader content="Edit Details" />
      <View style={styles.inputContainer}>
        <InputTextBox
          value={inputs.username}
          placeholder="username"
          onChangeText={(txt) => handleInputChange('username', txt)}
          onEndEditing={(event) => {
            checkUserAvailable(event);
            handleInputEnd('username', event.nativeEvent.text);
          }}
          errorMessage={editErrors.username}
          leftIcon={<UserIcon strokeWidth={1.5} color={Colours.primaryBlue} />}
        />
        <InputTextBox
          value={inputs.email}
          placeholder="email"
          onChangeText={(txt) => handleInputChange('email', txt)}
          onEndEditing={(event) =>
            handleInputEnd('email', event.nativeEvent.text)
          }
          errorMessage={editErrors.email}
          leftIcon={<MailIcon strokeWidth={1.5} color={Colours.primaryBlue} />}
        />
        <InputTextBox
          value={inputs.fullName}
          placeholder="full name"
          onChangeText={(txt) => handleInputChange('fullName', txt)}
          errorMessage={editErrors.fullName}
          leftIcon={<UsersIcon strokeWidth={1.5} color={Colours.primaryBlue} />}
        />
        <InputTextBox
          value={inputs.favouriteBook}
          placeholder="favourite book"
          onChangeText={(txt) => handleInputChange('favouriteBook', txt)}
          onEndEditing={(event) =>
            handleInputEnd('favouriteBook', event.nativeEvent.text)
          }
          errorMessage={editErrors.favouriteBook}
          leftIcon={<BookIcon strokeWidth={1.5} color={Colours.primaryBlue} />}
        />
        <InputTextBox
          value={inputs.password}
          placeholder="password"
          onChangeText={(txt) => handleInputChange('password', txt)}
          onEndEditing={(event) =>
            handleInputEnd('password', event.nativeEvent.text)
          }
          secureTextEntry={true}
          errorMessage={editErrors.password}
          leftIcon={<LockIcon strokeWidth={1.5} color={Colours.primaryBlue} />}
        />
        <InputTextBox
          value={inputs.confirmPassword}
          placeholder="confirm password"
          onChangeText={(txt) => handleInputChange('confirmPassword', txt)}
          onEndEditing={(event) =>
            handleInputEnd('confirmPassword', event.nativeEvent.text)
          }
          secureTextEntry={true}
          errorMessage={editErrors.confirmPassword}
          leftIcon={<LockIcon strokeWidth={1.5} color={Colours.primaryBlue} />}
        />
      </View>

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
      <CustomButton title="Update" onPress={doUpdate} extraStyle={styles.btn} />
      <CustomButton title="Reset" onPress={doReset} extraStyle={styles.btn} />
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
  inputContainer: {
    width: '100%',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  text: {
    fontFamily: 'ProximaSoftMedium',
    fontSize: 30,
  },
  btn: {
    width: '91%',
    marginRight: 20,
  },
  editAvatarBtn: {
    position: 'absolute',
    right: 60,
    top: 240,
  },
  animation: {
    width: windowWidth * 0.1,
    marginLeft: 0,
  },
});

EditProfile.propTypes = {
  navigation: PropTypes.object,
};

export default EditProfile;
