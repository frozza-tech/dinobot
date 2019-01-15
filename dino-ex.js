exports.data = {
	users: {},
	servers: {},
	recursos: {}
}

exports.iniciar = function(dinodb){
	
	try{

		dinodb.collection('users').find({}).toArray(function(err, result){
			if(err) throw err;
			exports.data.users = result;
			// console.log(result);
		});

		dinodb.collection('servers').find({}).toArray(function(err, result){
			if(err) throw err;
			exports.data.servers = result;
			// console.log(result);
		});

		dinodb.collection('recursos').find({}).toArray(function(err, result){
			if(err) throw err;
			exports.data.recursos = result;
			// console.log(result);
		});

	}catch(err){
		console.log(err);
	}
}