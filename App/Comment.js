import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Hyperlink from 'react-native-hyperlink'

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  info: {
    fontWeight: 'bold',
    color: 'grey',
    paddingTop: 5,
    paddingBottom: 5,
  },
  content: {
    color: 'black',
    paddingTop: 5,
    paddingBottom: 5,
  }
});

const styles2 = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  title: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingTop: 5,
    paddingBottom: 5,
  },
  details: {
    fontSize: 12,
    color: 'grey',
    textAlign: 'left',
    paddingBottom: 5,
  },
});

export default Comment = ({ level, content, user, timeAgo }) =>
  <View style={StyleSheet.flatten([styles.container, { paddingLeft: level * 10 + 10 }])}>
    <Text style={styles.info}>{user}, {timeAgo}</Text>
    <Hyperlink onPress={url => Linking.openURL(url).catch(err => console.error('An error occurred', err))} linkStyle={{ color: '#2980b9' }}>
      <Text style={styles.content}>{content}</Text>
    </Hyperlink>
  </View>
