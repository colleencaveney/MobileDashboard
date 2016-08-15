/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  ListView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Container, Content, Card, CardItem, Text, Badge, List, ListItem, Icon } from 'native-base';
import Chart from 'react-native-chart';


class AwesomeProject extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {Top3AUsers: ds.cloneWithRows([]), Top3EUsers: ds.cloneWithRows([])};
    fetch('https://xilinx-stage.entitlenow.com/mobiledashboard/api/dashboard')
      .then((response) => response.json())
      .then((responseJson) => {
      this.setState(
        {
          Hours: responseJson.Past24HoursLicenseCount,
          AUserLCount: responseJson.AccountUserLicenseCount,
          EUserLCount: responseJson.EvalUserLicenseCount,
          UAUserLCount: responseJson.UniqueAccountUserLicenseCount,
          UEUserLCount: responseJson.UniqueEvalUserLicenseCount,
          Top3AUsers: ds.cloneWithRows(responseJson.Top3AccountUsers),
          Top3EUsers: ds.cloneWithRows(responseJson.Top3EvalUsers)
        });
    })
  }

  render () {
    let hoursData = this.state.Hours;
    let AULCData = this.state.AUserLCount;
    let EULCData = this.state.EUserLCount;
    let UAULCData = this.state.UAUserLCount;
    let UEULCData = this.state.UEUserLCount;
    let T3AUData = this.state.Top3AUsers;
    let T3EUData = this.state.Top3EUsers;
    return (
      <ScrollView>
        <View style={styles.container}>

          <View style={styles.titleView}><Text style={styles.title}>Dashboard</Text></View>

          <View style={styles.countsData}>
            <Text style={styles.header1}>Past 24 Hours</Text>
            <Text style={styles.header2}>License Download Count</Text>
            <Text style={styles.count}>{hoursData}</Text>
          </View>

          <View style={styles.countsData}>
            <Text style={styles.header1}>Account Users</Text>
            <Text style={styles.header2}>License Download Count</Text>
            <Text style={styles.count}>{AULCData}</Text>
          </View>

          <View style={styles.countsData}>
            <Text style={styles.header1}>Evaluation Users</Text>
            <Text style={styles.header2}>License Download Count</Text>
            <Text style={styles.count}>{EULCData}</Text>
          </View>

          <View style={styles.countsData}>
            <Text style={styles.header1}>Unique Account Users</Text>
            <Text style={styles.header2}>License Download Count</Text>
            <Text style={styles.count}>{UAULCData}</Text>
          </View>

          <View style={styles.countsData}>
            <Text style={styles.header1}>Unique Evaluation Users</Text>
            <Text style={styles.header2}>License Download Count</Text>
            <Text style={styles.count}>{UEULCData}</Text>
          </View>

          <View style={styles.chartContainer}>
              <Chart
                  style={styles.chart}
                  data= {[['Account Users',AULCData], ['Eval Users', EULCData], ['Unique Account Users', UAULCData], ['Unique Eval Users', UEULCData]]}
                  verticalGridStep={0}
                  type="bar"
                  showGrid={false}
              />
          </View>

          <View>
            <Text style={styles.header1}>Top 3 Account Users</Text>
            <Text style={styles.header2}>by License Download Count</Text>
            <ListView enableEmptySections={true} dataSource ={T3AUData} renderRow={(rowData) =>
                <View style={styles.listData}>
                  <Text style={styles.name}>{rowData.first_name} {rowData.last_name}</Text>
                  <Text style={styles.accountNumber}>{rowData.account_number}</Text>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{width: rowData.count/8, borderRadius: 10, height: 10, backgroundColor: '#FF3838', marginTop: 20}}/>
                    <Text style={styles.count2}>{rowData.count}</Text>
                  </View>
                </View>
              }/>
          </View>

          <View style={{paddingTop: 20}}>
            <Text style={styles.header1}>Top 3 Evaluation Users</Text>
            <Text style={styles.header2}>by License Download Count</Text>
            <ListView enableEmptySections={true} dataSource ={T3EUData} renderRow={(rowData) =>
                <View style={styles.listData}>
                  <Text style={styles.name}>{rowData.first_name} {rowData.last_name}</Text>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{width: rowData.count/2, borderRadius: 10, height: 10, backgroundColor: '#FF3838', marginTop: 20}}/>
                    <Text style={styles.count2}>{rowData.count}</Text>
                  </View>
                </View>
              }/>
          </View>
        </View>
      </ScrollView>
      );
    }
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  titleView: {
    height: 80,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    paddingTop: 40,
  },
  header1: {
    fontSize: 25,
    paddingTop: 20,
    textAlign: 'left',
  },
  header2: {
    fontSize: 18,
    paddingBottom: 5,
    textAlign: 'left',
  },
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
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    marginBottom: 25,
    marginTop:25,
  },
  chart: {
    width: 300,
    height: 200,
  },
  listData: {
    flex: 1,
    borderWidth: 1,
    marginTop: 10,
    marginLeft: 35,
    padding: 10,
  },
  name: {
    fontSize: 22,
    paddingTop: 10,
  },
  accountNumber: {
    fontSize: 15,
  },
  count2: {
    fontSize: 40,
    textAlign: 'right',
    paddingTop: 20,
    paddingBottom: 10,
    flex: 1,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
