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

                            <div class="row" style="margin-bottom: 20px">
                                <div class="col-md-12">
                                    <div class="col-md-2">
                                        <img v-if="image!=''" v-bind:src="image" class="img-responsive">
                                        <img v-if="image==''" v-bind:src="myAvatar" class="img-responsive">
                                    </div>
                                    <div class="col-md-8">
                                        <input type="file" v-on:change="onFileChange" class="form-control">
                                    </div>
                                    <div class="col-md-2">
                                        <button class="btn btn-success btn-block" v-on:click.prevent="upload()">Upload</button>
                                    </div>
                                </div>
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
                                <label for="nickname" class="col-md-4 control-label">Nickname</label>

                                <div class="col-md-6">
                                    <input id="userPass" v-model="userNick" class="form-control" name="nickName" required>

                                </div>
                            </div>


                            <div class="form-group">
                                <div class="col-md-8 col-md-offset-4">
                                    <button type="submit" class="btn btn-primary" v-on:click.prevent="saveUser">
                                        Update
                                    </button>
                                    <router-link class="btn btn-primary" to="/play" v-on:click.prevent="cancelEdit">Cancel</router-link>
                                </div>
                            </div>
                        </form>
                    </div>
                    <!-- INFO Menu -->

                    <div v-if="activeTab=='access'">
                        <!-- Access Menu -->

                        <form class="form-horizontal">

                            <h2>Reset Access Password:</h2>

                            <div class="form-group">
                                <label for="password" class="col-md-4 control-label">Old Password</label>

                                <div class="col-md-6">
                                    <input id="userPass" v-model="oldPassword" type="password" class="form-control" name="password" required>

                                </div>
                            </div>



                            <div class="form-group">
                                <label for="password" class="col-md-4 control-label">New Password</label>

                                <div class="col-md-6">
                                    <input id="userPass" v-model="newPassword" type="password" class="form-control" name="password" required>

                                </div>
                            </div>


                            <div class="form-group">
                                <label for="password" class="col-md-4 control-label">Retype Password</label>

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

                    </div>
                    <!-- Access Menu -->

                    <div v-if="activeTab=='account'">
                        <!-- Account Menu -->

                        <h2>Shure that you want to remove your account?</h2>
                        <h6 v-if="this.$store.getters.getAdmin==true">Admin account cannot be removed!</h6>

                        <div class="form-group">
                            <div class="col-md-8 col-md-offset-4">
                                <button v-if="this.$store.getters.getAdmin==false" type="submit" class="btn btn-primary" v-on:click.prevent="removeAccount">
                                    Remove
                                </button>
                                <router-link class="btn btn-primary" to="/play">Cancel</router-link>


                            </div>





                        </div>
                        <!-- Account Menu -->


                    </div>
                    <!--"panel-body"-->
                </div>
                <!--"panel-default"-->
            </div>
            <!--"col-md-8 c"-->
        </div>
        <!--"row"-->
    </div>
    <!--container-->

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
                userName: this.$store.getters.getName,
                userEmail: this.$store.getters.getEmail,
                config: {
                    headers: this.$store.getters.getHeaders
                },
                image: '',
                files: undefined

            }
        },




        methods: {

            onFileChange(e) {
                this.files = e.target.files || e.dataTransfer.files;
                if (!this.files.length)
                    return;
                this.createImage(this.files[0]);
            },
            createImage(file) {
                let reader = new FileReader();
                let vm = this;
                reader.onload = (e) => {
                    vm.image = e.target.result;
                };
                reader.readAsDataURL(file);
            },
            upload() {
               /*  console.log(this.files[0]);
                console.log(this.image); */
                //axios.post('/api/users/updateavatar/' + this.$store.getters.getID,{image: this.image}).then(response => {
                /*  axios.post('/api/users/updateavatar/' + this.$store.getters.getID,{image: this.files[0]}).then(response => {

                 }); */

                axios.post('/api/users/updateavatar/' + this.$store.getters.getID, {
                    image: this.image
                }).then(response => {
                    if (response.status === 200) {
                        axios.get("api/users/getuserbymail/" + this.$store.getters.getEmail, {
                                headers: this.$store.state.user.headers
                            })
                            .then(response => {
                                this.$store.commit('setAvatar', response.data[0].avatar);
                            });
                    }

                });
            },

            saveUser: function () {
                var user = {
                    name: this.userName,
                    email: this.userEmail,
                    nickname: this.userNick
                }
                axios.put('api/users/' + this.$store.getters.getID, user)
                    .then(response => {
                        if (response.status === 200) {
                            this.$store.commit('setNickname', this.userNick);
                            this.$store.commit('setName', this.userName);
                            this.$store.commit('setEmail', this.userEmail,);

                           /*  axios.get("api/users/getuserbymail/" + this.$store.getters.getEmail, {
                                    headers: this.$store.getters.getHeaders
                                })
                                .then(response => {
                                    console.log(response);

                                    this.$store.commit('setNickname', response.data[0].nickname);
                                    this.$store.commit('setName', response.data[0].name);
                                    this.$store.commit('setEmail', response.data[0].email);
                                }); */
                            alert("User Saved");

                        }
                        // Copy object properties from response.data.data to this.user
                        // without creating a new reference
                        //Object.assign(user, response.data.data);
                        //this.$emit('user-saved', this.user)

                    });
            },

            cancelEdit: function(){
	        	axios.get('api/users/'+this.user.id)
	                .then(response=>{
	                	// Copy object properties from response.data.data to this.user
	                	// without creating a new reference
	                	//Object.assign(this.user, response.data.data);
	                	alert("Edit canceled");
	                });
	        },




            handleClick(tab, event) {

                this.activeTab = tab.name;
                //console.log("Active Tab:" + tab.name);
            },

            resetPass() {

                /* console.log("UserID:" + this.currentUserID);
                console.log("UserID:" + this.oldPassword); */

                axios.post('api/users/validatepass/' + this.currentUserID, {
                        password: this.oldPassword
                    })
                    .then(response => {

                        if (response.data.msg == "ok") this.checkedPass = true;
                        else {
                            this.checkedPass = false;
                            alert("Old password invalid!");
                        }

                    });



                if (this.newPassword == this.rePassword) {
                    if (this.checkedPass) {
                        axios.put('api/users/updatepass/' + this.currentUserID, {
                                password: this.newPassword
                            }, this.config)
                            .then(response => {




                                alert("Password changed Successfully!");
                                this.clearPassForm();

                            });
                    }

                } else {

                    alert("New passwords don't match!");
                }




            },

            clearPassForm() {

                this.oldPassword = '';
                this.newPassword = '';
                this.rePassword = '';
                this.checkedPass = '';


            },


            removeAccount() {


                var config = {
                    headers: {
                        Authorization: this.$store.state.user.headers.Authorization,
                        Accept: "application/json"
                    }
                };
                //console.log("USERID: " + this.currentUserID);
                axios.delete('api/users/', {
                    params: {
                        id: this.currentUserID
                    }
                }).then(response => {
                    //alert("Your account ahs been deleted!");
                    //console.log("Output: " + response.data);
                });


                axios.post('api/logout', config).then(response => {

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

            myAvatar() {
                return "img/avatars/" + this.$store.getters.getAvatar;
            }



        },
        components: {

            'nav-bar': NavBar,

        },
        mounted() {}
    }
</script>