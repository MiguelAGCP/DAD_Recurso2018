<template>
    <div>
        <player1-board :game="game" v-if="game.gameStarted && !game.gameEnded && game.players[0] && game.players[0].playerID == $store.state.user.id"
            @play="play"></player1-board>
        <player2-board :game="game" v-if="game.gameStarted && !game.gameEnded && game.players[1] && game.players[1].playerID == $store.state.user.id"
            @play="play"></player2-board>
        <player3-board :game="game" v-if="game.gameStarted && !game.gameEnded && game.players[2] && game.players[2].playerID == $store.state.user.id"
            @play="play"></player3-board>
        <player4-board :game="game" v-if="game.gameStarted && !game.gameEnded && game.players[3] && game.players[3].playerID == $store.state.user.id"
            @play="play"></player4-board>

    </div>
</template>

<script type="text/javascript">
    import Player1Board from './boards/player1Board.vue';
    import Player2Board from './boards/player2Board.vue';
    import Player3Board from './boards/player3Board.vue';
    import Player4Board from './boards/player4Board.vue';

    export default {
        props: ['game'],
        data: function () {
            return {
                input: "",
                messages: []
            }
        },
        sockets: {
            verifying_Renuncia(msg){
                alert(msg);
            },

           renuncia(msg){
                alert(msg);               
           },

           not_renuncia(msg){
                alert(msg);               
           },

        }, 
        computed: {
            ownPlayerNumber() {
                if (this.game.players[0].playerID == this.$store.state.user.id) {
                    return 1;
                } else if (this.game.players[1].playerID == this.$store.state.user.id) {
                    return 2;
                } else if (this.game.players[2].playerID == this.$store.state.user.id) {
                    return 3;
                } else if (this.game.players[3].playerID == this.$store.state.user.id) {
                    return 4;
                }
                return 0;
            },
        },
        methods: {

            play(card_index) {
                console.log("Player Turn: " + this.game.playerTurn);

                if (this.game.playerTurn != this.$store.getters.getID) {
                    alert("It's not your turn to play!");
                } else {
                    this.$emit('play', {
                        gameID: this.game.gameID,
                        index: card_index,
                    });
                }
            },

            sendMessage() {
                let data = {
                    gameID: this.game.gameID,
                    playerName: this.ownPlayerName,
                    message: this.input
                }
                this.$emit("send-message", data);
                this.input = "";
            }
        },
        components: {
            'player1Board': Player1Board,
            'player2Board': Player2Board,
            'player3Board': Player3Board,
            'player4Board': Player4Board,
        }
    }
</script>

<style scoped>
    .gameseparator {
        border-style: solid;
        border-width: 2px 0 0 0;
        border-color: black;
    }
</style>