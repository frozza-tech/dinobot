exports.iniciar = function(dinodb, mensagens, message){
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
}

exports.registrar = function(dinodb, usuario, mensagens, message){
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
}

exports.checar = function(dinodb, usuario, mensagens, message){
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
}

exports.spawnar = function(dinodb){
	dinodb.collection('servers').findOne({sid: 0}, function(err, server){
		if(err) throw err;
		if(server == null) return err;
		console.log("Rotina de spawn", '[' + Date.now() + ']');

		map = server.map;
		for(m in map){
			if(map[m].recurso.chao.length < 2){
				dinodb.collection('recursos').find({bioma: map[m].bioma, localidade: "chao"}).toArray(function(err, result){
					if(err) throw err;
					if(result.length==0) return;

					chao = result;
					random = ~~(Math.random()*chao.length);	
					// server.map[m].recurso.chao.push(chao[random]);
					novo = {};
					novo["map."+m+".recurso.chao"] = chao[random];
					dinodb.collection('servers').updateOne({sid: 0},{$push: novo},function(err, result){
						if(err) throw err;
					});
				});
			}
			if(map[m].recurso.agua.length < 2){
				dinodb.collection('recursos').find({bioma: map[m].bioma, localidade: "agua"}).toArray(function(err, result){
					if(err) throw err;
					if(result.length==0) return;

					agua = result;
					random = ~~(Math.random()*agua.length);	
					novo = {};
					novo["map."+m+".recurso.agua"] = agua[random];
					dinodb.collection('servers').updateOne({sid: 0},{$push: novo},function(err, result){
						if(err) throw err;
					});
				});
			}
			if(map[m].recurso.parede.length < 3){
				dinodb.collection('recursos').find({bioma: map[m].bioma, localidade: "parede"}).toArray(function(err, result){
					if(err) throw err;
					if(result.length==0) return;

					parede = result;
					random = ~~(Math.random()*parede.length);	
					novo = {};
					novo["map."+m+".recurso.parede"] = parede[random];
					dinodb.collection('servers').updateOne({sid: 0},{$push: novo},function(err, result){
						if(err) throw err;
					});
				});
			}
		}
		

		console.log("spawn finalizado", '[' + Date.now() + ']');
	});
}