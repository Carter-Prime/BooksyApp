import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useFonts} from 'expo-font';

const MainContext = React.createContext({});

const MainProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(0);
  const [signInScreen, setSignInScreen] = useState(true);
  const [loaded, setLoaded] = useFonts({
    McLarenRegular: require('../assets/fonts/McLaren-Regular.ttf'),
    ProximaSoftMedium: require('../assets/fonts/ProximaSoft-Medium.ttf'),
    ProximaSoftRegular: require('../assets/fonts/ProximaSoft-Regular.ttf'),
  });
  const [tagState, setTagState] = useState([
    {tag: 'TextBook', value: false},
    {tag: 'Fantasy', value: false},
    {tag: 'SciFi', value: false},
    {tag: 'Classics', value: false},
    {tag: 'Languages', value: false},
    {tag: 'Graphic Novels', value: false},
    {tag: 'Romance', value: false},
    {tag: 'Mystery', value: false},
    {tag: 'Thrillers', value: false},
    {tag: 'Informational', value: false},
    {tag: 'Crime', value: false},
    {tag: 'Cookbooks', value: false},
    {tag: 'Biography', value: false},
    {tag: 'Autobiography', value: false},
  ]);

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        update,
        setUpdate,
        loaded,
        setLoaded,
        signInScreen,
        setSignInScreen,
        tagState,
        setTagState,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};
