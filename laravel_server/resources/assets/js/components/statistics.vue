<template>
	<div>
		<nav-bar></nav-bar>
		<div class="jumbotron">
			<h1>{{ title }}</h1>
		</div>

			<el-tabs v-model="activeTab"  name="statsMenu" @tab-click="changeMenuTab">
    		<el-tab-pane label="Global Stats" name="globalStats">
			</el-tab-pane>
			<el-tab-pane label="My Stats" name="userStats">
			</el-tab-pane>
	 		</el-tabs>

		<div class="alert alert-success" v-if="showSuccess">

			<button type="button" class="close-btn" v-on:click="showSuccess=false">&times;</button>
			<strong>{{ successMessage }}</strong>
		</div>
		 



		 		<!-- GLOBAL STATISTICS -->




		 		<div  v-if="activeTab=='globalStats'">
			 <h2 align ="center">Games</h2>

		
		 		<table class="table table-striped">
	    <thead>
	        <tr>
	            <th>Finished</th>
	            <th>Pending</th>
				      <th>Active</th>
				      <th>Canceled</th>
				      <th>Total</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr>
				<td>  {{termGames}}</td>
				<td>  {{pendGames}}</td>
				<td>  {{actGames}}</td>
				<td>  {{cancGames}}</td>
				<td>  {{termGames + pendGames + actGames + cancGames}}</td>
	        </tr>
	    </tbody>
	</table>
	

		 <h2 align ="center">Top Users <h4>({{totUsers}}) in total</h4></h2>

			 <h3 align ="center">Top High Score</h3>

		 		<table class="table table-striped">
	    <thead>
	        <tr>
	            <th>Position</th>
	            <th>User</th>
				      <th>Score</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr v-for="(score,i) in top5Scores" :key="i">
	            <td>{{i+1}}</td>
	           	<td>{{ score.nickname }}</td>
				<td>{{ score.totalscore  }}</td>
	        </tr>
	    </tbody>
	</table>


				 <h3 align ="center">Top High Games</h3>

		 		<table class="table table-striped">
	    <thead>
	        <tr>
	            <th>Position</th>
	            <th>User</th>
				      <th>Games</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr v-for="(game, i) in top5Games" :key="i">
	            <td>{{i+1}}</td>
	           	<td>{{ game.nickname }}</td>
							<td>{{ game.games  }}</td>
	        </tr>
	    </tbody>
	</table>

				 <h3 align ="center">Top High Average</h3>


		 		<table class="table table-striped">
	    <thead>
	        <tr>
	            <th>Position</th>
	            <th>User</th>
							<th>Average</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr v-for="(game, i) in top5Avg" :key="i">
	            <td>{{i+1}}</td>
	           	<td>{{ game.nickname }}</td>
							<td>{{ game.average  }}</td>
	        </tr>
	    </tbody>
	</table>

		</div>



		<!-- USER STATISTICS -->


					<div  v-if="activeTab=='userStats'">
						<table class="table table-striped">
	    <thead>
	        <tr>
	            <th>Games</th>
	            <th>Victories</th>
							<th>Defeats</th>
							<th>Draws</th>
							<th>Avagare</th>
							<th>Score</th>


	        </tr>
	    </thead>
	    <tbody>
	        <tr>
	            <td>{{userGames}}</td>
	           	<td>{{userVictories}}</td>
							<td>{{userDefeats}}</td>
							<td>{{userDraws}}</td>
							<td>{{userAvg}}</td>
							<td>{{userScore}}</td>
	        </tr>
	    </tbody>
	</table>

			</div>


		
	</div>
</template>

<script type="text/javascript">
import UserList from "./userList.vue";
import UserEdit from "./userEdit.vue";
import NavBar from "./navBar.vue";

export default {
  data: function() {
    return {
      activeTab: "globalStats",
      title: "Statistics",
      showSuccess: false,
      successMessage: "",
      termGames: 0,
      pendGames: 0,
      actGames: 0,
      cancGames: 0,
      top5Scores: [],
      top5Games: [],
      top5Avg: [],
			totUsers: 0,
			userGames: 0,
		  userVictories: 0,
		  userDefeats: 0,
		  userDraws: 0,
		  userAvg: 0,
		  userScore: 0

			
    };
  },
  methods: {
    getGamesResults() {
      axios.get("api/games/terminatedgames").then(response => {
        console.log("Terminated:" + response.data);
        this.termGames = response.data;
      });

      axios.get("api/games/pendgames").then(response => {
        console.log("Pending:" + response.data);
        this.pendGames = response.data;
      });
      axios.get("api/games/activegames").then(response => {
        this.actGames = response.data;
        console.log("active:" + response.data);
      });

      axios.get("api/games/canceledgames").then(response => {
        this.cancGames = response.data;
        console.log("Canceled:" + response.data);
      });
    },

    getTopS5cores() {
      axios.get("api/games/gettop5scores").then(response => {
        this.top5Scores = response.data;
      });
    },
    getTopGames() {
      axios.get("api/games/gettop5games").then(response => {
        this.top5Games = response.data;
        console.log(this.top5Games);
      });
    },

    getTop5Avg() {
      axios.get("api/games/gettop5average").then(response => {
        this.top5Avg = response.data;
        console.log(this.top5Avg);
      });
    },

    getTotUsers() {
      axios.get("api/users/contusers").then(response => {
        this.totUsers = response.data;
        console.log(this.totUsers);
      });
		},
		
		 refreshUserStats(userID) {



      axios.get("api/games/countusergames/" + userID).then(response => {
				this.userGames = response.data;
					console.log("Games:" + this.userGames);
			});

			axios.get("api/games/countuservictories/" + userID).then(response => {
				this.userVictories = response.data;
					console.log("Victories:" + this.userVictories);
			});


			axios.get("api/games/countuserdraws/" + userID).then(response => {
				this.userDraws = response.data;
					console.log("Draws:" + this.userDraws);
			});


			axios.get("api/games/countuserdefeats/" + userID).then(response => {
				this.userDefeats = response.data;
					console.log("Defeats:" + this.userDefeats);
			});

			axios.get("api/games/countuserscore/" + userID).then(response => {
				this.userScore = response.data;
					console.log("Score:" + this.userScore);
			});

			axios.get("api/games/countuseravg/" + userID).then(response => {
				this.userAvg = response.data;
					console.log("Avg:" + this.userAvg);
			});


    },


		changeMenuTab(tab, event){
				if(tab.name=="userStats") this.refreshUserStats($store.state.user.nickname);


		},
 
    refreshGlobalStats() {
      this.getGamesResults();
      this.getTopS5cores();
      this.getTopGames();
      this.getTotUsers();
			this.getTop5Avg();
			

    }
  },

  components: {
    "nav-bar": NavBar
  },
  computed: {},
  beforeMount() {},
  beforeCreated() {},
  created() {},
  mounted() {
    this.refreshGlobalStats();
  }
};
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>