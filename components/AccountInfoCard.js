import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Card} from 'react-native-elements';
import PropTypes from 'prop-types';

import Colours from './../utils/Colours';

const AccountInfoCard = ({accountInfo, ...props}) => {
  return (
    <Card containerStyle={styles.card}>
      <View style={styles.cardSection}>
        <Text style={[styles.text, styles.labels]}>Username:</Text>
        <Text style={[styles.text, styles.info]}>{accountInfo.username}</Text>
      </View>
      <Card.Divider style={styles.divider} />
      <View style={styles.cardSection}>
        <Text style={[styles.text, styles.labels]}>Name:</Text>
        <Text style={[styles.text, styles.info]}>{accountInfo.full_name}</Text>
      </View>
      <Card.Divider style={styles.divider} />
      <View style={styles.cardSection}>
        <Text style={[styles.text, styles.labels, {flexGrow: 0.5}]}>
          Email:
        </Text>
        <Text style={[styles.text, styles.info]}>{accountInfo.email}</Text>
      </View>
      <Card.Divider style={styles.divider} />
      <View style={styles.cardSection}>
        <Text style={[styles.text, styles.labels]}>Favourite Book:</Text>
        <Text style={[styles.text, styles.info]}>placeholder</Text>
      </View>
      <Card.Divider style={styles.divider} />
    </Card>
  );
};

export default AccountInfoCard;

const styles = StyleSheet.create({
  card: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colours.accentOrange,
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
    color: Colours.primaryBlue,
    marginLeft: 5,
    marginRight: 5,
    textAlignVertical: 'bottom',
  },
  labels: {
    textAlign: 'left',
    flexShrink: 1,
    fontFamily: 'ProximaSoftMedium',
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

AccountInfoCard.propTypes = {
  accountInfo: PropTypes.object,
};
