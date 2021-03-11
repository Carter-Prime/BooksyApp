import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';

import {MainContext} from '../contexts/MainContext';
import {CustomCheckbox} from './CustomCheckbox';

const TagCheckboxSelector = () => {
  const {tagState, setTagState} = useContext(MainContext);

  const updateState = (label, state) => {
    const list = [...tagState];
    const index = list.findIndex((item) => item.tag === label);
    list[index].value = state;
    setTagState(list);
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.tagRow}>
          <CustomCheckbox
            label="TextBook"
            state={tagState[0].value}
            updateState={updateState}
          />
          <CustomCheckbox
            label="Fantasy"
            state={tagState[1].value}
            updateState={updateState}
          />
          <CustomCheckbox
            label="SciFi"
            state={tagState[2].value}
            updateState={updateState}
          />
        </View>
        <View style={styles.tagRow}>
          <CustomCheckbox
            label="Classics"
            state={tagState[3].value}
            updateState={updateState}
          />
          <CustomCheckbox
            label="Languages"
            state={tagState[4].value}
            updateState={updateState}
          />
          <CustomCheckbox
            label="Graphic Novels"
            state={tagState[5].value}
            updateState={updateState}
          />
          <CustomCheckbox
            label="Autobiography"
            state={tagState[13].value}
            updateState={updateState}
          />
        </View>
      </View>
      <View>
        <View style={styles.tagRow}>
          <CustomCheckbox
            label="Romance"
            state={tagState[6].value}
            updateState={updateState}
          />
          <CustomCheckbox
            label="Mystery"
            state={tagState[7].value}
            updateState={updateState}
          />
          <CustomCheckbox
            label="Thrillers"
            state={tagState[8].value}
            updateState={updateState}
          />
        </View>
        <View style={styles.tagRow}>
          <CustomCheckbox
            label="Informational"
            state={tagState[9].value}
            updateState={updateState}
          />
          <CustomCheckbox
            label="Crime"
            state={tagState[10].value}
            updateState={updateState}
          />
          <CustomCheckbox
            label="Cookbooks"
            state={tagState[11].value}
            updateState={updateState}
          />
          <CustomCheckbox
            label="Biography"
            state={tagState[12].value}
            updateState={updateState}
          />
        </View>
      </View>
    </View>
  );
};

export default TagCheckboxSelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tagRow: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});

TagCheckboxSelector.propTypes = {
  reset: PropTypes.func,
};
