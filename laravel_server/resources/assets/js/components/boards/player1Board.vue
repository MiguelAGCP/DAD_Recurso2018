<template>
    <div>
        <div>
            <h2 class="text-center bg-primary text-white">Game {{ game.gameID }} Player Turn: {{ currentPlayerNickname }}</h2>
             <button class="btn-danger float-right" v-on:click.prevent="renuncia">Desconfiar</button>
            <br>
        </div>
        <div class="board container-fluid">
            <!-- TEAMMATE HAND -->
            <div class="row">
                <div class="col-md-12" style="text-align:center">
                    <img :src="avatarURL(game.players[1].avatar)" class="img-circle avatarGame">

                </div>

            </div>
            <div class="row">
                <div class="col-md-12" style="text-align:center">
                    <!-- <img v-for="i in 10" v-bind:src="cardImageURL('semFace')" class="myHand"> -->
                    <div v-if="game.gameStarted">
                        <img v-for="card of game.players[1].hand" v-bind:src="cardImageURL(card.imageToShow)" class="teamMateHand">
                    </div>
                </div>
            </div>


            <div class="row">
                <div class="col-md-4 container">
                    <div class="row">
                        <div class="col-md-12" style="text-align:center">
                            <img :src="avatarURL(game.players[2].avatar)" class="img-circle avatarGame">
                        </div>

                    </div>
                    <div class="row">
                        <div class="col-md-12" style="text-align:center">
                            <div v-if="game.gameStarted">
                                <img v-for="card of game.players[2].hand" v-bind:src="cardImageURL(card.imageToShow)" class="oponentsHand">
                            </div>
                        </div>
                    </div>
                </div>
                <!-- CENTER ZONE -->
                <div class="col-md-4">
                    <!-- TEAMMATE CARD -->
                    <div class="row">
                        <div class="col-md-12" style="text-align:center">
                            <img v-if="!game.players[1].cardTable" v-bind:src="cardImageURL('semFace')" class="playedCard">
                            <img v-if="game.players[1].cardTable" v-bind:src="cardImageURL(game.players[1].cardTable.image)" class="playedCard">
                        </div>
                    </div>
                    <div class="row">
                        <!-- LEFT PLAYER CARD -->
                        <div class="col-md-6" style="text-align:center">
                            <img v-if="!game.players[2].cardTable" v-bind:src="cardImageURL('semFace')" class="playedCard">
                            <img v-if="game.players[2].cardTable" v-bind:src="cardImageURL(game.players[2].cardTable.image)" class="playedCard">
                        </div>
                        <!-- RIGHT PLAYER CARD -->
                        <div class="col-md-6" style="text-align:center">
                            <img v-if="!game.players[3].cardTable" v-bind:src="cardImageURL('semFace')" class="playedCard">
                            <img v-if="game.players[3].cardTable" v-bind:src="cardImageURL(game.players[3].cardTable.image)" class="playedCard">
                        </div>
                    </div>
                    <!-- MY CARD -->
                    <div class="row">
                        <div class="col-md-12" style="text-align:center">
                            <img v-if="!game.players[0].cardTable" v-bind:src="cardImageURL('semFace')" class="playedCard">
                            <img v-if="game.players[0].cardTable" v-bind:src="cardImageURL(game.players[0].cardTable.image)" class="playedCard">
                        </div>
                    </div>
                </div>
                <!-- RIGHT PLAYER HAND -->
                <div class="col-md-4 container">
                    <div class="row">
                        <div class="col-md-12" style="text-align:center">
                            <img :src="avatarURL(game.players[3].avatar)" class="img-circle avatarGame">
                        </div>

                    </div>
                    <div class="row">
                        <div class="col-md-12" style="text-align:center">
                            <div v-if="game.gameStarted">
                                <img v-for="card of game.players[3].hand" v-bind:src="cardImageURL(card.imageToShow)" class="oponentsHand">
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <!-- OUR HAND -->
            <div class="row">
                <div class="col-md-12" style="text-align:center">
                    <div v-if="game.gameStarted">
                        <img v-for="(card, index) of game.players[0].hand" v-bind:src="cardImageURL(card.image)" class="myHand" v-on:click.prevent="play(index)">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12" style="text-align:center">
                    <img :src="avatarURL(game.players[0].avatar)" class="img-circle avatarGame">
                </div>
            </div>
        </div>
        <hr>
        <chat :game="game"></chat>
    </div>
</template>

<script type="text/javascript">

  import Chat from '../chat.vue';

    export default {
        props: ['game'],
        data: function () {
            return {
                input: "",
                messages: []
            }
        },

        methods: {
            play(index) {
                this.$emit('play', index);
            },
            cardImageURL(cardNumber) {
                var imgSrc = String(cardNumber);
                return 'img/' + imgSrc + '.png';
            },
            avatarURL(avatar) {
                return 'img/avatars/' + avatar;
            },
            renuncia(){
                 this.$socket.emit("renuncia",{
                     gameID: this.game.gameID,
                     playerID: this.$store.getters.getID
                     });
            }
        },
        computed: {
            currentPlayerNickname() {
                for (let i = 0; i < this.game.players.length; i++) {
                    if (this.game.players[i].playerID == this.game.playerTurn) {
                        console.log(this.game.players[i].playerID);
                        return this.game.players[i].name;
                    }

                }
            }

        },       
        components: {
            'chat': Chat
        },
    }
</script>