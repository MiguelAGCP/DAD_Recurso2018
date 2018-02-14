<template>
    <div>
        <!-- *****CHAT ZONE***** -->
        <div class="col-sm-3 chatBox" v-bind:style="{ height: chatHeight }">
            <ul class="messages">
                <li v-for="message in messages">{{message.playerName}}: {{message.message}}</li>
            </ul>
        </div>
        <div class="row">
            <div class="col-sm">
                <form action="">
                    <input v-model="input" autocomplete="off" />
                    <button class="btn btn-success" v-on:click.prevent="sendMessage()">
                        <span class="glyphicon glyphicon-send" aria-hidden="true"></span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
    export default {
        props: ['game'],
        data: function () {
            return {
                input: "",
                messages: []
            }
        },
        sockets: {
            message_received(data) {
                let timestamp = new Date();
                let hour = timestamp.getHours();
                let minutes = timestamp.getMinutes();
                let seconds = timestamp.getSeconds();

                let day = timestamp.getDay();
                let month = timestamp.getMonth() + 1;
                let year = timestamp.getFullYear();

                let fullDateNTime = day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds;

                if (this.game.gameID == data.gameID) {
                    let playerAndMessage = {
                        playerName: data.playerName,
                        message: data.message,
                        time: fullDateNTime
                    }
                    this.messages.push(playerAndMessage);
                }
            }
        },
        methods: {
            sendMessage() {
                this.$socket.emit("sendMessage", {
                        gameID: this.game.gameID,
                        playerName: this.$store.getters.getNickname,
                        message: this.input
                }); 
                this.input = "";
            }
        },
        computed:{
             chatHeight: function () {
                return  100 + "px";
            }
        }
    }
</script>