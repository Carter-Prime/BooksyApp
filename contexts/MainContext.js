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
  const [searchSelection, setSearchSelection] = useState([
    {tag: 'Title', value: false},
    {tag: 'Description', value: false},
    {tag: 'Tags', value: false},
  ]);
  const [isWatchingVisible, setIsWatchingVisible] = useState(true);
  const [searchResultArray, setSearchResultArray] = useState([]);
  const [showSearchBox, setShowSearchBox] = useState(true);
  const [showTagBox, setShowTagBox] = useState(true);
  const [searchIsEmpty, setSearchIsEmpty] = useState(false);

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
        isWatchingVisible,
        setIsWatchingVisible,
        searchSelection,
        setSearchSelection,
        searchResultArray,
        setSearchResultArray,
        showSearchBox,
        setShowSearchBox,
        showTagBox,
        setShowTagBox,
        searchIsEmpty,
        setSearchIsEmpty,
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
