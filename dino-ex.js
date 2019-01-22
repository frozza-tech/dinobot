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
				// console.log(result);
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
		console.log(user.nome, "está fazendo checagem");
		if(!user.map){
			mensagens.enviarGenerico(message,"Calma","Você deve iniciar seu personagem com o comando *iniciar*");
			return;
		}

		dinodb.collection('servers').findOne({sid: 0}, function(err, server){
			if(err) throw err;
			if(server == null) return err;
			// console.log(server);

			dinodb.collection('regioes').findOne({sid: 0, rid: user.map}, function(err, regiao){
				dinodb.collection('players').find({sid: 0, map: user.map}).toArray(function(err, players){
					dinodb.collection('selvagens').find({sid: 0, rid: user.map}).toArray(function(err, selvagens){
						dinodb.collection('recursos_regiao').find({sid: 0, rid: user.map}).toArray(function(err, recursos){
							mensagens.enviarChecagem(message, user, server, regiao, players, selvagens, recursos);
						});
					});
				})
			});
		});
	});
}

exports.spawnar = function(dinodb){
	dinodb.collection('regioes').find({sid: 0}).forEach(function(regiao){
		// if(err) throw err;
		if(regiao == null) return err;
		console.log("Rotina de spawn "+regiao.rid, '[' + Date.now() + ']');

		dinodb.collection('recursos_regiao').countDocuments({rid: regiao.rid, localidade: "chao"}, function(err, qtd){
			if(err) throw err;
			if(qtd<2){
				dinodb.collection('recursos').find({bioma: regiao.bioma, localidade: "chao"}).toArray(function(err, result){
					if(err) throw err;
					if(result.length==0) return;

					chao = result;
					random = ~~(Math.random()*chao.length);	
					// server.regiao.recurso.chao.push(chao[random]);
					novo = chao[random];
					novo.sid = 0;
					novo.rid = regiao.rid;
					delete novo._id;
					dinodb.collection('recursos_regiao').insertOne(novo,function(err, result){
						if(err) throw err;
					});
				});
			}
		});

		dinodb.collection('recursos_regiao').countDocuments({rid: regiao.rid, localidade: "agua"}, function(err, qtd){
			if(err) throw err;
			if(qtd<2){
				dinodb.collection('recursos').find({bioma: regiao.bioma, localidade: "agua"}).toArray(function(err, result){
					if(err) throw err;
					if(result.length==0) return;

					agua = result;
					random = ~~(Math.random()*agua.length);	
					// server.regiao.recurso.agua.push(agua[random]);
					novo = agua[random];
					novo.sid = 0;
					novo.rid = regiao.rid;
					delete novo._id;
					dinodb.collection('recursos_regiao').insertOne(novo,function(err, result){
						if(err) throw err;
					});
				});
			}
		});

		dinodb.collection('recursos_regiao').countDocuments({rid: regiao.rid, localidade: "parede"}, function(err, qtd){
			if(err) throw err;
			if(qtd<2){
				dinodb.collection('recursos').find({bioma: regiao.bioma, localidade: "parede"}).toArray(function(err, result){
					if(err) throw err;
					if(result.length==0) return;

					parede = result;
					random = ~~(Math.random()*parede.length);	
					// server.regiao.recurso.parede.push(parede[random]);
					novo = parede[random];
					novo.sid = 0;
					novo.rid = regiao.rid;
					delete novo._id;
					dinodb.collection('recursos_regiao').insertOne(novo,function(err, result){
						if(err) throw err;
					});
				});
			}
		});

		dinodb.collection('selvagens').countDocuments({rid: regiao.rid}, function(err, qtd){
			if(err) throw err;
			if(qtd<4){
				dinodb.collection('dinos').find({bioma: regiao.bioma}).toArray(function(err, result){
					if(err) throw err;
					if(result.length==0) return;

					dino = result;
					random = ~~(Math.random()*dino.length);	
					novo = {};
					dino[random].level = ~~(Math.random()*regiao.maxlevel);
					dino[random].dano+=~~(dino[random].dano*0.02*dino[random].level);
					dino[random].vida+=~~(dino[random].vida*0.03*dino[random].level);
					dino[random].energia+=~~(dino[random].energia*0.03*dino[random].level);
					dino[random].fome+=~~(dino[random].fome*0.03*dino[random].level);
					dino[random].topor+=~~(dino[random].topor*0.02*dino[random].level);
					dino[random].velocidade+=~~(dino[random].velocidade*0.02*dino[random].level);
					novo = dino[random];
					novo.sid = 0;
					novo.rid = regiao.rid;
					delete novo._id;
					dinodb.collection('selvagens').insertOne(novo,function(err, result){
						if(err) throw err;
					});
				});
			}
		});

		console.log("spawn finalizado", '[' + Date.now() + ']');
	});
};

exports.coletar = function(dinodb, usuario, recurso, mensagens, message){
	console.log(usuario.username, "tentando coletar recurso com id "+recurso);

	dinodb.collection('users').findOne({did: usuario.id}, function(err, user){
		if(err) throw err;
		if(user == null) return err;
		if(!user.map){
			mensagens.enviarGenerico(message,"Calma","Você deve iniciar seu personagem com o comando *iniciar*");
			return;
		}

		query = {sid: 0, rid: user.map, id: recurso};
		dinodb.collection('recursos_regiao').findOne(query, function(err, recurso){
			if(err) throw err;
			if(recurso == null){
				mensagens.enviarGenerico(message, "Opa", "O id de recurso não está presente na sua região");
			} else {
				if(recurso.tool){
					mensagens.enviarGenerico(message, "Opa", "Você não tem a ferramenta correta");
					return;
				}else{
					item = {
						quantidade: recurso.quantidade,
						id: recurso.tipo,
						dono: user.did,
						nome: recurso.material
					};
				}
			// console.log(server);
				dinodb.collection('recursos_regiao').deleteOne(query, function(err, obj){
					if(obj.result.n>0){
						console.log(user.nome, "removeu "+recurso.nome+" do "+recurso.rid);	
					}else{
						console.log("não removeu recurso do banco");
					}

					dinodb.collection('pertences').countDocuments({id: recurso.tipo, dono: user.did}, function(err, qtd){
						if(qtd == 0){
							dinodb.collection('pertences').insertOne(item, function(err, res){

							});
						}else{
							q = {id: recurso.tipo, dono: user.did};
							novo = {$inc: {quantidade: recurso.quantidade}};
							dinodb.collection('pertences').updateOne(q,novo, function(err, res){

							});
						}
						user = exports.aumentarExp(dinodb, user, ~~(recurso.quantidade/5), mensagens, message);
						dinodb.collection('users').updateOne({did: user.did}, {$set: user}, function(err, res){
							mensagens.enviarColeta(message, user, recurso);
						});
					});
				});
			}
		});
	});
};

exports.perfil = function(dinodb, usuario, mensagens, message){
	dinodb.collection('users').findOne({did: usuario.id}, function(err, user){
		dinodb.collection('pertences').find({dono: usuario.id}).toArray(function(err, itens){
			dinodb.collection('servers').findOne({sid: user.server}, function(err, server){
				mensagens.enviarPerfil(message, user, server, itens);
			});
		});
	});
};

exports.atribuir = function(dinodb, usuario, qtd, atributo, mensagens, message){
	dinodb.collection('users').findOne({did: usuario.id}, function(err, user){
		dinodb.collection('servers').findOne({sid: user.server}, function(err, server){
			if(qtd>user.pontos){
				mensagens.enviarGenerico(message, "Opa","Você só possui "+user.pontos);
			}else{
				up = (atributo=='velocidade'||atributo=='dano'?2:10);
				user[atributo]+=up;
				user.pontos-=qtd;
				query = {did: usuario.id};
				dinodb.collection('users').updateOne(query,{$set: user},function(err, result){
					mensagens.enviarGenerico(message, "Parabéns", "Você aumentou "+up+" de "+atributo);
				});
			}
		});
	});
};

exports.aumentarExp = function(dinodb, user, exp, mensagens, message){
	user.exp += exp;
	if(user.exp>=user.next){
		user.exp-=user.next;
		user.next=user.next+(5*Math.pow(user.level,2));
		user.level+=1;
		user.pontos+=1;
		console.log(user.nome+" upou para o nível "+user.level);
		mensagens.enviarGenerico(message, "Parabéns!","Você upou para o nível "+user.level);
	}
	return user;
};