import React from 'react';
import {FlatList, StyleSheet} from 'react-native';

import ListItem from './ListItem';
import PropTypes from 'prop-types';

const ListVertical = ({
  navigation,
  extraContentContainerStyle,
  loadData,
  ...props
}) => {
  return (
    <FlatList
      {...props}
      contentContainerStyle={[styles.container, extraContentContainerStyle]}
      data={loadData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

ListVertical.propTypes = {
  navigation: PropTypes.object,
  loadData: PropTypes.array,
  extraContentContainerStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
});

export default ListVertical;
