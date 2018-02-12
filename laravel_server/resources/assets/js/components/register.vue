<template>
<div>
	

    	<div   class="container">    

        <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">New User Registration</div>

                <div class="panel-body">
                <!-- <form class="form-horizontal" method="POST" action="{{ route('login') }}"> -->
                    <form class="form-horizontal">
                        
                                 <div class="form-group">
                            <label for="name" class="col-md-4 control-label">Name</label>

                            <div class="col-md-6">
                                <input input id="userLogin" v-model="name" class="form-control" name="name" value="" required autofocus> 

                              
                            </div>
                        </div>


                        <div class="form-group">
                            <label for="email" class="col-md-4 control-label">E-Mail Address</label>

                            <div class="col-md-6">
                                <input input id="userLogin" v-model="email" type="email" class="form-control" name="login" value="" required autofocus> 

                              
                            </div>
                        </div>


                        <div class="form-group">
                            <label for="nickname" class="col-md-4 control-label" >Nickname</label>

                            <div class="col-md-6">
                                <input id="userPass" v-model="nickName"  class="form-control" name="nickName" required>

                            </div>
                        </div>


                        <div class="form-group">
                            <label for="password" class="col-md-4 control-label" >Password</label>

                            <div class="col-md-6">
                                <input id="userPass" v-model="password" type="password" class="form-control" name="password" required>

                            </div>
                        </div>


                        <div class="form-group">
                            <label for="password" class="col-md-4 control-label" >Retype Password</label>

                            <div class="col-md-6">
                                <input id="userPass" v-model="rPassword" type="password" class="form-control" name="rPassword" required>

                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-8 col-md-offset-4">
                                <button type="submit" class="btn btn-primary" v-on:click.prevent="registerUser">
                                    Register
                                </button>
                                <router-link class="btn btn-primary" to="/login">Cancel</router-link>

                              
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


import VueRouter from "vue-router";

var router = new VueRouter();


export default {
  data: function() {
    return {
      name: undefined,
      nickName: undefined,
      rPassword: undefined,
      password: undefined,
      email: undefined,
    };
  },
  methods: {

     registerUser: function() {


         this.user = {

                "name":  this.name,
                "nickname": this.nickName,
	            "email": this.email,
	            "password": this.password
         };
       

         if(this.password != this.rPassword){
            alert("The passwords must be the same!")
         }else{
            
                axios
            .post("api/storeuser/",{name:  this.name, nickname: this.nickName, email: this.email, password: this.password})
            .then(response => {

                 alert("Register sucessefull!");
                 this.$router.push("/login");

                


            }).catch( error => {
                 const response = error.response;

                if (response.data.errors.email){
                 alert(response.data.errors.email[0]);
                }
                if(response.data.errors.nickname){
                 alert(response.data.errors.nickname[0]);

                } 
                if(response.data.errors.password){
                 alert(response.data.errors.password[0]);
                } 
                 if(response.data.errors.name){
                 alert(response.data.errors.name[0]);

                } 
         });

         }

     },

     },

  components: {},
  mounted() {}
  }
</script>
<style>
.bgimg {
    background-image: url("https://images4.alphacoders.com/155/155784.jpg");
}
</style>


