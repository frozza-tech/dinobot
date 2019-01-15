exports.iniciarBot = function(client, auth, dinoex, dinodb, mensagens, cronjob){
	var config = {
        w: 'majority',
        wtimeout: 10000,
        serializeFunctions: true,
        forceServerObjectId: true
    };

	client.on("ready", () => {
	  	// This event will run if the bot starts, and logs in, successfully.
	  	console.log(`Bot iniciou, com ${client.users.size} usuários, em ${client.channels.size} canais de ${client.guilds.size} grupos.`); 
	  	// Example of changing the bot's playing game to something useful. `client.user` is what the
	  	// docs refer to as the "ClientUser".
	  	client.user.setActivity('você', {type: "WATCHING"});
	});

	client.on("message", async message => {
	    if (message.content.substring(0, 1) == '$') {
	        var args = message.content.substring(1).split(' ');
	        var cmd = args[0];
	        var usuario = message.author;
	       
	        args = args.splice(1);
	        switch(cmd) {
	            case 'intro':
	            	console.log("enviando mensagem");
	                mensagens.enviarIntro(message);

	                break;
	            case 'iniciar':
	            	console.log("Jogador querendo começar");
	            	dinodb.collection('users').findOne({did: usuario.id}, function(err, result){
	            		// console.log(result);
	            		if(!result.map){
	            			mensagens.enviarGenerico(message,"Bem vindo ao server","Você começará na posição a1");
	            			mensagens.enviarGenerico(message,"Comece o jogo","Use o comando *checar* para ver seu estado atual");
	            			query = {did: usuario.id};
	            			novo = { $set: {map: "a1"}};
	            			dinodb.collection('users').updateOne(query, novo, function(err, result){
	            				if(err) throw err;
	            				console.log("Jogador alocado no mapa");
	            			});
	            			query = {sid: 0};
							novo = {$push: { 
								"map.a1.player": {nome: result.nome, level: result.level, did: result.did } } 
							};
							dinodb.collection('servers').updateOne(query, novo, function(err, result){
								if(err) throw err;
								console.log(result);
								console.log('salvo');
							});
	            		}else{
	            			mensagens.enviarGenerico(message,"Você já começou","Use o comando *checar* para ver seu estado atual");
	            		}
	            	});

	            	break;
	            case 'registrar':
	            	dinodb.collection('users').find({did: usuario.id}).toArray(function(err, result){
						if(err) throw err;

						if(result.length == 0){
			            	try{
						    	var data = {
							        nome:usuario.username,
							        did: usuario.id,
							        level: 1,
							        server: 0,
							        exp: 0
							    }
							    
								dinodb.collection('users').insertOne(data, config, (err, result) => {
									if (err) return err;

									mensagens.enviarGenerico(message, "Parabéns", "Registrado com sucesso no Servidor The Island Official!");
								});
						    }catch(err){
						    	console.log("não conseguiu salvar");
						    }
						}else{
							mensagens.enviarGenerico(message,"Calma aí","Você já está registrado");
						}
					});

	            	break;
	            case 'checar':
	            	dinodb.collection('users').findOne({did: usuario.id}, function(err, user){
	            		if(err) throw err;
	            		if(user == null) return err;
	            		console.log(user);
	            		if(!user.map){
	            			mensagens.enviarGenerico(message,"Calma","Você deve iniciar seu personagem com o comando *iniciar*");
	            			return;
	            		}

	            		dinodb.collection('servers').findOne({sid: 0}, function(err, server){
	            			if(err) throw err;
	            			if(server == null) return err;
	            			console.log(server);

	            			mensagens.enviarChecagem(message, user, server);
	            		});
	            	});
	            	break;
	        }
	    }
	});

	client.login(auth.token);

	new cronjob('* * * * * *', function() {
		dinodb.collection('servers').findOne({sid: 0}, function(err, server){
			if(err) throw err;
			if(server == null) return err;
			console.log("Rotina de spawn");

			map = server.map;
			for(m in map){
				if(map[m].recurso.chao.length < 2){
					chao = dinoex.data.recursos[map[m].bioma].chao;
					arres = Object.keys(chao);
					random = ~~(Math.random()*arres.length);
					server.map[m].recurso.chao.push(chao[arres[random]]);
				}
				if(map[m].recurso.agua.length < 2){
					agua = dinoex.data.recursos[map[m].bioma].agua;
					arres = Object.keys(agua);
					random = ~~(Math.random()*arres.length);
					server.map[m].recurso.agua.push(agua[arres[random]]);
				}
				if(map[m].recurso.parede.length < 3){
					parede = dinoex.data.recursos[map[m].bioma].parede;
					arres = Object.keys(parede);
					random = ~~(Math.random()*arres.length);
					server.map[m].recurso.parede.push(parede[arres[random]]);
				}
			}
		});
	}, null, true, 'America/Los_Angeles');
}