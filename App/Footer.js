import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderColor: '#8E8E8E',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  text: {
    color: '#8E8E8E',
  },
});

export default Footer = ({ loadMore }) =>
  <View style={styles.container}>
    <TouchableOpacity style={styles.button} onPress={loadMore}>
      <Text style={styles.text}>Load More</Text>
    </TouchableOpacity>
  </View>