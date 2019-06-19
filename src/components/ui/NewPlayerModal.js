import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, ImageBackground, TextInput, TouchableOpacity, AsyncStorage, } from 'react-native';
import { ImagePicker, Permissions, Notifications } from 'expo';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

import TwoButtonOverlay from '../ui/TwoButtonOverlay';
import SingleButtonFullWidth from '../ui/SingleButtonFullWidth';
import NewPlayerForm from './NewPlayerForm';
import AccountRecovery from './AccountRecovery';

import defaultStyle from '../../styles/defaultStyle';
import constants from '../../constants';
import { ScrollView } from 'react-native-gesture-handler';
const { c } = constants
const use_item_bg = require('../../../assets/use_item_bg.png');


class NewPlayerModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recoveryModalToggle: false,
    }
  }

  _handleRecoveryModalToggle = () => {
    this.setState(!this.state.recoveryModalToggle)
  }

  conditionalRenderModalContent = () => {
    return this.state.recoveryModalToggle ? <AccountRecovery handleModalStateChange={this.props.handleModalStateChange}/> : <NewPlayerForm handleModalStateChange={this.props.handleModalStateChange}/>
  }

  render() {
    return(
      <ImageBackground
      source={use_item_bg}
      resizeMode='cover'
      style={customStyles.itemBg}
      >
        <View style={[customStyles.container, {backgroundColor: 'rgba(0,0,0,0.4)'}]}>
          {this.conditionalRenderModalContent()}
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create(defaultStyle);
const widthUnit = wp('1%');
const heightUnit = hp('1%');
const customStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'darkred',
    // justifyContent: 'center',
    // borderRadius: 5,
    padding: widthUnit * 5,
  },
  itemBg: {
    width: undefined,
    height: undefined,
    flex: 1,
    justifyContent: 'flex-start',
  },
})


function mapStateToProps(state) {
  return {
    player: state.player,
    campaign: state.campaign,
  }
}

export default connect(mapStateToProps)(NewPlayerModal);