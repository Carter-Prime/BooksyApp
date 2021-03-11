import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import ListItem from './ListItem';

const List = ({navigation, loadData, largeTile, ...props}) => {
  return (
    <FlatList
      style={styles.container}
      {...props}
      data={loadData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  loadData: PropTypes.array,
  largeTile: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});

export default List;
