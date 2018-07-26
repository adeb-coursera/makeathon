/*
COPYRIGHTS 2018 - AMORY SCHLENDER
*/

function getSlackOauthToken() {
  var properties = PropertiesService.getScriptProperties();
  return properties.getProperty('slack_token');
}

var _userData;
function getSlackUsersData() {
  if (!_userData) {
    Logger.log('Getting all users');
    var url = 'https://slack.com/api/users.list?token='+ getSlackOauthToken();
    var response = UrlFetchApp.fetch(url);
    var json = response.getContentText();
    var data = JSON.parse(json);
    _userData = data.members.map(function(d) {
      return {'name': d.name, 'email': d.profile.email, 'id': d.id};                 
    });
  }
  return _userData;
}

var _slackChannels;
function getSlackChannels() {
  if (!_slackChannels) {
    var url = 'https://slack.com/api/channels.list?token='+ getSlackOauthToken();
    var response = UrlFetchApp.fetch(url);
    var json = response.getContentText();
    var data = JSON.parse(json);  
    _slackChannels = data.channels.map(function(d) {
      return {'id': d.id, 'name': d.name}; 
    });
  }
  return _slackChannels;
}

function sendSlackMessageToUser(userId, message) {
  sendSlackMessageToChannel(createDirectIMChannel(userId), message);
}

function sendSlackMessageToChannel(channelId, message) {
  var url = 'https://slack.com/api/chat.postMessage?channel=' + channelId + '&text=' + encodeURI(message) + '&token=' + getSlackOauthToken();
  var response = UrlFetchApp.fetch(url);
  Logger.log(response);
}


function createDirectIMChannel(userId) {
  var url = 'https://slack.com/api/im.open?user=' + userId + '&token=' + getSlackOauthToken();
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);
  Logger.log(data);
  var channelId = data.channel.id;
  Logger.log(channelId);
  return channelId;
}

// TODO amory: get team listing from Google Groups instead so that this can stay in sync. 
function getTeams() {
  return [{
    "channel": "learner-red-pandas",
    "oneOnOneEmails": [
      "aschlender@coursera.org",
      "jn@coursera.org",
      "aahuja@coursera.org",
      "gschuller@coursera.org",
      "jkostiukova@coursera.org",
      "kchen@coursera.org",
      "ksun@coursera.org",
      "rbenkar@coursera.org",
      "sgogia@coursera.org",
      "wbowers@coursera.org",
      "billy@coursera.org",
      "cchen@coursera.org",
      "jkim@coursera.org",
      "ahickey@coursera.org",
      "mlazer@coursera.org",
      "stanleyfung@coursera.org",
      "pxu@coursera.org",
      "msingh@coursera.org"
    ],
    "lunchEmails": [
      "aschlender@coursera.org",
      "jn@coursera.org",
      "aahuja@coursera.org",
      "gschuller@coursera.org",
      "jkostiukova@coursera.org",
      "kchen@coursera.org",
      "ksun@coursera.org",
      "rbenkar@coursera.org",
      "sgogia@coursera.org",
      "wbowers@coursera.org",
      "billy@coursera.org",
      "cchen@coursera.org",
      "jkim@coursera.org",
      "mustafa@coursera.org",
      "stanleyfung@coursera.org",
      "pxu@coursera.org",
      "msingh@coursera.org"
    ]
  }]
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function sendOneOnOnesMessage(team) {
  var team_members = getSlackUsersData().filter(function(d) { return (team.oneOnOneEmails.indexOf(d.email) !== -1) });
  shuffleArray(team_members);
  var message = "This week's randomly selected 1:1 pairs are: \n"
  for(var i = 0; i < (team_members.length - 1) / 2; i++) {
     var left = team_members[2*i];
     var right = team_members[2*i + 1];
     message += "<@" + left.id + "> and " + "<@" + right.id + ">\n"
  }
  if (team_members.length % 2 == 1) {
    var leftover = team_members[team_members.length - 1]
    message += "<@" + leftover.id + "> gets the week off.\n" 
  }
  message += "See https://goo.gl/fVCKrT for suggestions of what to do during your one-on-one."

  getSlackChannels().forEach(function(channel) { 
    if (channel.name == team.channel) {
       sendSlackMessageToChannel(channel.id, message);
    }
  })
}

function sendLunchTeamsMessage(team, groupSize) {
  var team_members = getSlackUsersData().filter(function(d) { return (team.lunchEmails.indexOf(d.email) !== -1) });
  shuffleArray(team_members);
  var group_count = Math.round(team_members.length / groupSize);
  var message = "This week's randomly selected lunch groups are: \n";
  for(var i = 0; i < group_count; i++) {
    for(var j = i; j < team_members.length; j = j + group_count) {
      message += "<@" + team_members[j].id + "> ";
    }
    message += "\n\n";
  }
  message += "Feel free to coorindate with other groups, or not."

  getSlackChannels().forEach(function(channel) { 
    if (channel.name == team.channel) {
       sendSlackMessageToChannel(channel.id, message);
    }
  })
}

function notifyForOneOnOnes() {
  getTeams().forEach(sendOneOnOnesMessage)
}

function notifyForLunch() {
  getTeams().forEach(function(team){ sendLunchTeamsMessage(team, 4) })
}
