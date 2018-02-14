/*jshint esversion: 6 */

var app = require('http').createServer();



var io = require('socket.io')(app);

var SuecaGame = require('./gamemodel.js');
var GameList = require('./gamelist.js');
var axios = require('axios');
var querystring = require('querystring');

axios.defaults.baseURL = 'http://sueca.org/';
axios.defaults.headers.common['Content-type'] = "application/json";

app.listen(8080, function () {
	console.log('listening on *:8080');
});

// ------------------------
// Estrutura dados - server
// ------------------------

let games = new GameList();


io.on('connection', function (socket) {
	console.log('client has connected');

	socket.on('create_game', function (data) {

		/* 	axios.defaults.baseURL = 'http://sueca.org/';
			axios.defaults.headers.common['Content-type'] = "application/json"; */

		axios.post("api/games", {
				player1: data.playerID,
				type: "multiplayer"
			}, {
				headers: {
					'Content-Type': 'application/json',
				}
			})
			.then(response => {

				if (response.status === 201) {
					console.log("Game Commited to Databese");
					//console.log(response);

					let game = games.createGame(response.data.id, data.playerID, data.playerName, socket.id, data.avatar);
					socket.join(game.gameID);
					// Notifications to the client
					socket.emit('my_active_games_changed');
					io.emit('lobby_changed');
					//console.log(response);
				}
			}).catch(error => {
				console.log("Game NOT commited to database");
				//console.log(error);
			});
	});

	socket.on('start_game', function (data) {
		let game = games.startGame(data.gameID);

		/* axios.defaults.baseURL = 'http://sueca.org/';
		axios.defaults.headers.common['Content-type'] = "application/json"; */
		//console.log(data.gameID); 

		axios.patch('api/games/' + data.gameID + '/join-start', {
				player2: game.players[1].playerID,
				player3: game.players[2].playerID,
				player4: game.players[3].playerID
			}, {
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				}
			}).then(response => {
				console.log("Game saved");
				io.to(game.gameID).emit('game_started');
				io.to(game.gameID).emit('my_active_games_changed');
			})
			.catch(error => {
				console.log("Game NOT saved");
				console.log(error);
			})

		/* 	io.to(game.gameID).emit('game_started');
			io.to(game.gameID).emit('my_active_games_changed'); */
	});

	socket.on('join_game', function (data) {
		let game = games.joinGame(data.gameID, data.playerID, data.playerName, socket.id, data.avatar);
		if (game) {
			socket.join(game.gameID);
			io.to(game.gameID).emit('my_active_games_changed');
			io.emit('lobby_changed');
		}

	});

	socket.on('remove_game', function (data) {
		let game = games.removeGame(data.gameID, socket.id);
		socket.emit('my_active_games_changed');
	});

	socket.on('renuncia', function (data) {
		let game = games.startGame(data.gameID);
		io.to(game.gameID).emit('verifying_Renuncia', "A verificar Renuncia");
		var renuncia = game.confirmRenuncia(data.playerID);
		if (renuncia) {
			io.to(game.gameID).emit('renuncia', "Renuncia Verificada");

		} else {
			io.to(game.gameID).emit('not_renuncia', "Renuncia NÃO Verificada");
		}
		io.to(game.gameID).emit('game_changed', game);
	});

	socket.on('play', function (data) {
		console.log("PlayerID on gameserver.js " + data.playerID);
		let game = games.gameByID(data.gameID);
		if (game.play(data.playerID, data.index)) {
			io.to(game.gameID).emit('game_changed', game);

			if (game.cardsOnTable == 4) {
				var timer = setTimeout(function () {
					game.finishRound();
					io.to(game.gameID).emit('game_changed', game);
				}, 2000, game);

			}
			if (game.gameEnded) {
				axios.patch('api/games/'+ data.gameID +'/endgame/'+game.winnerTeam+'/join-start', {
						
					}, {
						headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json',
						}
					}).then(response => {
						console.log("Game saved Game Over");
					})
					.catch(error => {
						console.log("Game NOT saved Game Over");
						console.log(error);
					})

			}
		} else {
			socket.emit('invalid_play', {
				'type': 'Wrong_Turn',
				'game': game
			});
			return;
		}
	});

	socket.on('get_game', function (data) {
		let game = games.gameByID(data.gameID);
		socket.emit('game_changed', game);
	});

	socket.on('get_my_activegames', function (data) {
		var my_games = games.getConnectedGamesOf(socket.id);
		socket.emit('my_active_games', my_games);
	});

	socket.on('get_my_lobby_games', function () {
		var my_games = games.getLobbyGamesOf(socket.id);
		socket.emit('my_lobby_games', my_games);
	});

	socket.on("sendMessage", function (data) {
		console.log("Message received on server");
		io.to(data.gameID).emit("message_received", data);
	});


});