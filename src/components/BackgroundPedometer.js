import React from "react";
import Expo from "expo";
import { Pedometer } from "expo";
import { StyleSheet, Text, View, AsyncStorage, AppState, ScrollView, Button, Alert } from "react-native";
import { connect } from 'react-redux';
import { put } from 'redux-saga/effects'

import * as actions from '../actions';
import constants from './../constants';

const { setAppState, setCampaignDates } = actions;
const { c } = constants;

class BackgroundPedometer extends React.Component {

  constructor(props) {
    super(props);
    this._storeData = this._storeData.bind(this);
    this._retrieveData = this._retrieveData.bind(this);
  }


  componentWillMount() {
    const { campaignDateArray } = this.props.steps;
    if (campaignDateArray === null) {
      this._constructDateLog();
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;

    AppState.addEventListener('change', this._handleAppStateChange);
//======================
    // this is all unnecessary unless the pedometer stops working again. for now i'm gonna have it pop up an alert if the pedometer can't connect
    Pedometer.isAvailableAsync().then(
      (result) => {
        // maybe dispatch an action to the store to update state
        console.log('\'dometer is available');
      }, (error) => {
        // maybe dispatch an action to the store to update state
        Alert.alert('Walker Trekker can\'t connect to the pedometer. Try closing the app and opening it again.')
      }
    );
//======================
    dispatch({type: c.GET_STEPS});
//======================
    setInterval(() => {
      if (this.props.appState === 'active') {
        dispatch({type: c.GET_STEPS});
      }
    }, 60000);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _constructDateLog = () => {
    const { dispatch } = this.props; // replace dispatch with put?

    // these are placeholders to be actually informed by other state
    const campaignStartDate = new Date('January 25, 2019 06:00:00');
    const campaignLength = 15

    // these can stay exactly as-is, i think
    const day1Start = new Date(campaignStartDate);
    const day1End = new Date(campaignStartDate);
    day1Start.setHours(6,0,0,0);
    day1End.setHours(24,0,0,0);

    dispatch(setCampaignDates(day1Start, day1End, campaignLength)); // replace dispatch with put?
  }


  _handleAppStateChange = (nextAppState) => {
    const { dispatch } = this.props;
    if (
      this.props.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      dispatch({type: c.GET_STEPS})
    }
    dispatch(setAppState(nextAppState));
  };

  // we might be able to get rid of this once we hook up the backend
  async _storeData(keyString, valueString) {
    try {
      await AsyncStorage.setItem(keyString, valueString);
    } catch (error) {
      console.log(keyString + ' data could not be saved - ' + error);
    }
  }

  // we might be able to get rid of this once we hook up the backend
  async _retrieveData(keyString) {
    try {
      const value = await AsyncStorage.getItem(keyString);
      if (value !== null) {
        return value;
      }
    } catch (error) {
      console.log(keyString + ' data could not be retrieved - ' + error);
    }
  }

  render() {
    return null;
  }

} // end of class

function mapStateToProps(state) {
  return {
    appState: state.appState,
    steps: state.steps,
  }
}

export default connect(mapStateToProps)(BackgroundPedometer);