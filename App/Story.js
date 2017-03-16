import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

const styles = StyleSheet.create({
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

export default Story = ({ onPress, title, points, user, timeAgo, commentsCount }) =>
  <TouchableHighlight
    onPress={onPress}>
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.details}>{points} points by {user} {timeAgo} | {commentsCount || 0} comments</Text>
    </View>
  </TouchableHighlight >
