<script lang="ts">
	import type { LayoutData } from "./$types";

	function reload() {
		location.reload();
	}
	export let data: LayoutData;
</script>

<!-- TODO: Implement hamburger menu for mobile layout -->

<div class="wrapper">
	<div class="container">
 		<div class="images">
			<img src="/images/green.png" alt="A green blob in the top left corner of the screen" class="green" />
			<img src="/images/red.png" alt="A red blob in the bottom left corner of the screen" class="red" />
			<img src="/images/pale.png" alt="A pale brown blob in the bottom right corner of the screen" class="pale" />
  	</div>
		<div class="header">
			<a href="/" class="home">Home</a>
			<a href="/about" class="about">About</a>
			{#if data.logged_in}
				<a href="/logout" class="login">Logout</a>
			{:else}
				<a href="/login" class="login">Login</a>
			{/if}
			{#if data.logged_in}
				<label class="username">{data.username}</label>
			{:else}
				<a href="/register" class="register">Register</a>
			{/if}
		</div>
	</div>
	<img src="/images/left_plant.png" alt="An inked plant in the bottom left of the screen" class="left_plant"/>
	<img src="/images/right_plant.png" alt="An inked plant in the bottom right of the screen" class="right_plant"/>
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
		font-size: 1rem;
		text-decoration: none;
		padding: 5px 15px;
	}
	
	.username {
		font-family: "Montserrat", sans-serif;
		font-weight: 500;
		font-size: 1rem;
		text-decoration: none;
		padding: 5px 15px;
		float: right;
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

	@media screen and (max-width: 600px) {
		.green {
			width: 58%;
		}

		.red {
			width: 30%;
			height: 20%;
		}

		.pale {
			width: 48%;
			height: 27%;
		}

		.left_plant {
			width: 0%;
		}

		.right_plant {
			width: 0%;
		}

		a {
			font-size: 0.75rem;
		}
	}

	@media screen and (max-width:  450px) {
		.container {
			width: 100vw;
			height: 100vh;		
			height: 100svh; /* svh (small view height) helps to keep buttons visible below dynamic elements on mobile browsers. There's a regular vh above for compatibility */
		}

		a {
			font-size: 0.65rem;
		}

	}

</style>
