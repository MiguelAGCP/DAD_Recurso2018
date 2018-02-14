<template>


<div class="container">

    	<nav-bar></nav-bar>
		<div class="jumbotron">
			<h1>{{ title }}</h1>
		</div>

 <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Account Settings</div>
                <div class="panel-body">


  <el-tabs type="card" @tab-click="handleClick">
    <el-tab-pane name="info" label="Info"></el-tab-pane>
    <el-tab-pane name="access" label="Access"></el-tab-pane>
    <el-tab-pane name="account" label="Account"></el-tab-pane>
  </el-tabs>


                <div v-if="activeTab=='info'">
    <!-- INFO Menu -->

                    <div class="row"  style="margin-bottom: 20px">
                        <div class="col-md-10 col-md-offset-1">
                             <img :src="myAvatar" style="width:150px; height:150px; float:left; border-radius:50%; margin-right:25px;">
                             <h2>{{this.$store.getters.getNickname}}'s Profile</h2>
                                   <form enctype="multipart/form-data" action="/api/users/updateavatar/" method="POST">
                                        <label>Update Profile Image</label>
                                        <input type="file" name="avatar">
                                        <input type="hidden" name="_token" value="">
                                    <!--    <input type="submit" class="pull-right btn btn-sm btn-primary">-->
                                        <a class="btn btn-success" >Update</a>
                                    </form>


                    
                        </div>
                    </div>



                    <form class="form-horizontal">
                        
                                 <div class="form-group">
                                    <label for="name" class="col-md-4 control-label">Name</label>

                                    <div class="col-md-6">
                                        <input input id="userLogin" v-model="userName" class="form-control" name="name" value="" required autofocus> 

                              
                                    </div>
                                 </div>


                        <div class="form-group">
                            <label for="email" class="col-md-4 control-label">E-Mail Address</label>

                            <div class="col-md-6">
                                <input input id="userLogin" v-model="userEmail" type="email" class="form-control" name="login" value="" required autofocus> 

                              
                            </div>
                        </div>


                        <div class="form-group">
                            <label for="nickname" class="col-md-4 control-label" >Nickname</label>

                            <div class="col-md-6">
                                <input id="userPass" v-model="userNick"  class="form-control" name="nickName" required>

                            </div>
                        </div>


                        <div class="form-group">
                            <div class="col-md-8 col-md-offset-4">
                                <button type="submit" class="btn btn-primary" v-on:click.prevent="registerUser">
                                    Update
                                </button>
                                <router-link class="btn btn-primary" to="/play" v-on:click.prevent="cancelEdit">Cancel</router-link>
                            </div>
                        </div>
                    </form>
                </div> <!-- INFO Menu -->

                <div v-if="activeTab=='access'">
    <!-- Access Menu -->   

                    <form class="form-horizontal">

                        <h2>Reset Access Password:</h2>

                        <div class="form-group">
                            <label for="password" class="col-md-4 control-label" >Old Password</label>

                            <div class="col-md-6">
                                <input id="userPass" v-model="oldPassword" type="password" class="form-control" name="password" required>

                            </div>
                        </div>



                        <div class="form-group">
                            <label for="password" class="col-md-4 control-label" >New Password</label>

                            <div class="col-md-6">
                                <input id="userPass" v-model="newPassword" type="password" class="form-control" name="password" required>

                            </div>
                        </div>


                        <div class="form-group">
                            <label for="password" class="col-md-4 control-label" >Retype Password</label>

                            <div class="col-md-6">
                                <input id="userPass" v-model="rePassword" type="password" class="form-control" name="rPassword" required>

                            </div>
                        </div>



                        <div class="form-group">
                            <div class="col-md-8 col-md-offset-4">
                                <button type="submit" class="btn btn-primary" v-on:click.prevent="resetPass">
                                    Reset
                                </button>
                                <router-link class="btn btn-primary" to="/play" v-on:click.prevent="cancelPass">Cancel</router-link>

                              
                            </div>
                        </div>
                    </form>

                </div><!-- Access Menu -->   

                <div v-if="activeTab=='account'">
    <!-- Account Menu -->   

                <h2>Shure that you want to remove your account?</h2>
                <h6 v-if="this.$store.getters.getAdmin==true">Admin account cannot be removed!</h6>

                       <div class="form-group">
                            <div class="col-md-8 col-md-offset-4">
                                <button v-if="this.$store.getters.getAdmin==false" type="submit" class="btn btn-primary" v-on:click.prevent="removeAccount">
                                    Remove
                                </button>
                                <router-link class="btn btn-primary" to="/play" >Cancel</router-link>

                              
                            </div>





                </div><!-- Account Menu -->   


                    </div><!--"panel-body"-->
            </div><!--"panel-default"-->
        </div><!--"col-md-8 c"-->
    	</div><!--"row"-->
		</div><!--container-->

</div>


</template>
<script>

        import VueRouter from "vue-router";
        var router = new VueRouter();
        import NavBar from './navBar.vue';
    
    export default {
        		props: ['user'],

        data: function () {
			return {
                title: 'User Account',
                activeTab: 'info',
                oldPassword: '',
                newPassword: '',
                rePassword: '',
                currentUserID: this.$store.getters.getID,
                checkedPass: '',
                uploadFieldName: 'photos',
			    userNick: this.$store.getters.getNickname,
                userNname: this.$store.getters.getName,
                userEmail: this.$store.getters.getEmail,
                config: { headers: this.$store.getters.getHeaders},

			}
		},


     
    
     methods: {



    handleClick(tab, event) {

            this.activeTab = tab.name;
            console.log("Active Tab:" + tab.name);
      },

         updateAvatar(){

             //axios.post('api/users/updateAvatar')
            this.$router.push("/useraccount");
      

         },


            resetPass(){

                console.log("UserID:" + this.currentUserID);
                console.log("UserID:" + this.oldPassword);

                axios.post('api/users/validatepass/' + this.currentUserID, {password: this.oldPassword})
                .then(response=>{

                        if(response.data.msg=="ok" ) this.checkedPass = true;
                        else{
                             this.checkedPass = false;
                             alert("Old password invalid!");
                        }

                });
                
                
                
               if(this.newPassword == this.rePassword)
                {
                    if(this.checkedPass){
                   axios.put('api/users/updatepass/'+this.currentUserID, {password:this.newPassword}, this.config)
                   .then(response=>{

                        

                        
                        alert("Password changed Successfully!");
                        this.clearPassForm();

                   });
                }

                }else{

                    alert("New passwords don't match!");
                }




         },

    	     clearPassForm(){

                this.oldPassword ='';
                this.newPassword = '';
                this.rePassword= '';
                this.checkedPass= '';

             
             },


             removeAccount(){


          var config = {
            headers: {
              Authorization: this.$store.state.user.headers.Authorization,
              Accept: "application/json"
            }
          };
                 console.log("USERID: " + this.currentUserID);
                 axios.delete('api/users/',{ params: {id: this.currentUserID }}).then(response=>{
                 //alert("Your account ahs been deleted!");
                console.log("Output: " + response.data);
                   });
                
       
              axios.post('api/logout', config).then(response=>{

                    this.$store.commit('setNickname', "");
                    this.$store.commit('setID', ""); 
                    this.$store.commit('setRefreshToken', "");
                    this.$store.commit('setHeaders', "");
                    sessionStorage.clear();
                    return this.$router.push("/index");
            });
            
            },     
                
     },
     computed: {

          myAvatar(){
             return "img/avatars/" + this.$store.getters.getAvatar;
         }
      


     },
     components:{

         'nav-bar': NavBar,

     },
     mounted(){
     }
    }
</script>