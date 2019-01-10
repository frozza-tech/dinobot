const auth = require('./auth.json');
const Discord = require("discord.js");
const client = new Discord.Client();
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
var dinodb;

MongoClient.connect('mongodb://localhost:27017/admin',{ useNewUrlParser: true }, function(err, client){
	if (err) return console.log(err);
  	dinodb = client.db("admin"); // whatever your database name is
  	console.log("teste");
  	iniciarBot();
});

function iniciarBot(){
	client.on("ready", () => {
	  	// This event will run if the bot starts, and logs in, successfully.
	  	console.log(`Bot iniciou, com ${client.users.size} usuários, em ${client.channels.size} canais de ${client.guilds.size} grupos.`); 
	  	// Example of changing the bot's playing game to something useful. `client.user` is what the
	  	// docs refer to as the "ClientUser".
	  	client.user.setActivity(`tempo fora`);
	  	try{
	    	var data = {
		        a:'teste',
		    }
		    var config = {
		        w: 'majority',
		        wtimeout: 10000,
		        serializeFunctions: true,
		        forceServerObjectId: true
		    };
	        dinodb.collection('teste').insertOne(data, config, (err, result) => {
				if (err) return console.log(err);

				console.log('salvo');
			});
	    }catch(err){
	    	console.log("não conseguiu salvar");
	    }
	});

	client.on("message", async message => {
	    if (message.content.substring(0, 1) == '$') {
	        var args = message.content.substring(1).split(' ');
	        var cmd = args[0];
	       
	        args = args.splice(1);
	        switch(cmd) {
	            case 'start':
	            	console.log("enviando mensagem");
	                message.channel.send({
	                    embed: {
	                        title: '**Dino Bot ainda em desenvolvimento**',
	                        color: 11534368,
	                        // description: '',
	                        fields: [{
						        name: "Seja Paciente",
						        value: "Estou aprendendo.",
						        inline: true
						      },
						      //   value: "Feito pesquisando no [masked links](http://google.com)."
						      {
						        name: "Jogo",
						        value: "Isso será um **jogo**",
						        inline: true
						      }
						    ]
	                    },
	                    content: ''
	                });
	                break;
	        }
	    }
	});

	client.login(auth.token);
}