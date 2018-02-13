<template>
    <div class="container navbar navbar-toggleable-md navbar-light bg-faded">
        <div class="row">

            <div class="col-md-11"> 
            <el-tabs name="navBarMenu">
    		    <el-tab-pane v-if="$store.state.user.admin" label="Dashboard" name="dashboard">
                    <router-link to="/dash">Dashboard</router-link>
			    </el-tab-pane>
			    <el-tab-pane label="Game" name="game">
                    <router-link to="/play">Play Game</router-link>
			    </el-tab-pane>
                <el-tab-pane label="Statistics" name="statistics">
                    <router-link to="/statistics">Global Stats </router-link>
                    - 
                    <router-link to="/statistics"> My Stats</router-link>
			    </el-tab-pane>
	 		</el-tabs>
            </div>
          <div class="dropdown col-md-1" align="left">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img :src="myAvatar" class="img-circle avatarBadge">
                {{$store.state.user.nickname}} <span class="glyphicon glyphicon-triangle-bottom"></span>
                </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <p class="dropdown-item" ><router-link to="/useraccount"><span class="glyphicon glyphicon-user"> My Account</span></router-link></p>
                      <p class="dropdown-item" v-on:click.prevent="logout()"><router-link to="/index"><span class="glyphicon glyphicon-log-out"> Logout</span></router-link></p>                  
                </div>
                
          </div>


        </div>

    </div>
</template>
<script>

        import VueRouter from "vue-router";
        var router = new VueRouter();
    
    
    export default {


     
    
     methods: {

            logout: function(){

            //    console.log("Logging Out");
            //    console.log(this.$store.state.user.headers.Authorization);

                 var config = {
            headers: {
              Authorization: this.$store.state.user.headers.Authorization,
              Accept: "application/json"
            }
          };
            //     console.log("Logging Out");
            //    console.log(config);



                axios.post('api/logout', config).then(response=>{
            //        console.log(response.data);
                   

                    this.$store.commit('setNickname', "");
                    this.$store.commit('setID', ""); 
                    this.$store.commit('setRefreshToken', "");
                    this.$store.commit('setHeaders', "");
                    sessionStorage.clear();

                    return this.$router.push("/index");
            });
            },

            goToUserAccount: function(){

                    this.$router.push("/useraccount");


            }

     },
     computed: {
         myAvatar(){
             return "img/avatars/" + this.$store.getters.getAvatar;
         }

     },
     mounted(){
     }
    }
</script>