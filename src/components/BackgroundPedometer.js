import React from "react";
import Expo from "expo";
import { Pedometer } from "expo";
import { StyleSheet, Text, View, AsyncStorage, AppState, ScrollView, Button, Alert } from "react-native";
import { connect } from 'react-redux';

import * as actions from '../actions';
import constants from './../constants';

const { setAppState, setCampaignDates } = actions;
const { c, retrieveData } = constants;

class BackgroundPedometer extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({type: c.GET_LAST_STEP_STATE});

    AppState.addEventListener('change', this._handleAppStateChange);

    this._checkPedometerAvailability();

    setTimeout(() => {
      if (
        this.props.steps.campaignDateArray !== null &&
        this.props.player.id !== null
      ) {
        dispatch({type: c.GET_STEPS});
      }
    }, 1000);

    setInterval(() => {
      if (
        this.props.appState === 'active' &&
        this.props.steps.campaignDateArray !== null &&
        this.props.player.id !== null
      ) {
        dispatch({type: c.GET_STEPS});
      }
    }, 60000);
  }

  componentDidUpdate() {
    this._constructDateLog();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _checkPedometerAvailability = () => {
    const { dispatch } = this.props;
    Pedometer.isAvailableAsync().then(
      (response) => {
        dispatch({type: c.IS_PEDOMETER_AVAILABLE, pedometerIsAvailable: response});
      }, (error) => {
        // maybe dispatch an action to the store to update state instead?
        Alert.alert('Walker Trekker can\'t connect to your phone\'s pedometer. Try closing the app and opening it again.')
      }
    );
  }

  _constructDateLog = () => {
    const { dispatch } = this.props;
    const { campaignDateArray, pedometerIsAvailable } = this.props.steps;
    const { difficultyLevel, length, startDate, stepTargets } = this.props.campaign;
    if (
      startDate !== null &&
      campaignDateArray === null &&
      pedometerIsAvailable
    ) {
      const stepGoalDayOne = stepTargets[0];
      let day1 = new Date(startDate);
      day1 = new Date(day1.setTime(day1.getTime() + 86400000));
      const day1Start = new Date(day1);
      const day1End = new Date(day1);
      day1Start.setHours(6,0,0,0);
      day1End.setHours(24,0,0,0);

      dispatch(setCampaignDates(day1Start, day1End, length, difficultyLevel, stepGoalDayOne));
    }
  }

  _handleAppStateChange = (nextAppState) => {
    const { dispatch } = this.props;
    const { campaignDateArray } = this.props.steps;
    const { id } = this.props.player;
    if (
      this.props.appState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      campaignDateArray !== null &&
      id !== null
    ) {
      dispatch({type: c.GET_STEPS})
    }
    dispatch(setAppState(nextAppState));
  };

  render() {
    return null;
  }

} // end of class

function mapStateToProps(state) {
  return {
    appState: state.appState,
    steps: state.steps,
    campaign: state.campaign,
    player: state.player,
  }
}

export default connect(mapStateToProps)(BackgroundPedometer);
