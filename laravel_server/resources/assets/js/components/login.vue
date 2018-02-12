<template>
<div>
		<div class="container">
    	<div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Login</div>

                <div class="panel-body">
                <!-- <form class="form-horizontal" method="POST" action="{{ route('login') }}"> -->
                    <form class="form-horizontal">
                        

                        <div class="form-group">
                            <label for="email" class="col-md-4 control-label">E-Mail / Nickname</label>

                            <div class="col-md-6">
                                <input input id="userLogin" v-model="login" class="form-control" name="login" value="" required autofocus>
                              
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="password" class="col-md-4 control-label" >Password</label>

                            <div class="col-md-6">
                                <input id="userPass" v-model="password" type="password" class="form-control" name="password" required>

                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-6 col-md-offset-4">
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" name="remember" > Remember Me
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-8 col-md-offset-4">
                                <button type="submit" class="btn btn-primary" v-on:click.prevent="loginUser">
                                    Login
                                </button>

                                <button type="submit" class="btn btn-primary" v-on:click.prevent="registerUser">
                                    Register
                                </button>

                                <a class="btn btn-link" href="">
                                    Forgot Your Password?
                                </a>
                            </div>
                        </div>
                    </form>
                </div><!--"panel-body"-->
            </div><!--"panel-default"-->
        </div><!--"col-md-8 c"-->
    	</div><!--"row"-->
		</div><!--container-->

    	<div   class="container" v-if="register">    

        <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Register</div>

                <div class="panel-body">
                <!-- <form class="form-horizontal" method="POST" action="{{ route('login') }}"> -->
                    <form class="form-horizontal">
                        

                        <div class="form-group">
                            <label for="email" class="col-md-4 control-label">E-Mail Address</label>

                            <div class="col-md-6">
                                <input input id="userLogin" v-model="login" class="form-control" name="login" value="" required autofocus>

                              
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="password" class="col-md-4 control-label" >Password</label>

                            <div class="col-md-6">
                                <input id="userPass" v-model="password" type="password" class="form-control" name="password" required>

                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-6 col-md-offset-4">
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" name="remember" > Remember Me
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-8 col-md-offset-4">
                                <button type="submit" class="btn btn-primary" v-on:click.prevent="loginUser">
                                    Login
                                </button>

                                <a class="btn btn-link" href="">
                                    Forgot Your Password?
                                </a>
                            </div>
                        </div>
                    </form>
                    </div><!--"panel-body"-->
            </div><!--"panel-default"-->
        </div><!--"col-md-8 c"-->
    	</div><!--"row"-->
		</div><!--container-->
</div>
</template>



<script type="text/javascript">
import UserList from "./userList.vue";
import UserEdit from "./userEdit.vue";


import VueRouter from "vue-router";

var router = new VueRouter();


export default {
  data: function() {
    return {
      register: false,
      login: undefined,
      password: undefined,
      logType: null,
    };
  },
  methods: {

     registerUser: function() {

         if(!this.register) this.register = true;
         else this.register =false;
     },


    ValidateEmail(login) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(login))
  {
    return (true);
  }
    return (false);
},

    loginUser: function() {

// Get Tokens and store in window localstorage and Vuex store
      axios
        .post("api/login/", { username: this.login, password: this.password })
.then(response => {
          var token = response.data.access_token;
          var refreshToken = response.data.refresh_token;
         
         // store tockens vuex
        this.$store.state.user.headers.Authorization = 'Bearer ' + window.localStorage.getItem("authToken");
        this.$store.state.user.refresh = window.localStorage.getItem("resfreshToken");

       this.$store.commit('setAuthToken', token);
       this.$store.commit('setHeaders', token);
       this.$store.commit('setRefreshToken', refreshToken);
       
       if(response.status===200){

                        this.logType = null;
        
                        if(this.ValidateEmail(this.login))
                             this.logType = "mail";
                        else this.logType = "nick";
                             this.getUserData(this.login, this.logType);
        }

         }).catch(  (error) => {
            const response = error.response;
         //   console.log("ERROR:" + response.status)
         if(error.response.status===401)
             alert("Invalid username or password!");
        
    });
  },


// Get and store user data by unique email/nick and redirect to default page
    getUserData: function(login, logType){
       // console.log("getUserData");
       
          axios
            .get("api/users/getuserby"+logType+"/" + login, { headers: this.$store.state.user.headers})
            .then(response => {
         
              this.$store.commit('setNickname', response.data[0].nickname);
              this.$store.commit('setID', response.data[0].id);
              this.$store.commit('setAvatar', response.data[0].avatar);



            //  console.log(response.data[0].nickname);  
              if (response.data[0].admin == "1") {
                this.$store.commit('setAdmin', true);
                return this.$router.push("/dash");
              } else {
                this.$store.commit('setAdmin', false);
                return this.$router.push("/play");
              }
            });

}

  },
  
  components: {},
  mounted() {}
  }
</script>


