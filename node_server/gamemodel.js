/*jshint esversion: 6 */
var shuffle = require('shuffle-array');
var Deck = require('card-deck');
var lodash = require('lodash');
var findIndex = require('array.prototype.findindex');
var _ = require('underscore');


class SuecaGame {
    constructor(ID, player_id, player1Name, socket_id, playerAvatar) {
        this.gameID = ID;
        this.gameEnded = false;
        this.gameStarted = false;
        this.winnerTeam = undefined;
        this.playerCount = undefined;
        this.playerTurn = undefined;
        this.trumpSuit = undefined;
        this.timer = undefined;
        this.players = [];
        this.team1Points= undefined;
        this.team2Points= undefined;
        this.cardsOnTable = undefined;
        this.rounds = 0;
        this.suitToAssistTo = undefined;
        this.roundFirstPlayer = undefined;
        
        let player = {
            playerID: player_id,
            socketID: socket_id,
            name: player1Name,
            score: 0,
            team: 1,
            hand: [],
            cardTable: undefined,
            avatar: playerAvatar,
            renuncia: false

        }
        this.playerCount = this.players.push(player);
        this.team1Points = 0;
        this.team2Points = 0;
        this.cardsOnTable = 0;
    }

        join(player_id, playerName, socket_id, playerAvatar) {

            if (this.playerCount < 4) {
                let teamNumber = undefined;
                if (this.playerCount == 1) {
                    teamNumber = 1;
                } else {
                    teamNumber = 2;
                }
                let player = {
                    playerID: player_id,
                    socketID: socket_id,
                    name: playerName,
                    score: 0,
                    team: teamNumber,
                    hand: [],
                    cardTable: undefined,
                    avatar: playerAvatar,
                    renuncia: false
                }
                this.playerCount = this.players.push(player);
         
                return true;
            }else{
                return false;
            }

        }

        startGame() {
            let deck = this.createDeck();
            for (let i = 0; i < 40; i++) {
                shuffle(deck);
            }
            deck[0].imageToShow = deck[0].image;
            this.trumpSuit = deck[0].suit;
            let firstPlayerToReceiveCards = Math.floor(Math.random() * 4);
           
            this.playerTurn = this.getPlayerID(this.nextPlayer(firstPlayerToReceiveCards));
            this.roundFirstPlayer = this.playerTurn;
            

            let drawCardsTo = firstPlayerToReceiveCards;
            
            for(let i = 0; i<4; i++){
               this.drawCards(drawCardsTo, deck);
                if(drawCardsTo == 3){
                    drawCardsTo = 0;
                }
                else{
                    drawCardsTo++;
                }
            }
            this.gameStarted = true;
        }

        drawCards(drawCardsTo, deck) {   
            for (let i = 0; i < 10; i++) {
                this.players[drawCardsTo].hand.push(deck[i]);                
            }
            deck.splice(0, 10);

        }
        play(player_id, cardIndex) {

            if (player_id == this.playerTurn) {
                if (this.cardsOnTable < 4) {
                    var playerIndex = this.getPlayerIndex(player_id);
                    if (this.cardsOnTable == 0) {
                        this.suitToAssistTo = this.players[playerIndex].hand[cardIndex].suit;    
                        
                    } else {
                        this.hasRenuncia(playerIndex, cardIndex);
                    }
                    this.players[playerIndex].cardTable = this.players[playerIndex].hand[cardIndex];
                    this.players[playerIndex].hand.splice(cardIndex, 1);
                    this.playerTurn = this.getPlayerID(this.nextPlayer(playerIndex));
                    this.cardsOnTable++;
                }

                return true;
            } else {
                return false;
            }
        }
            hasRenuncia(playerIndex, cardIndex) {
                if (this.players[playerIndex].hand[cardIndex].suit != this.suitToAssistTo) {

                    for (let i = 0; i < this.players[playerIndex].hand.length; i++) {
                        if (this.players[playerIndex].hand[i].suit == this.suitToAssistTo) {
                            this.players[playerIndex].renuncia = true;
                        }
                    }
                }
            }

        finishRound(){
    
            var roundWinnerIndex = this.getWinner();
            var pointsOnTable = this.pointsOnTable();
            this.setPointsToTeam(roundWinnerIndex, pointsOnTable);

      
            this.cardsOnTable = 0;
            for (let i = 0; i < 4; i++) {
                this.players[i].cardTable = undefined;                        
            }

            if (this.gameIsOver()){
                this.gameEnded = true;

                if(this.team1Points>team2Points){
                    this.winnerTeam = 1;                        //TEAM 1 WINS
                        if(this.team1Points>=61 && this.team1Points<=90){
                            this.players[0].score = 1;
                            this.players[1].score = 1;
                        }else if(this.team1Points>=91 && this.team1Points<=119){
                            this.players[0].score = 2;
                            this.players[1].score = 2;
                        }else{
                            this.players[0].score = 4;
                            this.players[1].score = 4;
                        }

                }else if(this.team2Points>this.team1Points){
                    this.winnerTeam = 2;                        //TEAM 2 WINS
                    if(this.team1Points>=61 && this.team1Points<=90){
                        this.players[2].score = 1;
                        this.players[3].score = 1;
                    }else if(this.team1Points>=91 && this.team1Points<=119){
                        this.players[2].score = 2;
                        this.players[3].score = 2;
                    }else{
                        this.players[2].score = 4;
                        this.players[3].score = 4;
                    }
                }else{
                    this.winnerTeam = -1;                       //DRAW
                }
            }
            this.rounds++;
        }

        pointsOnTable(){
            let points = 0;
            for (let i = 0; i < this.players.length; i++) {
                points += this.players[i].cardTable.points;                
            }
            return points;
        }

        getWinner(){

            var maxCardValue = -1;
            let roundWinnerIndex = 0;

            if(this.hasTrumpsOnTable()){
                for (let i = 0; i < this.players.length; i++) {
                   if (this.players[i].cardTable.suit == this.trumpSuit && this.players[i].cardTable.magnitude > maxCardValue){
                       roundWinnerIndex = i;
                       maxCardValue = this.players[i].cardTable.magnitude;
                   }
                }
            }
            else{
                             
                for (let i = 0; i < this.players.length; i++) {
                
                    if (this.players[i].cardTable.suit == this.suitToAssistTo && this.players[i].cardTable.magnitude > maxCardValue){
                        roundWinnerIndex = i;
                        maxCardValue = this.players[i].cardTable.magnitude;
                    }
                }
            }

            return roundWinnerIndex;
            
        }

        setPointsToTeam(playerIndex, points){

            if(this.players[playerIndex].team == 1){
                this.team1Points += points;
            }
            else if(this.players[playerIndex].team == 2){
                this.team2Points += points;
                                              
            }

        }

        hasTrumpsOnTable(){
            for (let i = 0; i < this.players.length; i++) {
                
                if (this.players[i].cardTable.suit == this.trumpSuit){
                    return true;
                }                
            }
            return false;
        }


        nextPlayer(actualPlayerIndex) {
            var nextPlayer = undefined;
          
            switch (actualPlayerIndex) {
                case 0:
                    nextPlayer = 2;
                    break;
                case 1:
                    nextPlayer = 3;
                    break;
                case 2:
                    nextPlayer = 1;    
                    break;
                case 3:
                    nextPlayer = 0;
                    break;

                default:
                    break;
            }
            return nextPlayer;
        }
        getPlayerID(playerIndex){
            return this.players[playerIndex].playerID;
        }
        getPlayerIndex(playerID){
            return this.players.findIndex(player => player.playerID == playerID);
        }

        confirmRenuncia(playerID){
            var playerIndex = this.getPlayerIndex(playerID);
            var renuncia = false;

            if(playerIndex == 0 || playerIndex == 1){
                if (this.players[2].renuncia || this.players[3].renuncia){

                    this.players[0].score +=4;
                    this.players[1].score +=4;

                    this.players[3].score -=4;
                    this.players[2].score -=4;

                    this.winnerTeam = 1;
                    this.gameEnded = true;
                    return true;
                }
                if(!this.players[2].renuncia && !this.players[3].renuncia){
                    this.players[0].score -=4;
                    this.players[1].score -=4;

                    this.players[3].score +=4;
                    this.players[2].score +=4;

                    this.winnerTeam = 2;
                    this.gameEnded = true;
                    return false;
                }
                
            }
            else if(playerIndex == 2 || playerIndex == 3){
                if (this.players[0].renuncia || this.players[1].renuncia){

                    this.players[0].score -=4;
                    this.players[1].score -=4;

                    this.players[3].score +=4;
                    this.players[2].score +=4;
                    
                    this.winnerTeam = 2;                    
                    this.gameEnded = true;
                    return true;
                }
                if(!this.players[0].renuncia && !this.players[1].renuncia){

                    this.players[0].score +=4;
                    this.players[1].score +=4;

                    this.players[3].score -=4;
                    this.players[2].score -=4;

                    this.winnerTeam = 1;                  
                    this.gameEnded = true;
                    return false;
                }
            }               
        }
        

        gameIsOver() {
            if(this.rounds==10){
                return true;
            }
            else{
                return false;
            }
        }

        createDeck(){
            let deck = [
                {points:0, image: "c2", imageToShow: "semFace", suit: "hearts", magnitude: 1}, // 2 of hearts
                {points:0, image: "c3", imageToShow: "semFace", suit: "hearts", magnitude: 2}, // 3 of hearts
                {points:0, image: "c4", imageToShow: "semFace", suit: "hearts", magnitude: 3}, // 4 of hearts
                {points:0, image: "c5", imageToShow: "semFace", suit: "hearts", magnitude: 4}, // 5 of hearts
                {points:0, image: "c6", imageToShow: "semFace", suit: "hearts", magnitude: 5}, // 6 of hearts
                {points:10, image: "c7", imageToShow: "semFace", suit: "hearts", magnitude: 9}, // 7 of hearts
                {points:3, image: "c11", imageToShow: "semFace", suit: "hearts", magnitude: 7}, // Jack of hearts
                {points:2, image: "c12", imageToShow: "semFace", suit: "hearts", magnitude: 6}, //  Queen hearts
                {points:4, image: "c13", imageToShow: "semFace", suit: "hearts", magnitude: 8}, // King of hearts
                {points:11, image: "c1", imageToShow: "semFace", suit: "hearts", magnitude: 10}, // Ace of hearts
    
    
                {points:0, image: "e2", imageToShow: "semFace", suit: "spades", magnitude: 1}, // 2 of spades
                {points:0, image: "e3", imageToShow: "semFace", suit: "spades", magnitude: 2}, // 3 of spades
                {points:0, image: "e4", imageToShow: "semFace", suit: "spades", magnitude: 3}, // 4 of spades
                {points:0, image: "e5", imageToShow: "semFace", suit: "spades", magnitude: 4}, // 5 of spades
                {points:0, image: "e6", imageToShow: "semFace", suit: "spades", magnitude: 5}, // 6 of spades
                {points:10, image: "e7", imageToShow: "semFace", suit: "spades", magnitude: 9}, // 7 of spades
                {points:3, image: "e11", imageToShow: "semFace", suit: "spades", magnitude: 7}, // Jack of spades
                {points:2, image: "e12", imageToShow: "semFace", suit: "spades", magnitude: 6}, //  Queen spades
                {points:4, image: "e13", imageToShow: "semFace", suit: "spades", magnitude: 8}, // King of spades
                {points:11, image: "e1", imageToShow: "semFace", suit: "spades", magnitude: 10}, // Ace of spades
    
    
                {points:0, image: "o2", imageToShow: "semFace", suit: "diamonds", magnitude: 1}, // 2 of diamonds
                {points:0, image: "o3", imageToShow: "semFace", suit: "diamonds", magnitude: 2}, // 3 of diamonds
                {points:0, image: "o4", imageToShow: "semFace", suit: "diamonds", magnitude: 3}, // 4 of diamonds
                {points:0, image: "o5", imageToShow: "semFace", suit: "diamonds", magnitude: 4}, // 5 of diamonds
                {points:0, image: "o6", imageToShow: "semFace", suit: "diamonds", magnitude: 5}, // 6 of diamonds
                {points:10, image: "o7", imageToShow: "semFace", suit: "diamonds", magnitude: 9}, // 7 of diamonds
                {points:3, image: "o11", imageToShow: "semFace", suit: "diamonds", magnitude: 7}, // Jack of diamonds
                {points:2, image: "o12", imageToShow: "semFace", suit: "diamonds", magnitude: 6}, //  Queen diamonds
                {points:4, image: "o13", imageToShow: "semFace", suit: "diamonds", magnitude: 8}, // King of diamonds
                {points:11, image: "o1", imageToShow: "semFace", suit: "diamonds", magnitude: 10}, // Ace of diamonds
    
    
                {points:0, image: "p2", imageToShow: "semFace", suit: "clubs", magnitude: 1}, // 2 of clubs
                {points:0, image: "p3", imageToShow: "semFace", suit: "clubs", magnitude: 2}, // 3 of clubs
                {points:0, image: "p4", imageToShow: "semFace", suit: "clubs", magnitude: 3}, // 4 of clubs
                {points:0, image: "p5", imageToShow: "semFace", suit: "clubs", magnitude: 4}, // 5 of clubs
                {points:0, image: "p6", imageToShow: "semFace", suit: "clubs", magnitude: 5}, // 6 of clubs
                {points:10, image: "p7", imageToShow: "semFace", suit: "clubs", magnitude: 9}, // 7 of clubs
                {points:3, image: "p11", imageToShow: "semFace", suit: "clubs", magnitude: 7}, // Jack of clubs
                {points:2, image: "p12", imageToShow: "semFace", suit: "clubs", magnitude: 6}, //  Queen clubs
                {points:4, image: "p13", imageToShow: "semFace", suit: "clubs", magnitude: 8}, // King of clubs
                {points:11, image: "p1", imageToShow: "semFace", suit: "clubs", magnitude: 10}, // Ace of clubs
            ]
            return deck;
        }



}

module.exports = SuecaGame;