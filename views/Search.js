import React, {useContext, useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import SearchComponent from '../components/SearchComponent';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import SectionHeader from '../components/SectionHeader';
import ListVertical from '../components/ListVertical';
import SearchBrowserComponent from '../components/SearchBrowserComponent';

const Search = ({navigation}) => {
  const {searchResultArray, searchIsEmpty, setSearchIsEmpty} = useContext(
    MainContext
  );

  useEffect(() => {
    setSearchIsEmpty(false);
  }, []);

  return (
    <ListVertical
      ListHeaderComponent={
        <>
          <SearchBrowserComponent />
          <SearchComponent />
          <SectionHeader
            content="Search Result"
            containerStyle={{marginTop: 10, marginBottom: 10}}
          />
          {searchIsEmpty && <Text>The search result is empty...</Text>}
        </>
      }
      numColumns={2}
      navigation={navigation}
      loadData={searchResultArray}
      style={styles.verticalListContainer}
      load
    />
  );
};

export default Search;

Search.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  verticalListContainer: {
    marginTop: 10,
    marginLeft: 3,
    backgroundColor: 'white',
  },
});
