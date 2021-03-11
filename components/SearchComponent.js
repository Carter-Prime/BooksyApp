import React, {useRef, useContext, useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Dimensions} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {ChevronDown, ChevronUp} from 'react-native-feather';
import AppLoading from 'expo-app-loading';
import LottieView from 'lottie-react-native';

import {MainContext} from '../contexts/MainContext';
import Colours from './../utils/Colours';
import SectionHeader from './../components/SectionHeader';
import CustomButton from './../components/CustomButton';
import SearchCheckBoxSelector from '../components/SearchCheckBoxSelector';
import {useLoadMedia} from '../hooks/LoadMediaHooks';

const windowWidth = Dimensions.get('window').width;

const SearchComponent = () => {
  const loadingSpinAnimation = require('../assets/lottie/Loading.json');
  const loadAnimation = useRef();
  const {loaded, searchSelection} = useContext(MainContext);
  const [inputs, setInputs] = useState({
    search: '',
  });
  const [searchData, setSearchData] = useState({});
  const [tagSearch, setTagSearch] = useState(false);
  const {showSearchBox, setShowSearchBox} = useContext(MainContext);
  const {doSearch, searchIsLoading} = useLoadMedia();
  const {setSearchResultArray} = useContext(MainContext);

  const handleInputChange = (name, text) => {
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
  };

  const handleSearchChange = (name, text) => {
    setSearchData((searchData) => {
      return {
        ...searchData,
        [name]: text,
      };
    });
  };

  useEffect(() => {
    checkSearchParameters();
  }, [inputs, searchSelection]);

  if (!loaded) {
    console.log('loaded: ', loaded);
    return <AppLoading onError={console.warn} />;
  }

  const checkSearchParameters = () => {
    setSearchData({});
    const searchCriteria = searchSelection
      .map((item) => {
        if (item.value == true) {
          return item.tag;
        }
      })
      .filter((item) => {
        return item !== undefined;
      });

    if (searchCriteria.includes('Title')) {
      if (inputs.search != '') {
        handleSearchChange('title', inputs.search);
      }
    }
    if (searchCriteria.includes('Description')) {
      if (inputs.search != '') {
        handleSearchChange('description', inputs.search);
      }
    }
    if (searchCriteria.includes('Tags')) {
      setTagSearch(true);
    } else {
      setTagSearch(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <SectionHeader
          content="Custom Search"
          containerStyle={{marginTop: 10}}
        />
        <View style={styles.dropDownIconContainer}>
          <TouchableOpacity
            onPress={() => {
              setShowSearchBox(!showSearchBox);
            }}
          >
            {showSearchBox ? (
              <ChevronUp
                strokeWidth={1.5}
                color={Colours.primaryBlue}
                width={30}
                height={30}
              />
            ) : (
              <ChevronDown
                strokeWidth={1.5}
                color={Colours.primaryBlue}
                width={30}
                height={30}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {showSearchBox && (
        <>
          <SearchBar
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.inputSearchBarContainer}
            inputStyle={styles.inputSearchBar}
            placeholder="Enter search here..."
            placeholderTextColor={Colours.placeholderText}
            onChangeText={(text) => {
              handleInputChange('search', text);
            }}
            value={inputs.search}
            platform="android"
            onClear={() => setSearchResultArray([])}
          />
          <View>
            <SearchCheckBoxSelector />
          </View>
          {searchIsLoading && (
            <LottieView
              ref={loadAnimation}
              source={loadingSpinAnimation}
              loop={true}
              autoPlay={true}
              progress={0}
              style={styles.animation}
            />
          )}

          <CustomButton
            title="Search"
            extraStyle={{marginLeft: 0}}
            onPress={() => {
              doSearch(searchData, tagSearch, inputs.search);
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  searchBarContainer: {
    width: windowWidth * 0.92,
    backgroundColor: Colours.transparentLight,
    padding: 2,
    marginTop: 20,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderRadius: 10,
  },
  inputSearchBarContainer: {
    height: 30,
    backgroundColor: Colours.transparentLight,
    color: Colours.primaryBlue,
  },
  inputSearchBar: {
    fontFamily: 'ProximaSoftRegular',
    fontSize: 16,
    color: Colours.primaryBlue,
  },
  dropDownIconContainer: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 15,
    right: 20,
  },
  animation: {
    width: windowWidth * 0.1,
    marginLeft: 0,
  },
});

export default SearchComponent;
