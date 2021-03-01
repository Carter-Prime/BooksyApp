import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Card} from 'react-native-elements';
import PropTypes from 'prop-types';

import Colours from './../utils/Colours';

const AccountStatisticCard = ({accountStats, ...props}) => {
  const statsObject = JSON.parse(accountStats);

  return (
    <Card containerStyle={styles.card}>
      <View style={styles.cardSection}>
        <Text style={[styles.text, styles.labels]}>Rating:</Text>
        <Text style={[styles.text, styles.info]}>{statsObject.rating}</Text>
      </View>
      <Card.Divider style={styles.divider} />
      <View style={styles.cardSection}>
        <Text style={[styles.text, styles.labels]}>Number of Posts: </Text>
        <Text style={[styles.text, styles.info]}>
          {statsObject.numberOfPosts}
        </Text>
      </View>
      <Card.Divider style={styles.divider} />
      <View style={styles.cardSection}>
        <Text style={[styles.text, styles.labels, {flexGrow: 0.5}]}>
          Swapped:
        </Text>
        <Text style={[styles.text, styles.info]}>
          {statsObject.booksSwapped}
        </Text>
      </View>
      <Card.Divider style={styles.divider} />
    </Card>
  );
};

export default AccountStatisticCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colours.primaryBlue,
    backgroundColor: Colours.secondaryNeutral,
  },
  cardSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    flex: 1,
    fontFamily: 'ProximaSoftRegular',
    fontSize: 16,
    width: '100%',
    color: Colours.textDark,
    marginLeft: 5,
    marginRight: 5,
    textAlignVertical: 'bottom',
  },
  labels: {
    textAlign: 'left',
    flexShrink: 1,
    fontFamily: 'ProximaSoftRegular',
    color: Colours.textDark,
  },
  info: {
    flexGrow: 1.5,
    textAlign: 'right',
  },
  divider: {
    backgroundColor: Colours.accentOrange,
    marginHorizontal: 5,
    height: 0.75,
  },
});

AccountStatisticCard.propTypes = {
  accountStats: PropTypes.string,
};
