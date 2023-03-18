<script lang="ts">
	export let form
</script>

<div class="login-wrapper">
  <div class="title">
		<p class="title-trash">TRASH</p>
		<p class="title-munchers">MUNCHERS</p>
	</div>
  <div class="form-wrapper">
	{#if form?.success === false}
	<br>
	<div class="success-wrapper">
		<span class="fail-text">{form.message}</span>
	</div>
	{/if}
  <form class="form" method="POST">
		<div class="inputbox">
			<input name="username" type="text" required>
			<label for="">Username</label>
		</div>
		<div class="inputbox">
			<input name="password" type="password" required>
			<label for="">Password</label>
		</div>
		<a href="/forgot-password" class="forgot-password">Forgot password?</a><br>
  <button>Log in</button>
  </form>
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
		padding-bottom: 10px;
	}
	
	.fail-text {
		color: red;
		font-family: 'Montserrat', sans-serif;
		font-size: 1.1rem;
	}

	.form-wrapper {
		background: #ECECEC;
		border-radius: 1.5rem;
		padding-top: 35px;
		box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.4);	
	}
	
	.form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
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
		margin: 25px 0px;
		border-bottom: 2px solid #000; /* line under input box */
	}

	.inputbox label {
		position: absolute;
		top: 50%;
		left: 1.5%;
		transform: translateY(-50%);
		color: #8C8C8C;
		pointer-events: none;
		transition: .5s; /* animates form so text moves up */
		font-family: "Montserrat", sans-serif;
		font-weight: 400;
		font-size: 1.3em;
	}

	input:focus ~label,
	input:valid ~label {
		top: -15%; /* move text up */
		color: #000; /* fades text in from placeholder style*/
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
		margin-top: 10px;
		margin-bottom: 20px;
	}
	
	button:hover {
		background-color: #DFC9B5;
		border-radius: 22px;
		transition: all 0.5s ease 0.0s;
	}
	
	a:link {
		text-decoration: none;
	}
	
	.forgot-password {
		color: black;
		font-size: 1.1rem;
		font-family: "Montserrat", sans-serif;
	}
	
	.forgot-password:hover {
		color: #977453;
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
