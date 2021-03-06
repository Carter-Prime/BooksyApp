import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Button} from 'react-native';
import SearchComponent from '../components/SearchComponent';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import SectionHeader from '../components/SectionHeader';
import ListVertical from '../components/ListVertical';

const Search = ({navigation}) => {
  const {searchResultArray} = useContext(MainContext);

  const getSearchResults = (input) => {
    setSearchResult(input);
  };

  const printList = () => {
    console.log(searchResultArray);
  };

  return (
    <View>
      <SearchComponent SearchResult={(input) => getSearchResults(input)} />
      <SectionHeader content="Search Result" containerStyle={{marginTop: 10}} />
      <ListVertical
        numColumns={2}
        navigation={navigation}
        loadData={searchResultArray}
        style={styles.verticalListContainer}
        extraContentContainerStyle={{paddingBottom: 100}}
      />
    </View>
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
  },
});
