import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Comment = ({ level, content, user, timeAgo }) =>
  <View style={{ paddingLeft: level * 10 + 10 }}>
    <Text style={{ fontWeight: 'bold', color: '#888888' }}>{user}, {timeAgo}</Text>
    <Text>{content}</Text>
  </View>
