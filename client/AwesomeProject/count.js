import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';


export default class CountBox extends Component {
  render() {
    return (
      <View style={styles.countsData}>
        <Text style={styles.header1}>this.props.h1</Text>
        <Text style={styles.header2}>this.props.h2</Text>
        <Text style={styles.count}>{this.props.hoursData}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  countsData: {
    flex: 1,
  },
  count: {
    fontSize: 50,
    paddingTop: 40,
    paddingRight: 10,
    marginBottom: 20,
    textAlign: 'right',
    borderWidth: 1,
  },
})



CountBox.propTypes = {
  h1: PropTypes.func.isRequired,
  h2: PropTypes.func.isRequired,
  hoursData: PropTypes.func.isRequired
}
