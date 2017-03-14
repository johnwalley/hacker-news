import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Hyperlink from 'react-native-hyperlink'

const styles = StyleSheet.create({
  info: {
    fontWeight: 'bold', color: '#888888'
  }
});

export default Comment = ({ level, content, user, timeAgo }) =>
  <View style={{ paddingLeft: level * 10 + 10 }}>
    <Text style={styles.info}>{user}, {timeAgo}</Text>
    <Hyperlink onPress={url => Linking.openURL(url).catch(err => console.error('An error occurred', err))} linkStyle={{ color: '#2980b9' }}>
      <Text>{content}</Text>
    </Hyperlink>
  </View>
