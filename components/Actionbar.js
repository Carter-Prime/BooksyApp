import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {Divider, Icon} from 'react-native-elements';
import Colours from './../utils/Colours';
import PropTypes from 'prop-types';

const Actionbar = ({postData}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.iconContainerLeft}>
          <TouchableOpacity
            style={styles.iconContainerLeft}
            onPress={() => {
              setIsFavourite(!isFavourite);
            }}
          >
            {isFavourite ? (
              <Icon
                type="material-community"
                name="eye-outline"
                size={30}
                color={Colours.primaryBlue}
              />
            ) : (
              <Icon
                type="material-community"
                name="eye"
                size={30}
                color={Colours.primaryBlue}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.iconContainerRight}>
          <Text style={styles.likesText}>23</Text>
          <TouchableOpacity
            style={styles.iconContainerRight}
            onPress={() => {
              setIsLiked(!isLiked);
            }}
          >
            {isLiked ? (
              <Icon
                type="material-community"
                name="thumb-up"
                size={30}
                color={Colours.primaryBlue}
              />
            ) : (
              <Icon
                type="material-community"
                name="thumb-up-outline"
                size={30}
                color={Colours.primaryBlue}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Divider style={styles.divider} />
    </>
  );
};

export default Actionbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: -10,
  },
  iconContainerLeft: {
    flexDirection: 'row',
    paddingRight: 10,
  },
  iconContainerRight: {
    flexDirection: 'row',
    paddingLeft: 5,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colours.accentOrange,
    marginTop: 20,
  },
  likesText: {
    textAlignVertical: 'center',
    paddingLeft: 10,
    paddingTop: 5,
    fontFamily: 'ProximaSoftRegular',
    fontSize: 18,
  },
});

Actionbar.propTypes = {
  postData: PropTypes.object,
};
