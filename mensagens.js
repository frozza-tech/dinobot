exports.enviarIntro = function(message){
	message.channel.send({
        embed: {
            title: '**Dino Ex ainda em desenvolvimento**',
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
            title: '**Dino Ex ainda em desenvolvimento**',
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
            title: '**Dino Ex ainda em desenvolvimento**',
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
            title: '**Dino Ex ainda em desenvolvimento**',
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
			value: selvagens[i].familia+" nv "+selvagens[i].level+"\ndigite $atacar "+selvagens[i].id+selvagens[i].level,
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
			value: "digite $coletar "+recursos[i].id,
			inline: true
		});
	};

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

exports.enviarColeta = function(message, user, recurso){
	message.channel.send({
        embed: {
            title: '**Dino Ex ainda em desenvolvimento**',
            color: 11534368,
            // description: '',
            fields: [{
		        name: ":muscle: "+user.nome,
		        value: ":large_orange_diamond: Nível "+user.level+" ("+user.exp+"/"+user.next+")"
		      }
		    ]
        },
        content: ''
    });

    message.channel.send({
    	embed: {
            title: '',
            color: 11534368,
            // description: '',
            fields: [{
            	name: "Você coletou "+recurso.quantidade+" "+recurso.tipo,
            	value: "Você recebeu "+~~(recurso.quantidade/5)+" de xp"
            }]
        },
        content: ''
    });
};