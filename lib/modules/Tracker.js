const request = require('request');

module.exports = function Tracker() {
	this.requestTrack = function(msg, callback){
      var message = msg.content.split("@");
      var time = message[1];
      var cmdAndName = message[0].split(" ");
      var cmd = cmdAndName.splice(0, 1);
      var name = "";
      
      cmdAndName.forEach(function(e, i){
        if(i == 0) {
            name = e;
        } else {
            name += " " + e;
        }
      });
      
      console.log(name);
      if(name == null) {
          callback("Usage: !track [username] @[time]");
          return;
      }
      if(time == null) {
          time = "7d";
      }
      request('https://crystalmathlabs.com/tracker/api.php?type=update&player=' + name, function(err,res,body){
          if(!err && res.statusCode == 200) {
            request('http://crystalmathlabs.com/tracker/api.php?type=track&player=' + name + '&time=' + time, function(err,res,body){
              if (!err && res.statusCode == 200) {
                parseTrack(body);
              }
              else {
                  callback("API is unavailable");
              }
            });
          }
          else {
            callback("API is unavailable");
          }
	  });
	  var parseTrack = function(body){
        if(body == -1) {
            callback("Player not found");
            return;
        }
        var skills = {
              overall : {gained: null, rankd: null, total: null, rank: null},
              att : {gained: null, rankd: null, total: null, rank: null},
              def : {gained: null, rankd: null, total: null, rank: null},
              str : {gained: null, rankd: null, total: null, rank: null},
              hp : {gained: null, rankd: null, total: null, rank: null},
              range : {gained: null, rankd: null, total: null, rank: null},
              pray : {gained: null, rankd: null, total: null, rank: null},
              mage : {gained: null, rankd: null, total: null, rank: null},
              cook : {gained: null, rankd: null, total: null, rank: null},
              wc : {gained: null, rankd: null, total: null, rank: null},
              fletch : {gained: null, rankd: null, total: null, rank: null},
              fish : {gained: null, rankd: null, total: null, rank: null},
              fm : {gained: null, rankd: null, total: null, rank: null},
              craft : {gained: null, rankd: null, total: null, rank: null},
              smith : {gained: null, rankd: null, total: null, rank: null},
              mine : {gained: null, rankd: null, total: null, rank: null},
              herb : {gained: null, rankd: null, total: null, rank: null},
              agi : {gained: null, rankd: null, total: null, rank: null},
              thiev : {gained: null, rankd: null, total: null, rank: null},
              slay : {gained: null, rankd: null, total: null, rank: null},
              farm : {gained: null, rankd: null, total: null, rank: null},
              rc : {gained: null, rankd: null, total: null, rank: null},
              hunt : {gained: null, rankd: null, total: null, rank: null},
              cons : {gained: null, rankd: null, total: null, rank: null}
            };
        var results = body.split('\n');
        var skillxp = results.splice(1, results.length-2);
        var i = 0;
        skillxp.forEach(function(e){
          var xp = e.split(',');
          if(xp[0]>0){
            skills[Object.keys(skills)[i]].gained = xp[0];
            skills[Object.keys(skills)[i]].rankd = xp[1];
            skills[Object.keys(skills)[i]].total = xp[2];
            skills[Object.keys(skills)[i]].rank = xp[3];
          }
          else{
            delete skills[Object.keys(skills)[i]];
            i--;
          }
          i++;
        });
        var message = "XP Gained by " + name + ":\n";
        Object.keys(skills).forEach(function(key){
            message += key + ": " + skills[key].gained + "\n";
        });
        callback(message);
	  }
	}
}