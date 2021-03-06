import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {CustomCheckbox} from './CustomCheckbox';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const SearchCheckBoxSelector = () => {
  const {searchSelection, setSearchSelection} = useContext(MainContext);

  const updateState = (label, state) => {
    const list = [...searchSelection];
    const index = list.findIndex((item) => item.tag === label);
    list[index].value = state;
    setSearchSelection(list);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagRow}>
        <CustomCheckbox
          label="Title"
          state={searchSelection[0].value}
          updateState={updateState}
        />
        <CustomCheckbox
          label="Description"
          state={searchSelection[1].value}
          updateState={updateState}
        />
        <CustomCheckbox
          label="Tags"
          state={searchSelection[2].value}
          updateState={updateState}
        />
      </View>
    </View>
  );
};

export default SearchCheckBoxSelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tagRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
  },
});

SearchCheckBoxSelector.propTypes = {
  reset: PropTypes.func,
};
