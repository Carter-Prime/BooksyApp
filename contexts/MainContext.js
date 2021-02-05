import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useFonts} from 'expo-font';

const MainContext = React.createContext({});

const MainProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loaded, setLoaded] = useFonts({
    McLarenRegular: require('../assets/fonts/McLaren-Regular.ttf'),
    ProximaSoftMedium: require('../assets/fonts/ProximaSoft-Medium.ttf'),
    ProximaSoftRegular: require('../assets/fonts/ProximaSoft-Regular.ttf'),
  });

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        loaded,
        setLoaded,
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
