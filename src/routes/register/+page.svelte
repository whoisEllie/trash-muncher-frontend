<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  export let form: ActionData;
</script>

<div class="login-wrapper">
  <div class="title">
		<p class="title-trash">TRASH</p>
		<p class="title-munchers">MUNCHERS</p>
	</div>
		<form class="form" method="POST" use:enhance>
			<div class="inputbox">
				<input name="username" type="text" required>
				<label for="">Username</label>
			</div>
			<div class="inputbox">
				<input name="fname" type="text" required>
				<label for="">First Name</label>
			</div>
			<div class="inputbox">
				<input name="lname" type="text" required>
				<label for="">Last Name</label>
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
				<label for="">Pick a team!</label>
				<select name="team" required>
					<option value="Red">Red</option>
					<option value="Blue">Blue</option>
					<option value="Green">Green</option>
				</select>
			</div>
			<button>Register</button>
			{ #if form?.error }
				<div class="notice-error">
					{form.error}
				</div>
			{/if}
	</form>
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
	
	.form {
		background: #ECECEC;
		border-radius: 1.5rem;
		padding: 20px 25px;
		box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.4);
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(3, 2fr), 1fr;
		gap: 1rem;
		grid-template-areas: 
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
		top: -15%;
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

	.team-select {
		font-family: "Montserrat", sans-serif;
		font-weight: 400;
		font-size: 1.3em;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	button {
		grid-area: button;
		height: 40px;
		cursor: pointer;
	}

	@media screen and (max-width: 600px) {
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
	}
</style>
