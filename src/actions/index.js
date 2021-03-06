import constants from "../constants";

const { c } = constants;

// this one might be ok, but it might need to be refactored for saga
export const setAppState = appState => ({
  type: c.NEW_APP_STATE,
  appState
});

export const setCampaignDates = (
  firstDayStart,
  firstDayEnd,
  length,
  difficultyLevel,
  stepGoalDayOne
) => {
  const dateArray = [];
  let start;
  let end;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    let aGoal;

    start = new Date(firstDayStart);
    end = new Date(firstDayEnd);
    if (i === 0) {
      aGoal = stepGoalDayOne;
    } else {
      aGoal = null;
    }
    const newDateObj = {
      day: i,
      start: new Date(start.setDate(start.getDate() + i)),
      end: new Date(end.setDate(end.getDate() + i)),
      steps: null,
      goal: aGoal,
      bonus: null,
      timesScavenged: 0,
      goalMet: false
    };
    dateArray.push(newDateObj);
  }
  return {
    type: c.SET_CAMPAIGN_DATES,
    campaignDateArray: dateArray
  };
};

// the goalMet data never seems to update to true, same with times scavenged
