/*jshint esversion: 6 */
var shuffle = require('shuffle-array');
var Deck = require('card-deck');


class SuecaGame {
    constructor(ID, playerID, player1Name, socketID) {
        this.gameID = ID;
        this.gameEnded = false;
        this.gameStarted = false;
        this.winnerTeam = undefined;
        this.playerCount = undefined;
        this.playerTurn = undefined;
        this.trumpCard = undefined;
        this.timer = undefined;
        this.players = [];
        this.deck = new Deck();

        let player = {
            playerID: playerID,
            socketID: socketID,
            name: player1Name,
            score: 0,
            team: 1,
            hand: []

        }
        this.playerCount = this.players.push(player);
    }

    join(playerID, playerName, socketID) {

        if (this.playerCount < 4) {
            let teamNumber = undefined;
            if (this.playerCount % 2 != 0) {
                teamNumber = 1;
            } else {
                teamNumber = 2;
            }
            let player = {
                playerID: playerID,
                socketID: socketID,
                name: playerName,
                score: 0,
                team: teamNumber,
                hand: []
            }
            this.playerCount = this.players.push(player);
        }

    }

    startGame() {
        for (let i = 0; i < 40; i++) {
            this.deck.shuffle();
        }
        this.nextPlayer = Math.floor(Math.random() * 4)-1
        this.gameStarted = true;
        console.log("GAME STARTED");
        console.log("First Player: " +this.nextPlayer);
        console.log("Deck: " + this.deck);
    }




 

    play(playerNumber, index) {
      
    }



    nextPlayer() {
  
    }



    gameIsOver() {
       

    }



}

module.exports = SuecaGame;