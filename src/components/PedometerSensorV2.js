import Expo from "expo";
import React from "react";
import { Pedometer } from "expo";
import { StyleSheet, Text, View, AsyncStorage, AppState, ScrollView, Button } from "react-native";

import StepShower from './StepShower';

export default class PedometerSensorV2 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      isPedometerAvailable: "checking",
      todayStepCount: 0,
      yesterdayStepCount: 0,
      currentStepCount: 0,
      campaignLength: 15, /*this should not be static; it should be informed by actual campaign length*/
      campaignStartDate: new Date('January 28, 2019 06:00:00'), /*this needs to not be a static value; it should be informed by the actual campaign start date*/
      campaignDateArray: null, /*this should only be null at start*/
    };
    this._storeData = this._storeData.bind(this);
    this._retrieveData = this._retrieveData.bind(this);
  }

  componentWillMount() {
    if (this.state.campaignDateArray === null) {
      this._constructDateLog();
    }
  }

  componentDidMount() {
    this._subscribe();
    AppState.addEventListener('change', this._handleAppStateChange);
    this._updatePastStepCounts();
    setInterval(() => {
      if (this.state.appState === 'active') {
        console.log('one more minute down!');
        this._updatePastStepCounts();
      }
    }, 60000);
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscription = Pedometer.watchStepCount(result => {
      this.setState({
        currentStepCount: result.steps
      });
    });

    Pedometer.isAvailableAsync().then(
      result => {
        this.setState({
          isPedometerAvailable: String(result)
        });
      },
      error => {
        this.setState({
          isPedometerAvailable: "Could not get isPedometerAvailable: " + error
        });
      }
    );

    const todayStart = new Date();
    const todayEnd = new Date();
    todayStart.setHours(6,0,0,0);
    todayEnd.setHours(24,0,0,0);

    Pedometer.getStepCountAsync(todayStart, todayEnd).then(
      result => {
        this.setState({ todayStepCount: result.steps });
      },
      error => {
        this.setState({
          todayStepCount: "Could not get stepCount: " + error
        });
      }
    );
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  _constructDateLog = () => {
    // set variables
    const { campaignStartDate, campaignLength } = this.state;
    const dateArray = [];
    const day1Start = new Date(campaignStartDate);
    const day1End = new Date(campaignStartDate);
    day1Start.setHours(6,0,0,0);
    day1End.setHours(24,0,0,0);
    // create array of campaign days based on campaignLength and campaignStartDate
    for (i=0; i < campaignLength; i++) {
      if (i === 0) {
        // first iteration has 0 mutations from variables
        dateArray.push({
          day: i + 1,
          start: new Date(day1Start),
          end: new Date(day1End),
        });
      } else {
        // all iterations after 1 add i days to date variables
        const start = new Date(day1Start);
        const end = new Date(day1End);
        dateArray.push({
          day: i + 1,
          start: new Date(start.setDate(start.getDate() + i)),
          end: new Date(end.setDate(end.getDate() + i)),
        });
      }
    }

    // put that array into state
    this.setState({
      campaignDateArray: dateArray
    })
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this._updateStepCounts();
    }
    this.setState({appState: nextAppState});
  };

  _updateStepCounts = () => {
    this._updateStepCountsYesterday();
    this._updateStepCountsToday();
  }

  _updateStepCountsToday = () => {

    //set dates for today
    const todayStart = new Date();
    const todayEnd = new Date();
    todayStart.setHours(6,0,0,0);
    todayEnd.setHours(24,0,0,0);
    //query pedometer for today's date range
    Pedometer.getStepCountAsync(todayStart, todayEnd).then(
      async (result) => {
        // if we have today's step total from the pedometer, we store it in AsyncStorage
        console.log('today\'s pedometer total is ' + result.steps.toString());
        await this._storeData('todayStepCountStorage', result.steps.toString());
        // now that it's been stored, we retrieve it and set is as the todayStepCount state value
        this.setState({
          todayStepCount: parseInt(await this._retrieveData('todayStepCountStorage'), 10),
        });
        console.log('todayStepCount state set to ' + this.state.todayStepCount);
        // return this.state.todayStepCount;
      },
      error => {
        // if we have an error, state shows the error
        this.setState({
          todayStepCount: "Could not get stepCount: " + error
        });
      }
    );
  }

  _updateStepCountsYesterday = () => {

    //set dates for yesterday
    const yesterdayStart = new Date();
    const yesterdayEnd = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayStart.setHours(6,0,0,0);
    yesterdayEnd.setHours(24,0,0,0);

    //query pedometer for yesterday's date range
    Pedometer.getStepCountAsync(yesterdayStart, yesterdayEnd).then(
      async (result) => {
        // if we have yesterday's step total from the pedometer, we store it in AsyncStorage
        console.log('yesterday\'s pedometer total is ' + result.steps.toString());
        await this._storeData('yesterdayStepCountStorage', result.steps.toString());
        // now that it's been stored, we retrieve it and set is as the yesterdayStepCount state value
        this.setState({
          yesterdayStepCount: parseInt(await this._retrieveData('yesterdayStepCountStorage'), 10),
        });
        console.log('yesterdayStepCount state set to ' + this.state.yesterdayStepCount);
        // return this.state.yesterdayStepCount;
      },
      error => {
        // if we have an error, state shows the error
        this.setState({
          yesterdayStepCount: "Could not get stepCount: " + error
        });
      }
    );
  }

  _updatePastStepCounts = () => {
    const { campaignDateArray } = this.state;
    const campaignDateArrayCopy = JSON.parse(JSON.stringify(campaignDateArray))

    campaignDateArrayCopy.forEach((obj, index) => {
      // console.log('206: ',obj.start, obj.end);
      Pedometer.getStepCountAsync(new Date(obj.start), new Date(obj.end)).then(
        async (result) => {
          await this._storeData('day' + (index + 1) + 'StepCountStorage', result.steps.toString());
          const stepsToAdd = {
            steps: parseInt(await this._retrieveData('day' + (index + 1) + 'StepCountStorage'), 10)
          }
          // console.log('213: ', stepsToAdd);
          const dateWithSteps = Object.assign({}, campaignDateArrayCopy[index], stepsToAdd);
          campaignDateArrayCopy.splice(index, 1, dateWithSteps)
          // console.log('216: ', index + ': ' + result.steps);
          this.setState({
            campaignDateArray: campaignDateArrayCopy
          });
        },
        error => {
          console.log('error retrieving pedometer data at campaign day ' + (index + 1) + ' in _updatePastStepCounts');
        }
      );
    });
  }

  async _storeData(keyString, valueString) {
    try {
      await AsyncStorage.setItem(keyString, valueString);
      console.log(keyString + ' saved as ' + valueString);
    } catch (error) {
      console.log(keyString + ' data could not be saved');
    }
  }

  async _retrieveData(keyString) {
    try {
      const value = await AsyncStorage.getItem(keyString);
      if (value !== null) {
        console.log(keyString + ' retrieved as ' + value);
        return value;
      }
    } catch (error) {
      console.log(keyString + ' data could not be retrieved');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          Pedometer.isAvailableAsync(): {this.state.isPedometerAvailable}
        </Text>
        <Text>
          Steps taken today: {this.state.todayStepCount}
        </Text>
        <ScrollView>
          {this.state.campaignDateArray.map((dateObj, index) =>
            <StepShower day={dateObj.day}
              start={dateObj.start.toString()}
              steps={dateObj.steps}
              key={index} />
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center"
  },
});

// HERE THERE BE STUFF!
// Prevously-used content goes here:

// <Text>Walk! And watch this go up: {this.state.currentStepCount}</Text>

// <Button title='update past steps'
//   onPress={this._updatePastStepCounts} />

// <Text>
//   Steps taken yesterday: {this.state.yesterdayStepCount}
// </Text>