<template>
    <div class="container navbar navbar-toggleable-md navbar-light bg-faded">
        <div class="row">

            <div class="col-md-10"> 
                        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                            <el-menu-item index="1"><router-link to="/dash">Dashboard</router-link></el-menu-item>
                            <el-menu-item index="2"><router-link to="/play">Game</router-link></el-menu-item>
                            <el-menu-item index="3"><router-link to="/statistics">Statistics</router-link></el-menu-item>
                        </el-menu>
            </div>



          <div class="dropdown col-md-1" align="left" style="z-index:5">
              <el-menu :default-active="activeIndex1" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
             <el-submenu index="4">
                    <template slot="title"><img :src="myAvatar" class="img-circle avatarBadge">
               {{$store.state.user.nickname}}</template>
                    <el-menu-item index="3-1"><router-link to="/useraccount">  My Account</router-link></el-menu-item>
                    <el-menu-item index="3-2" v-on:click="logout()">Logout</el-menu-item>
            </el-submenu>
            </el-menu>
                    </div>

        </div>

    </div>
</template>



<script>

        import VueRouter from "vue-router";
        var router = new VueRouter();
    
    
    export default {

 data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
     
 },
     methods: {


         handleSelect: function(key, keyPath) {
        console.log(key, keyPath);
      },

            logout(){

                 var config = {
            headers: {
              Authorization: this.$store.state.user.headers.Authorization,
              Accept: "application/json"
            }
          };
            //     console.log("Logging Out");
          


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