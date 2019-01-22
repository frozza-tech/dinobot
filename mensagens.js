exports.enviarIntro = function(message){
	message.channel.send({
        embed: {
            title: '**Dino Ex**',
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
};

exports.enviarRegistrado = function(message){
	message.channel.send({
        embed: {
            title: '**Dino Ex**',
            color: 11534368,
            // description: '',
            fields: [{
		        name: "Parabéns",
		        value: "Registrado com sucesso no server 0."
		      }
		    ]
        },
        content: ''
    });
};


exports.enviarGenerico = function(message, title, texto){
	message.channel.send({
        embed: {
            title: '**Dino Ex**',
            color: 11534368,
            // description: '',
            fields: [{
		        name: title,
		        value: texto
		      }
		    ]
        },
        content: ''
    });
};

exports.enviarChecagem = function(message, user, server, regiao, players, selvagens, recursos){
	message.channel.send({
        embed: {
            title: '**Dino Ex**',
            color: 11534368,
            // description: '',
            fields: [{
		        name: ":muscle: "+user.nome,
		        value: ":large_orange_diamond: Nível "+user.level+" ("+user.exp+"/"+user.next+")"
		      },
		      {
		        name: "Servidor",
		        value: server.ilha + " " +server.nome+ " " +(user.server+1)
		      }
		    ]
        },
        content: ''
    });

	fields = [];

	fields.push({
		name: 'Você está na posição '+user.map,
		value: '___'
	});

	for(i in selvagens){
		fields.push({
			name: selvagens[i].nome,
			value: selvagens[i].familia+" nv "+selvagens[i].level+"\nid:"+selvagens[i].id+selvagens[i].level,
			inline: true
		});
	}

	// tamed = regiao.tamed;
	// for(i in tamed){
	// 	fields.push({
	// 		name: tamed[i].nome+" do "+tamed[i].dono,
	// 		value: tamed[i].familia+" nv "+tamed[i].level,
	// 		inline: true
	// 	});
	// };

	for(i in players){
		if(user.did == players[i].did) continue;
		fields.push({
			name: players[i].nome,
			value: "Player nv "+players[i].level,
			inline: true
		});
	};

	for(i in recursos){
		fields.push({
			name: recursos[i].nome,
			value: "Quantidade: "+recursos[i].quantidade+"\nid: "+recursos[i].id,
			inline: true
		});
	};

	while(fields.length%3!=1){
		fields.push({
			name: "** **",
			value: "** **",
			inline: true
		});
	}

	fields.push({
		name: "Está perdido? Aqui estão alguns comandos (use $ajuda para saber mais)",
		value: "$perfil $checar $ver $coletar $atacar $mover"
	});


    message.channel.send({
    	embed: {
            title: 'Você está no bioma '+regiao.bioma,
            color: 11534368,
            // description: '',
            fields: fields
        },
        content: ''
    });
};

exports.enviarColeta = function(message, user, itens, exp){
    // console.log(itens);
    coletas = [];
    for(i in itens){
        coletas.push(itens[i].quantidade+" "+itens[i].nome+(itens[i].quantidade>1&&itens[i].nome.substr(-1).match(/(a|e|o)/)?"s":""));
    }
    if(coletas.length>1) last = " e "+coletas.pop();
    else last = "";
	message.channel.send({
        embed: {
            title: '**Dino Ex**',
            color: 11534368,
            // description: '',
            fields: [{
		        name: ":muscle: "+user.nome,
		        value: ":large_orange_diamond: Nível "+user.level+" ("+user.exp+"/"+user.next+")"
		      },{
            	name: "Você coletou "+coletas.join(', ')+last,
            	value: "E recebeu "+exp+" de xp"
            }]
        },
        content: ''
    });
};

exports.enviarFerramentas = function(message, tools, recurso){
    fields = [];

    for(t in tools){
        fields.push({
            name: tools[t].nome,
            value: "id: "+tools[t].id,
            inline: true
        })
    }

    message.channel.send({
        embed: {
            title: 'Digite: $coletar '+recurso.id+' (id) para coletar esse recurso',
            color: 11534368,
            // description: '',
            fields: fields
        },
        content: ''
    });
};

exports.enviarInfoCriar = function(message, user, itens, mochila){
    // console.log(mochila);
    fields = [];
    for(i in itens){
        mats = [];
        custo = itens[i].custo;
        first = true;
        mats.push("id: "+itens[i].id);
        for(c in custo){
            mats.push("("+(mochila[c]?mochila[c]:0)+"/"+custo[c]+") "+c);
        }
        fields.push({
            name: itens[i].nome,
            value: mats.join('\n'),
            inline: true
        });
    }

    message.channel.send({
        embed: {
            title: 'Digite: $criar (id) para criar o item que você quer',
            color: 11534368,
            // description: '',
            fields: fields
        },
        content: ''
    });
};

exports.enviarFaltaCriar = function(message, falta){
    message.channel.send({
        embed: {
            title: '**Dino Ex**',
            color: 11534368,
            // description: '',
            fields: [{
                name: 'Faltam recursos para criar o item',
                value: falta.join('\n')
            }]
        },
        content: ''
    });
};

exports.enviarCriado = function(message, item, exp){
    message.channel.send({
        embed: {
            title: '**Dino Ex**',
            color: 11534368,
            // description: '',
            fields: [{
                name: 'Parabéns',
                value: 'Você criou o item '+item.nome+" e ganhou "+exp+" de xp"
            }]
        },
        content: ''
    });
};

exports.enviarPerfil = function(message, user, server, itens){
	fields = [{
        name: ":muscle: "+user.nome,
        value: ":large_orange_diamond: Nível "+user.level+" ("+user.exp+"/"+user.next+")"
      },
      {
	        name: "Servidor",
	        value: server.ilha + " " +server.nome+ " " +(user.server+1)
      	},{
	      	name: "Força",
	      	value: user.dano,
	      	inline: true
      	},{
	      	name: "Vida",
	      	value: user.vida+"/"+user.vidamax,
	      	inline: true
      	},{
	      	name: "Energia",
	      	value: user.energia+"/"+user.energiamax,
	      	inline: true
      	},{
	      	name: "Fome",
	      	value: user.fome+"/"+user.fomemax,
	      	inline: true
      	},{
      		name: "Velocidade",
      		value: user.velocidade,
      		inline: true
      	},{
      		name: "** **",
      		value: '** **',
      		inline: true
      	}
    ];
    if(user.pontos>0){
    	fields.push({
    		name: "Você tem "+user.pontos+" ponto"+(user.pontos>1?"s":"")+" de atributo para gastar",
    		value: "Use o comando $atribuir (quantidade) (atributo)"
    	});
    }
	message.channel.send({
        embed: {
            title: '**Dino Ex ainda em desenvolvimento**',
            color: 11534368,
            // description: '',
            fields: fields
        },
        content: ''
    });

    fields = [];

    fields.push({
    	name: "Inventário: ",
    	value: "_______________"
    });

    for(i in itens){
    	fields.push({
    		name: (itens[i].tipo == 'recurso'?itens[i].quantidade+"x ":"")+itens[i].nome+(itens[i].quantidade>1&&itens[i].nome.substr(-1).match(/(a|e|o)/)?"s":""),
    		value: "** **"
    	});
    }

    if(itens.length == 0){
    	fields.push({
    		name: "Seu inventário está vazio",
    		value: "Vá coletar algo"
    	});
    }

    message.channel.send({
    	embed: {
            title: "** **",
            color: 11534368,
            // description: '',
            fields: fields
        },
        content: ''
    });
};