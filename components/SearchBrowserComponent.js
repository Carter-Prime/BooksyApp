import React, {useContext} from 'react';
import {StyleSheet, View, TouchableOpacity, Dimensions} from 'react-native';
import {Button} from 'react-native-elements';
import {ChevronDown, ChevronUp} from 'react-native-feather';

import {MainContext} from '../contexts/MainContext';
import Colours from './../utils/Colours';
import SectionHeader from './SectionHeader';
import {useLoadMedia} from '../hooks/LoadMediaHooks';

const windowWidth = Dimensions.get('window').width;

const SearchBrowserComponent = () => {
  const {tagState, showTagBox, setShowTagBox} = useContext(MainContext);
  const {doTagSearch} = useLoadMedia();

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <SectionHeader
          content="Browse By Tag"
          containerStyle={{marginTop: 10}}
        />
        <View style={styles.dropDownIconContainer}>
          <TouchableOpacity
            onPress={() => {
              setShowTagBox(!showTagBox);
            }}
          >
            {showTagBox ? (
              <ChevronUp
                strokeWidth={1.5}
                color={Colours.primaryBlue}
                width={30}
                height={30}
              />
            ) : (
              <ChevronDown
                strokeWidth={1.5}
                color={Colours.primaryBlue}
                width={30}
                height={30}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {showTagBox && (
        <View style={styles.btnContainer}>
          <View style={styles.btnRow}>
            <Button
              title={tagState[0].tag}
              titleStyle={styles.title}
              containerStyle={styles.container}
              buttonStyle={styles.button}
              onPress={() => {
                doTagSearch(tagState[0].tag);
              }}
            />
            <Button
              title={tagState[1].tag}
              titleStyle={styles.title}
              containerStyle={styles.container}
              buttonStyle={styles.button}
              onPress={() => {
                doTagSearch(tagState[1].tag);
              }}
            />
            <Button
              title={tagState[2].tag}
              titleStyle={styles.title}
              containerStyle={styles.container}
              buttonStyle={styles.button}
              onPress={() => {
                doTagSearch(tagState[2].tag);
              }}
            />
          </View>
          <View style={styles.btnRow}>
            <Button
              title={tagState[3].tag}
              titleStyle={styles.title}
              containerStyle={styles.container}
              buttonStyle={styles.button}
              onPress={() => {
                doTagSearch(tagState[3].tag);
              }}
            />
            <Button
              title={tagState[4].tag}
              raised
              titleStyle={styles.title}
              containerStyle={styles.container}
              buttonStyle={styles.button}
              onPress={() => {
                doTagSearch(tagState[4].tag);
              }}
            />

            <Button
              title={tagState[5].tag}
              raised
              titleStyle={styles.title}
              containerStyle={styles.container}
              buttonStyle={styles.button}
              onPress={() => {
                doTagSearch(tagState[5].tag);
              }}
            />
          </View>
          <View style={styles.btnRow}>
            <Button
              title={tagState[6].tag}
              raised
              titleStyle={styles.title}
              containerStyle={styles.container}
              buttonStyle={styles.button}
              onPress={() => {
                doTagSearch(tagState[6].tag);
              }}
            />
            <Button
              title={tagState[7].tag}
              raised
              titleStyle={styles.title}
              containerStyle={styles.container}
              buttonStyle={styles.button}
              onPress={() => {
                doTagSearch(tagState[7].tag);
              }}
            />
            <Button
              title={tagState[8].tag}
              raised
              titleStyle={styles.title}
              containerStyle={styles.container}
              buttonStyle={styles.button}
              onPress={() => {
                doTagSearch(tagState[8].tag);
              }}
            />
          </View>
          <View style={styles.btnRow}>
            <Button
              title={tagState[9].tag}
              raised
              titleStyle={styles.title}
              containerStyle={styles.container}
              buttonStyle={styles.button}
              onPress={() => {
                doTagSearch(tagState[9].tag);
              }}
            />

            <Button
              title={tagState[10].tag}
              raised
              titleStyle={styles.title}
              containerStyle={styles.container}
              buttonStyle={styles.button}
              onPress={() => {
                doTagSearch(tagState[10].tag);
              }}
            />
            <Button
              title={tagState[11].tag}
              raised
              titleStyle={styles.title}
              containerStyle={styles.container}
              buttonStyle={styles.button}
              onPress={() => {
                doTagSearch(tagState[11].tag);
              }}
            />
          </View>
          <View style={styles.btnRow}>
            <Button
              title={tagState[12].tag}
              raised
              titleStyle={styles.title}
              containerStyle={styles.container}
              buttonStyle={styles.button}
              onPress={() => {
                doTagSearch(tagState[12].tag);
              }}
            />
            <Button
              title={tagState[13].tag}
              raised
              titleStyle={styles.title}
              containerStyle={styles.container}
              buttonStyle={styles.button}
              onPress={() => {
                doTagSearch(tagState[13].tag);
              }}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default SearchBrowserComponent;

const styles = StyleSheet.create({
  btnContainer: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginTop: 10,
    width: windowWidth * 0.8,
  },
  title: {
    fontFamily: 'ProximaSoftMedium',
    fontSize: 12,
    color: Colours.primaryBlue,
  },
  container: {},
  button: {
    width: 100,
    height: 30,
    backgroundColor: Colours.accentOrange,
  },
  btnRow: {
    width: windowWidth * 0.9,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: 3,
  },
  dropDownIconContainer: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 15,
    right: 20,
  },
});
