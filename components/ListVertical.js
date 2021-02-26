import React from 'react';
import {FlatList, StyleSheet} from 'react-native';

import LargeListItem from './LargeListItem';
import PropTypes from 'prop-types';

const ListVertical = ({navigation, loadData, ...props}) => {
  return (
    <FlatList
      {...props}
      contentContainerStyle={styles.container}
      data={loadData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <LargeListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

ListVertical.propTypes = {
  navigation: PropTypes.object,
  loadData: PropTypes.array,
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 155,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListVertical;
