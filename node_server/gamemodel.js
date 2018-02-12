/*jshint esversion: 6 */
var shuffle = require('shuffle-array');
var Deck = require('card-deck');


class SuecaGame {
    constructor(ID, playerID, player1Name, socketID, playerAvatar) {
        this.gameID = ID;
        this.gameEnded = false;
        this.gameStarted = false;
        this.winnerTeam = undefined;
        this.playerCount = undefined;
        this.playerTurn = undefined;
        this.trumpCard = undefined;
        this.timer = undefined;
        this.players = [];
        this.deck = [
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
        let player = {
            playerID: playerID,
            socketID: socketID,
            name: player1Name,
            score: 0,
            team: 1,
            hand: [],
            cardTable: undefined,
            avatar: playerAvatar

        }
        this.playerCount = this.players.push(player);
        }

        join(playerID, playerName, socketID, playerAvatar) {

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
                    hand: [],
                    cardTable: undefined,
                    avatar: playerAvatar
                }
                this.playerCount = this.players.push(player);
            }

        }

        startGame() {
            for (let i = 0; i < 40; i++) {
                shuffle(this.deck);
            }
            this.deck[0].imageToShow = this.deck[0].image;
           //this.nextPlayer = Math.floor(Math.random() * 4) - 1;
            
            //console.log("GAME STARTED");
            //console.log("First Player: " +this.nextPlayer);
            //console.log("Deck: " + JSON.stringify(this.deck));
            let firstPlayerToReceiveCards = Math.floor(Math.random() * 4);
            if (firstPlayerToReceiveCards == 3){
                this.nextPlayer=0;
            }
            else{
                this.nextPlayer = firstPlayerToReceiveCards + 1;
            }

            let drawCardsTo = firstPlayerToReceiveCards;
            
            for(let i = 0; i<4; i++){
               this.drawCards(drawCardsTo);
                if(drawCardsTo == 3){
                    drawCardsTo = 0;
                }
                else{
                    drawCardsTo++;
                }
            }
            //this.deck = undefined;
            this.gameStarted = true;
        }

        drawCards(drawCardsTo) {   
            //console.log(drawCardsTo);         
            for (let i = 0; i < 10; i++) {
                this.players[drawCardsTo].hand.push(this.deck[i]);                
            }
            this.deck.splice(0, 10);

            //console.log("Deck: " + JSON.stringify(this.deck));

        }


        play(playerNumber, index) {

            console.log("PlayerNumber " + playerNumber);
            console.log("CARD INDEX " + index);
            let playerIndex = playerNumber-1;
            this.players[playerIndex].cardTable = this.players[playerIndex].hand[index];

            console.log(this.players[playerIndex].cardTable);

            return true;
        }



        nextPlayer() {

        }



        gameIsOver() {


        }



}

module.exports = SuecaGame;