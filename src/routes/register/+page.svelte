<script lang="ts">
  import { enhance } from "$app/forms";

  export let form
</script>

<div class="login-wrapper">
  <div class="title">
		<p class="title-trash">TRASH</p>
		<p class="title-munchers">MUNCHERS</p>
	</div>
	<div class="form-wrapper">
	<!-- get error message -->
	{#if form?.success === false}
		<br>
		<div class="success-wrapper">
			<span class="fail-text">{form.message}</span>
		</div>
	{/if}
	<form class="form" method="POST" use:enhance>
		<div class="inputbox">
			<input name="username" type="text" required>
			<label for="">Username</label>
		</div>
		<div class="inputbox">
			<input name="email" type="email" required>
			<label for="">Email</label>
		</div>
		<div class="inputbox">
			<input name="password" type="password" required>
			<label for="">Password</label>
		</div>
		<div class="inputbox">
			<input name="confirm-password" type="password" required>
			<label for="">Confirm Password</label>
		</div>
		<div class="team-select">
			<center><label for="">Pick a team!</label><br>
			<select name="team" class="team" required>
				<optgroup>
					<option value="Red">Red</option>
					<option value="Blue">Blue</option>
					<option value="Green">Green</option>
				</optgroup>
			</select></center>
		</div>
		<div class="register-button">
			<center><button>Register</button></center>
		</div>
	</form>
	<div class="privacy-wrapper">
		<center><span class="privacy-text"><br>By registering an account you agree to be bound by our Privacy Policy</span></center>
	</div>
	</div>
</div>

<style>	

	* {
		/* clearing default paddings & margins */
		margin: 0px;
		padding: 0px;
	}
	
	.login-wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
    	height: 80%;
	    display: flex;
	    flex-direction: column;
		justify-content: center;
	}
	
	.success-wrapper {
		margin: auto;
		text-align: center;
		width: 70%;
	}
	
	.fail-text {
		color: red;
		font-family: 'Montserrat', sans-serif;
		font-size: 1.1rem;
	}
	
	.form-wrapper {
		background: #ECECEC;
		border-radius: 1.5rem;
		padding: 20px 25px;
		box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.4);
	}
	
	.form {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(4, 2fr), 1fr;
		gap: 1rem;
		grid-template-areas: /* template to demonstrate how sections fit */
		". ."
		". ."
		". ."
		"button button";

	  }

	.title {
		display: grid;
		grid-template-rows: repeat(2, 1fr);
		font-family: "Bubbler One", sans-serif;
		font-size: 6rem;
		letter-spacing: 7px;
		text-align: center;
		margin: 15px;
	}

	.title-trash {
		font-weight: bold;
		transform: translate(-8rem, 1rem);
	}

	.title-munchers {
		transform: translate(3rem, 0rem);
	}
	
	.privacy-text {
		position: relative;
		transform: translateY(-10%);
		font-size: 1rem;
		font-family: "Montserrat", sans-serif;
	}
	
	.privacy-wrapper {
		position: relative;
		margin: auto;
		width: 300px;
	}

	.inputbox {
		position: relative;
		margin: 30px 0px;
		border-bottom: 2px solid #000;
	}

	.inputbox label {
		position: absolute;
		top: 50%;
		left: 1.5%;
		transform: translateY(-50%);
		color: #8C8C8C;
		pointer-events: none;
		transition: .5s;
		font-family: "Montserrat", sans-serif;
		font-weight: 400;
		font-size: 1.3em;
	}

	input:focus ~label,
	input:valid ~label {
		top: -15%; /* allows animation of form */
		color: #000;
	}

	.inputbox input {
		width: 100%;
		height: 50px;
		background: transparent;
		border: none;
		outline: none;
		color: #000;
		font-family: "Montserrat", sans-serif;
		font-weight: 400;
		font-size: 1.2em;
	}
	
	.team {
		width: 50%;
		font-family: "Montserrat", sans-serif;
		font-size: 0.7em;
	}

	.team-select {
		font-family: "Montserrat", sans-serif;
		font-weight: 400;
		font-size: 1.3em;
		display: flex;
		flex-direction: column;
	}

	button {
		height: 50px;
		cursor: pointer;
		display: flex;
		border: none;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border-radius: 20px;
		font-family: 'Montserrat', sans-serif;
		font-size: 1.2rem;
		background-color: #B5D3D2;
		transition: all 0.5s;
		padding: 0 30px;
		width: 180px;
		text-decoration: none;
		color: black;
	}
	
	button:hover {
		background-color: #DFC9B5;
		border-radius: 22px;
		transition: all 0.5s ease 0.0s;
	}

	@media screen and (max-width: 600px) { /* change based on device */
		.title {
			font-size: 4rem;
		}	

		.title-trash {
			font-weight: bold;
			transform: translate(-4.25rem, 1rem);
		}

		.title-munchers {
			transform: translate(0.75rem, 0rem);
		}
		
		button {
			font-size: 1rem;
			width: 100px;
		}
	}

	@media screen and (max-width: 350px) {
		.title {
			font-size: 3rem;
		}	

		.title-trash {
			font-weight: bold;
			transform: translate(-2.5rem, 1rem);
		}

		.title-munchers {
			transform: translate(0rem, 0rem);
		}
		button {
			font-size: 1rem;
			width: 100px;
		}
	}
</style>
