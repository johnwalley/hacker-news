import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  position: {
    fontSize: 30,
    textAlign: 'right',
    marginLeft: 10,
    color: '#BBBBBB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    margin: 10,
  },
  details: {
    fontSize: 10,
    textAlign: 'left',
    margin: 10,
  },
});

export default Story = ({ onPress, position, title, points, user, timeAgo, commentsCount }) =>
  <TouchableHighlight
    onPress={onPress}>
    <View style={styles.container}>
      <Text style={styles.position}>{position}</Text>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.details}>{points} points by {user} {timeAgo} | {commentsCount || 0} comments</Text>
      </View>
    </View>
  </TouchableHighlight >
