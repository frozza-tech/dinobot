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

exports.enviarChecagem = function(message, user, server){
	message.channel.send({
        embed: {
            title: '**Dino Ex ainda em desenvolvimento**',
            color: 11534368,
            // description: '',
            fields: [{
		        name: ":muscle: "+user.nome,
		        value: ":large_orange_diamond: Nível "+user.level
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
		value: '__'
	});

	wild = server.map[user.map].wild;
	for(i in wild){
		fields.push({
			name: wild[i].nome,
			value: "Nível: "+wild[i].level,
			inline: true
		});
	}

	tamed = server.map[user.map].tamed;
	for(i in tamed){
		fields.push({
			name: tamed[i].nome+" do "+tamed[i].dono,
			value: "Nível: "+tamed[i].level,
			inline: true
		});
	};

	players = server.map[user.map].player;
	for(i in players){
		if(user.did == players[i].did) continue;
		fields.push({
			name: "(P) "+players[i].nome,
			value: "Nível "+players[i].level,
			inline: true
		});
	};

	chao = server.map[user.map].recurso.chao;
	for(i in chao){
		fields.push({
			name: chao[i].nome,
			value: "digite -coletar chao "+i,
			inline: true
		});
	};

	agua = server.map[user.map].recurso.agua;
	for(i in agua){
		fields.push({
			name: agua[i].nome,
			value: "digite -coletar agua "+i,
			inline: true
		});
	};

	parede = server.map[user.map].recurso.parede;
	for(i in parede){
		fields.push({
			name: parede[i].nome,
			value: "digite -coletar objeto "+i,
			inline: true
		});
	};

    message.channel.send({
    	embed: {
            title: 'Você está no bioma '+server.map[user.map].bioma,
            color: 11534368,
            // description: '',
            fields: fields
        },
        content: ''
    });
};