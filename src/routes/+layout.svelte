<script>

</script>

<!-- TODO: Implement hamburger menu for mobile layout -->

<div class="wrapper">
	<div class="container">
 		<div class="images">
   		<img src="green.png" class="green" />
    	<img src="red.png" class="red" />
    	<img src="pale.png" class="pale" />
  	</div>
		<div class="header">
			<a href="/" class="home">Home</a>
			<a href="/about" class="about">About</a>
			<a href="/login" class="login">Login</a>
			<a href="/register" class="register">Register</a>
		</div>
	</div>
	<img src="left_plant.png" class="left_plant"/>
  <img src="right_plant.png" class="right_plant"/>
</div>

<slot></slot>

<style>
	@import url('https://fonts.googleapis.com/css?family=Montserrat:500');
	@import url('https://fonts.googleapis.com/css?family=Montserrat:400');
	@import url('https://fonts.googleapis.com/css2?family=Bubbler+One&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Chilanka&display=swap');
	
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	
	.wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		background-color: #61846F;
	}
		
	.container {
		position: absolute;
		width: calc(100vw - 50px); /* this way, the margins are equal regardless of aspect ratio */
		height: calc(100vh - 50px);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #D9D9D9;
		box-shadow: 0px 0px 20px #00000088;
	}

	.images { 
		position: absolute;
	}

	.green {
		width: 28%;
		position: fixed;
		top: 0;
		left: 0;
		display: inline-block;
	}

	.red {
		position: fixed;
		bottom: -2px; /* Alignment issue, leave it at -2 */
		left: 0;
		width: 30%;
		height: 40%;
		display: inline-block;
	}

	.pale {
		width: 48%;
		height: 87%;
		position: fixed;
		bottom: 0;
		right: 0;
		display: inline-block;
	}

	.left_plant {
		width: 14%;
		position: fixed;
		bottom: 0px;
		left: 0px;
		display: inline-block;
	}

	.right_plant {
		width: 17.5%;
		position: fixed;
		bottom: 0;
		right: 0;
		display: inline-block;
	}

	.header {
		align-items: center;
		padding: 20px 10px 0px 10px;
		position: relative;
	}

	a {
		font-family: "Montserrat", sans-serif;
		font-weight: 500;
		font-size: 0.75rem;
		text-decoration: none;
		padding: 5px 15px;
	}
	
	.home {
		color: #FFFFFF;
		float: left;
	}

	.home:hover {
		color: #FCDFC4;
	}

	.about {
		color: #FFFFFF;
		float: left;
	}

	.about:hover {
		color: #FCDFC4;
	}

	.register {
		color: #000000;
		float: right;
	}

	.register:hover {
		color: #977453;
	}

	.login {
		color: #000000;
		float: right;
	}

	.login:hover {
		color: #977453;
	}

</style>
