'use strict';

const fs      = require('fs');
const Clapp   = require('./modules/clapp-discord');
const cfg     = require('../config.js');
const pkg     = require('../package.json');
const Discord = require('discord.js');
const bot     = new Discord.Client();
const request = require('request');
const Tracker = require('./modules/Tracker.js');
const tracker = new Tracker();
const Parser = require('./modules/ParseMessage.js');
const parser = new Parser();
const Stats = require('./modules/Stats.js');
const stats = new Stats();


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

bot.on('message', msg => {
  parser.parseCommand(msg.content, function(cmd){
      if(cmd == "track") {
        tracker.requestTrack(msg, function(result){
          msg.channel.sendMessage(result);
        })
      } else if(cmd == "stats") {
        stats.requestStats(msg, function(result){
          msg.channel.sendMessage(result);
        }) 
      }
  });
  
  
});

bot.login(cfg.token).then(() => {
  console.log('Running!');
});

