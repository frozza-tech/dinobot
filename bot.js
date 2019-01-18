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
	            	dinoex.iniciar(dinodb, mensagens, message);

	            	break;
	            case 'registrar':
	            	dinoex.registrar(dinodb, usuario, mensagens, message);

	            	break;
	            case 'checar':
	            	try{
	            		dinoex.checar(dinodb, usuario, mensagens, message);
	            	}catch(err){
	            		console.log(err);
	            	}

	            	break;

	            case 'coletar':
	            	if(args.length > 0){
	            		dinoex.coletar(dinodb, usuario, args[0], mensagens, message);
	            	}else{
	            		mensagens.enviarGenerico(message, "Opa", "Você deve especificar o que pretende coletar!");
	            	}

	            	break;

	            case 'perfil':
	            	dinoex.perfil(dinodb, usuario, mensagens, message);
	            	
	            	break;
	        }
	    }
	});

	client.login(auth.token);

	new cronjob('*/20 * * * * *', function() {
		dinoex.spawnar(dinodb);
	}, null, true, 'America/Los_Angeles');
}