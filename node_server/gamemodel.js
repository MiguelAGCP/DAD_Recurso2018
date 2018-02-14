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
        this.cardToAssist = undefined;
        
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
           
            this.nextPlayer(firstPlayerToReceiveCards);

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
            //deck = undefined;
            this.gameStarted = true;
        }

        drawCards(drawCardsTo, deck) {   
            //console.log(drawCardsTo);         
            for (let i = 0; i < 10; i++) {
                this.players[drawCardsTo].hand.push(deck[i]);                
            }
            deck.splice(0, 10);

            //console.log("Deck: " + JSON.stringify(deck));

        }
        play(player_id, cardIndex) {
           /*  console.log("PlayerID " + player_id);
            console.log("PlayerTURN " + this.playerTurn);
            console.log("CARD INDEX " + cardIndex); */
            if (player_id == this.playerTurn) {
                if (this.cardsOnTable < 4) {
                    var playerIndex = this.players.findIndex(obj => obj.playerID == player_id);
                    if (this.cardsOnTable == 0) {
                        this.cardToAssist = this.players[playerIndex].hand[cardIndex].suit;
                           /*  console.log("Card to assist " + this.cardToAssist);   */          
                        
                    } else {
                        this.hasRenuncia(playerIndex, cardIndex);
                    }
                    this.players[playerIndex].cardTable = this.players[playerIndex].hand[cardIndex];
                    this.players[playerIndex].hand.splice(cardIndex, 1);
                    this.nextPlayer(playerIndex);
                    this.cardsOnTable++;
                }

               // console.log("Player " + playerIndex+1 + " renuncia: " + this.players[playerIndex].renuncia);
                return true;
            } else {
                return false;
            }
        }
            hasRenuncia(playerIndex, cardIndex) {
                /* console.log("Suit " + this.players[playerIndex].hand[cardIndex].suit); */
                if (this.players[playerIndex].hand[cardIndex].suit != this.cardToAssist) {

                    /* console.log("Player hand length: " + this.players[playerIndex].hand.length); */

                    for (let i = 0; i < this.players[playerIndex].hand.length; i++) {
                        if (this.players[playerIndex].hand[i].suit == this.cardToAssist) {
                            this.players[playerIndex].renuncia = true;
                        }
                    }
                }
            }

        finishRound(){
       /*      console.log("Player 1 renuncia: " + this.players[0].renuncia);
            console.log("Player 2 renuncia: " + this.players[1].renuncia);
            console.log("Player 3 renuncia: " + this.players[2].renuncia);
            console.log("Player 4 renuncia: " + this.players[3].renuncia); */

            this.cardsOnTable = 0;
            for (let i = 0; i < 4; i++) {
                this.players[i].cardTable = undefined;                        
            }
        }


        nextPlayer(actualPlayerIndex) {
            if (actualPlayerIndex == 3) {
               
            } else {
                this.playerTurn = this.players[actualPlayerIndex + 1].playerID;
            }

            switch (actualPlayerIndex) {
                case 0:
                this.playerTurn = this.players[2].playerID;
                    break;
                case 1:
                this.playerTurn = this.players[3].playerID;
                    break;
                case 2:
                this.playerTurn = this.players[1].playerID;    
                    break;
                case 3:
                    this.playerTurn = this.players[0].playerID;
                    break;

                default:
                    break;
            }
        }



        gameIsOver() {
            if(rounds==10){
                return true;
            }
            else{
                return false;
            }
        }

        createDeck(){
            let deck = [
                {points:0, image: "c2", imageToShow: "semFace", suit: "hearts", value: "2"}, // 2 of hearts
                {points:0, image: "c3", imageToShow: "semFace", suit: "hearts", value: "3"}, // 3 of hearts
                {points:0, image: "c4", imageToShow: "semFace", suit: "hearts", value: "4"}, // 4 of hearts
                {points:0, image: "c5", imageToShow: "semFace", suit: "hearts", value: "5"}, // 5 of hearts
                {points:0, image: "c6", imageToShow: "semFace", suit: "hearts", value: "6"}, // 6 of hearts
                {points:10, image: "c7", imageToShow: "semFace", suit: "hearts", value: "10"}, // 7 of hearts
                {points:3, image: "c11", imageToShow: "semFace", suit: "hearts", value: "3"}, // Jack of hearts
                {points:2, image: "c12", imageToShow: "semFace", suit: "hearts", value: "2"}, //  Queen hearts
                {points:4, image: "c13", imageToShow: "semFace", suit: "hearts", value: "4"}, // King of hearts
                {points:11, image: "c1", imageToShow: "semFace", suit: "hearts", value: "11"}, // Ace of hearts
    
    
                {points:0, image: "e2", imageToShow: "semFace", suit: "spades", value: "2"}, // 2 of spades
                {points:0, image: "e3", imageToShow: "semFace", suit: "spades", value: "3"}, // 3 of spades
                {points:0, image: "e4", imageToShow: "semFace", suit: "spades", value: "4"}, // 4 of spades
                {points:0, image: "e5", imageToShow: "semFace", suit: "spades", value: "5"}, // 5 of spades
                {points:0, image: "e6", imageToShow: "semFace", suit: "spades", value: "6"}, // 6 of spades
                {points:10, image: "e7", imageToShow: "semFace", suit: "spades", value: "10"}, // 7 of spades
                {points:3, image: "e11", imageToShow: "semFace", suit: "spades", value: "3"}, // Jack of spades
                {points:2, image: "e12", imageToShow: "semFace", suit: "spades", value: "2"}, //  Queen spades
                {points:4, image: "e13", imageToShow: "semFace", suit: "spades", value: "4"}, // King of spades
                {points:11, image: "e1", imageToShow: "semFace", suit: "spades", value: "11"}, // Ace of spades
    
    
                {points:0, image: "o2", imageToShow: "semFace", suit: "diamonds", value: "2"}, // 2 of diamonds
                {points:0, image: "o3", imageToShow: "semFace", suit: "diamonds", value: "3"}, // 3 of diamonds
                {points:0, image: "o4", imageToShow: "semFace", suit: "diamonds", value: "4"}, // 4 of diamonds
                {points:0, image: "o5", imageToShow: "semFace", suit: "diamonds", value: "5"}, // 5 of diamonds
                {points:0, image: "o6", imageToShow: "semFace", suit: "diamonds", value: "6"}, // 6 of diamonds
                {points:10, image: "o7", imageToShow: "semFace", suit: "diamonds", value: "10"}, // 7 of diamonds
                {points:3, image: "o11", imageToShow: "semFace", suit: "diamonds", value: "3"}, // Jack of diamonds
                {points:2, image: "o12", imageToShow: "semFace", suit: "diamonds", value: "2"}, //  Queen diamonds
                {points:4, image: "o13", imageToShow: "semFace", suit: "diamonds", value: "4"}, // King of diamonds
                {points:11, image: "o1", imageToShow: "semFace", suit: "diamonds", value: "11"}, // Ace of diamonds
    
    
                {points:0, image: "p2", imageToShow: "semFace", suit: "clubs", value: "2"}, // 2 of clubs
                {points:0, image: "p3", imageToShow: "semFace", suit: "clubs", value: "3"}, // 3 of clubs
                {points:0, image: "p4", imageToShow: "semFace", suit: "clubs", value: "4"}, // 4 of clubs
                {points:0, image: "p5", imageToShow: "semFace", suit: "clubs", value: "5"}, // 5 of clubs
                {points:0, image: "p6", imageToShow: "semFace", suit: "clubs", value: "6"}, // 6 of clubs
                {points:10, image: "p7", imageToShow: "semFace", suit: "clubs", value: "10"}, // 7 of clubs
                {points:3, image: "p11", imageToShow: "semFace", suit: "clubs", value: "3"}, // Jack of clubs
                {points:2, image: "p12", imageToShow: "semFace", suit: "clubs", value: "2"}, //  Queen clubs
                {points:4, image: "p13", imageToShow: "semFace", suit: "clubs", value: "4"}, // King of clubs
                {points:11, image: "p1", imageToShow: "semFace", suit: "clubs", value: "11"}, // Ace of clubs
            ]
            return deck;
        }



}

module.exports = SuecaGame;