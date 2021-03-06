import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import constants from "../../constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import defaultStyle from "../../styles/defaultStyle";
import SingleButtonFullWidth from "../ui/SingleButtonFullWidth";
import { MainText } from "../text";
import ScreenContainer from "../containers/ScreenContainer";
import CampaignHeader from "../ui/CampaignHeader";

const { c } = constants;
const victory_bg = require("../../../assets/victory_bg.png");

class CampaignIsWon extends React.Component {
  constructor(props) {
    super(props);
    const { finalCampaignState } = this.props.navigation.getParam("data");
    this.getFinalStats(finalCampaignState);
    this.state = { finalCampaignState };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: c.DESTROY_CAMPAIGN,
      campId: this.state.finalCampaignState.id
    });
  }

  getFinalStats = finalCampaignState => {
    let total = 0;
    finalCampaignState.players.forEach(player => {
      const steps = player.steps.reduce((acc, stepQty) => {
        return acc + stepQty;
      });
      total += steps;
    });
    this.totalSteps = total;
    console.log("TOTAL STEPS", this.totalSteps);
  };

  render() {
    return (
      <ImageBackground
        source={victory_bg}
        style={customStyles.bgImage}
        resizeMode="cover"
      >
        <View
          style={[
            { backgroundColor: "rgba(0,0,0,0.5)" },
            { width: "100%" },
            { height: "100%" }
          ]}
        >
          <ScreenContainer style={{ padding: widthUnit * 3 }}>
            <CampaignHeader
              lineHeight="squish"
              campaign={this.state.finalCampaignState}
              title={"Military\nCheck\nPoint"}
            />

            <View style={customStyles.contentContainer}>
              <MainText style={customStyles.mainText}>
                After {this.totalSteps} total steps, you&apos;ve finally made it
                to the military zone! {"\n \n"}While the military check point is
                protected, it is not completely safe. As you go over the routes
                with the captain, you cast your eyes towards the mountains in
                the distance. &quot;Not much further now,&quot; you think to
                yourself, &quot;we&apos;ll finally reunite at the safe
                haven.&quot;
              </MainText>
            </View>
            <View style={customStyles.buttonContainer}>
              <SingleButtonFullWidth
                title="Start Another Journey"
                backgroundColor="darkred"
                onButtonPress={() =>
                  this.props.navigation.navigate("MainAppRouter")
                }
              />
            </View>
          </ScreenContainer>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create(defaultStyle);
const widthUnit = wp("1%");
const heightUnit = hp("1%");
const customStyles = StyleSheet.create({
  contentContainer: {
    flex: 3,
    width: "100%",
    marginTop: heightUnit * 2.5,
    marginBottom: heightUnit * 2.5
  },
  buttonContainer: {
    width: "100%",
    height: heightUnit * 10,
    alignItems: "center",
    justifyContent: "center"
  },
  bgImage: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "flex-start"
  },
  mainText: {
    lineHeight: widthUnit * 6.5
  }
});

function mapStateToProps(state) {
  return {
    campaign: state.campaign,
    player: state.player
  };
}

export default connect(mapStateToProps)(CampaignIsWon);
