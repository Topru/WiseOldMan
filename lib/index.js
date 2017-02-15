'use strict';

const fs      = require('fs');
const Clapp   = require('./modules/clapp-discord');
const cfg     = require('../config.js');
const pkg     = require('../package.json');
const Discord = require('discord.js');
const bot     = new Discord.Client();
const request = require('request');

var app = new Clapp.App({
  name: cfg.name,
  desc: pkg.description,
  prefix: cfg.prefix,
  version: pkg.version,
  onReply: (msg, context) => {
    // Fired when input is needed to be shown to the user.

    context.msg.reply('\n' + msg).then(bot_response => {
      if (cfg.deleteAfterReply.enabled) {
        context.msg.delete(cfg.deleteAfterReply.time)
          .then(msg => console.log(`Deleted message from ${msg.author}`))
          .catch(console.log);
        bot_response.delete(cfg.deleteAfterReply.time)
          .then(msg => console.log(`Deleted message from ${msg.author}`))
          .catch(console.log);
      }
    });
  }
});

// Load every command in the commands folder
fs.readdirSync('./lib/commands/').forEach(file => {
  app.addCommand(require('./commands/' + file));
});

bot.on('message', msg => {
  if (msg.content.startsWith(".track") || msg.content.startsWith("!track")) {
	var message = msg.content.split(" ");
	var tracked = message[1];
	var time = message[2];
	if(time == null) {
		time = "7d";
	}
	if(tracked == null) {
		msg.channel.sendMessage("Usage: !track [username] [time]");
	} else {
		requestTrack(tracked, time, function(result){
			msg.channel.sendMessage(result);
		})
	}
  }
});

bot.login(cfg.token).then(() => {
  console.log('Running!');
});

function requestTrack(name, time, callback){
	  request('https://crystalmathlabs.com/tracker/api.php?type=update&player=' + name, function(err,res,body){
      if(!err && res.statusCode == 200) {
        request('http://crystalmathlabs.com/tracker/api.php?type=track&player=' + name + '&time=' + time, function(err,res,body){
          if (!err && res.statusCode == 200) {
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
        });
      }
  });
}
