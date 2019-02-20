import React from 'react';
import { StyleSheet, Text, View, ImageBackground, ScrollView } from 'react-native';
import { Contacts, Permissions, Linking } from 'expo';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import constants from '../../constants';
const { c, storeData, retrieveData } = constants;

import ContactsList from '../ui/ContactsList';
import TwoButtonOverlay from '../ui/TwoButtonOverlay';

import defaultStyle from '../../styles/defaultStyle';

import { parsePhoneNumber } from '../../util/util';

class InvitePlayers extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contacts: {},
      contactsFetched: false,
      invites: {},
      numInvites: 0,
      selected: {},
      numSelected: 0,
    }
  }

  componentDidMount = () => {
    this.getContacts();
    const link = Linking.makeUrl('invite', { campaignId: this.props.campaign.campaignId })
  }

  getContacts = async () => {
    const { status, permissions } = await Permissions.askAsync(Permissions.CONTACTS);
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Image]
      });
      if (data.length > 0) {
        let contacts = {};
        data.forEach(contact => {
          const name = contact.name;
          let numbers = [];
          let key;
          const imageAvailable = contact.imageAvailable;
          let imageUri;
          if (contact.phoneNumbers) {
            contact.phoneNumbers.forEach(num => {
              if (num.label === 'mobile') {
                const phoneToAdd = num.number;
                key = parsePhoneNumber(phoneToAdd);
                numbers.push(phoneToAdd);
              }
            })
          }
          contact.imageAvailable ? imageUri = contact.image.uri : imageUri = 'none';
          if (numbers.length > 0) {
            contacts = Object.assign({}, contacts, {
              [key]: { id: key, name, numbers, imageAvailable, imageUri, invited: false, selected: false, }
            });
          }
        });
        await this.setState({ contacts,  });
      } else {
        throw new Error('No contacts found');
      }
      await this.setState({ contactsFetched: true, });
    } else {
      throw new Error('Contacts permission not granted.');
    }
  }

  handleSelectContact = async contact => {
    if (contact.invited) { console.log('Contact has already been invited.'); return;}
    const key = contact.id;
    const prevSelects = Object.assign({}, this.state.selected);
    const prevContacts = Object.assign({}, this.state.contacts);
    let newSelects = Object.assign({}, prevSelects);
    let newNumSelected = this.state.numSelected;
    let newContacts = Object.assign({}, prevContacts);
    newContacts[key].selected = !newContacts[key].selected;
    if (newContacts[key].selected === true) {
      newSelects = Object.assign({}, prevSelects, { [key]: contact});
      newNumSelected++;
    } else {
      delete newSelects[key];
      newNumSelected--;
    }
    await this.setState({
      contacts: newContacts,
      selected: newSelects,
      numSelected: newNumSelected,
    });
  }

  sendInvites = async () => {
    const { dispatch } = this.props;
    // TODO: Here, before updating local UI state, send contact objects collected in this.state.selected to server to send SMS invitations.
    let selectedDupe = Object.assign({}, this.state.selected);
    let numSelected = this.state.numSelected;
    let invitesDupe = Object.assign({}, this.state.invites);
    let numInvites = this.state.numInvites;
    let contactsDupe = Object.assign({}, this.state.contacts);
    const keysToChange = Object.keys(selectedDupe);
    keysToChange.forEach(key => {
      contactsDupe[key].selected = false;
      contactsDupe[key].invited = true;
      Object.assign(invitesDupe, { [key]: contactsDupe[key] });
      numInvites++;
    })
    numSelected = 0;
    await this.setState({
      contacts: contactsDupe,
      invites: invitesDupe,
      numInvites,
      numSelected,
      selected: {},
    });
    console.log('player: ', this.props);
    dispatch({type: c.SEND_INVITES, invites: this.state.invites, campId: this.props.campaign.id, playId: this.props.player.id});
    // here it ends

    this.props.navigation.navigate('CampaignStaging', {
      invites: this.state.invites,
    });
  }

  clearSelected = async () => {
    let contactsDupe = Object.assign({}, this.state.contacts);
    Object.keys(contactsDupe).forEach(key => {
      contactsDupe[key].selected = false;
    })
    let newNumSelected = 0;
    await this.setState({
      contacts: contactsDupe,
      numSelected: 0,
    });
  }

  abadonGame = async () => {
    console.log('Abandon Game');
  }

  submitConditionalRender = () => {
    if (this.state.numSelected > 0) {
      return (
        <TwoButtonOverlay
          button1title="Send Invites"
          button1onPress={this.sendInvites}
          button2title="Clear"
          button2onPress={this.clearSelected}
        />
      );
    } else if (this.state.numInvites > 0) {
      return (
        <TwoButtonOverlay
          button1title="Campaign Party"
          button1onPress={() => this.props.navigation.navigate('CampaignStaging', {
            invites: this.state.invites,
          })}
          button2title="Abandon Game"
          button2onPress={this.abandonGame}
        />
      )
    }
    else {
      return (
        <TwoButtonOverlay
          button1title="Send Invites"
          button1color="darkgray"
          button1onPress={() => console.log('No contacts selected for invitations.')}
          button2title="Back"
          button2onPress={() => this.props.navigation.goBack()}
        />
      );
    }
  }

  detailText = () => {
    return (
      <Text style={styles.detail}>
        Tap to select people you want to invite on your journey. Currently you've selected <Text style={{color: 'black', fontFamily: 'verdanaBold',}}>{this.state.numSelected} people.</Text>
      </Text>
    )
  }

  render() {
    return (
      <ImageBackground
        source={this.props.screenProps.backgroundImage}
        style={{width: '100%', height: '100%'}}
      >
        <View style={styles.container}>
          <View style={customStyles.contentContainer}>
            <View style={customStyles.headerContainer}>
              <View style={customStyles.headerFirst}>
                <View style={[customStyles.headerRow,]}>
                  <Text style={[styles.headline]}>Invite {"\n"}Players</Text>
                </View>
                <View style={customStyles.headerRow}>
                  <Text style={[styles.label]}>{this.props.campaign.length} </Text>
                  <Text style={[styles.label, {color: 'black'}]}>Days</Text>
                </View>
                <View style={customStyles.headerRow}>
                  <Text style={[styles.label]}>{this.props.campaign.difficultyLevel} </Text>
                  <Text style={[styles.label, {color: 'black'}]}>Difficulty Level</Text>
                </View>
                <View style={customStyles.headerRow}>
                  <Text style={[styles.label]}>{this.props.campaign.randomEvents} </Text>
                  <Text style={[styles.label, {color: 'black'}]}>In-game Events</Text>
                </View>
              </View>
              <View style={[customStyles.headerRowLast,]}>
                <View style={customStyles.headerRow}>
                  <View style={customStyles.plainTextContainer}>
                    {this.detailText()}
                  </View>
                </View>
              </View>
            </View>
            <View style={customStyles.contactsContainer}>
              <ScrollView showsVerticalScrollIndicator={true}>
                <ContactsList
                  contacts={this.state.contacts}
                  contactsFetched={this.state.contactsFetched}
                  onSelectContact={this.handleSelectContact}
                />
              </ScrollView>
            </View>
          </View>
          {this.submitConditionalRender()}
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create(defaultStyle);

const widthUnit = wp('1%');
const heightUnit = hp('1%');
const customStyles = StyleSheet.create({
  contentContainer: {
    width: '100%',
    height: '90%',
    paddingBottom: 10,
  },
  headerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    margin: 0,
    padding: 0,
  },
  headerRowFirst: {
    flex: 2,
    justifyContent: 'space-between',
  },
  headerRowLast: {
    flex: 1,
    position: 'absolute',
    bottom: heightUnit*2,
  },
  plainTextContainer: {

  },
  contactsContainer: {
    flex: 2,
    // width: '100%',
    // height: '100%',
    borderTopColor: 'white',
    borderBottomColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  scrollViewContainer: {
    width: '100%',
    height: '100%',
  },
});

function mapStateToProps(state) {
  return {
    campaign: state.campaign,
  }
}

export default connect(mapStateToProps)(InvitePlayers);
