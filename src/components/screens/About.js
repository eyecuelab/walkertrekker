import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import defaultStyle from '../../styles/defaultStyle';
import SingleButtonFullWidth from '../ui/SingleButtonFullWidth';

export default class About extends React.Component {

  render() {
    return(
      <ImageBackground
        source={this.props.screenProps.backgroundImage}
        style={{width: '100%', height: '100%'}}
      >
        <View style={styles.container}>
          <View style={customStyles.headlineContainer}>
            <Text style={styles.headline}>About{"\n"}Walker{"\n"}Trekker</Text>
          </View>
          <View style={customStyles.textContainer}>
            <Text style={[styles.plainText, customStyles.text]}>Walker Trekker is a social step program that puts you and your group in a fictional city infested by zombies. Your goal is to have all members of your group reach a new safe house before nightfall each day.</Text>
          </View>
          <View style={customStyles.textContainer}>
            <Text style={[styles.plainText, customStyles.text]}>If anyone doesn't meet the requirement, you will be forced to start over from the previous safe house. And the consequences can be dire for the entire group.</Text>
          </View>
          <View style={customStyles.textContainer}>
            <Text style={[styles.plainText, customStyles.text]}>Walker Trekker features campaigns that can be configured with various days, difficulty levels, and participants.</Text>
          </View>
          <View style={customStyles.buttonContainer}>
            <SingleButtonFullWidth
              backgroundColor='black'
              title='Start a Campaign'
              onButtonPress={() => this.props.navigation.navigate('CreateCampaign')}
            />
          </View>
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create(defaultStyle);
const widthUnit = wp('1%');
const heightUnit = hp('1%');
const customStyles = StyleSheet.create({
  headlineContainer: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  textContainer: {
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
  },
  text: {
    lineHeight: heightUnit*3.75,
  },
  buttonContainer: {
    marginTop: heightUnit*10,
    width: '100%',
    height: heightUnit*10,
    alignItems: 'center',
    justifyContent: 'center',
  },
})