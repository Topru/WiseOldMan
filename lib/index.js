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
var options = {
  host: 'crystalmathlabs.com',
  path: '/api.php'
};

// Load every command in the commands folder
fs.readdirSync('./lib/commands/').forEach(file => {
  app.addCommand(require('./commands/' + file));
});

bot.on('message', msg => {
  if (msg.content === 'ping') {
    // send pong to the same channel.
    msg.channel.sendMessage('pong');
  }
});

bot.login(cfg.token).then(() => {
  console.log('Running!');
  request('http://crystalmathlabs.com/tracker/api.php?type=track&player=Kukkakaali69', function(err,res,body){
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
          console.log(skillxp);
          skillxp.forEach(function(e, i){
            var xp = e.split(',');
            skills[Object.keys(skills)[i]].gained = xp[0];
            skills[Object.keys(skills)[i]].rankd = xp[1];
            skills[Object.keys(skills)[i]].total = xp[2];
            skills[Object.keys(skills)[i]].rank = xp[3];
          });
          console.log(skills);
      }
  });
  
});
