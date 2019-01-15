const auth = require('./auth.json');
const Discord = require("discord.js");
const client = new Discord.Client();
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
var dinoex = require('./dino-ex.js');
var bot = require('./bot.js');
var mensagens = require('./mensagens.js');
var dinodb;
var cronjob = require('cron').CronJob;

MongoClient.connect('mongodb://localhost:27017/admin',{ useNewUrlParser: true }, function(err, mongo){
	if (err) return console.log(err);
  	dinodb = mongo.db("admin"); // whatever your database name is
  	console.log("Mongo conectado");
  	bot.iniciarBot(client, auth, dinoex, dinodb, mensagens, cronjob);
});
