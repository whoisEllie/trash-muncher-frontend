<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
    let url = ``;
	export let form
    onMount(async () => {
		url = window.location.href
		if(form?.success) {
			setTimeout(function () {goto('/login')}, 5000)
		}
	});
</script>

<div class="login-wrapper">
  <div class="title">
		<p class="title-trash">TRASH</p>
		<p class="title-munchers">MUNCHERS</p>
	</div>
  <form class="form" method="POST">
  		<br>
		<div class="inputbox">
			<input name="password" type="password" required>
			<label for="">Enter a new password</label>
		</div>
		<div class="inputbox">
			<input name="cpassword" type="password" required>
			<label for="">Confirm new password</label>
		</div>
		<input name="path" value={url} hidden>
		{#if form?.success} 
			<div class="success-wrapper">
				<span class="success-text">{form.message}</span>
			</div>
			<br>
		{/if}
		{#if form?.success == false}
			<div class="success-wrapper">
				<span class="fail-text">{form.message}</span>
			</div>
			<br>
		{/if}
  <button type="submit">Reset Password</button>
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
		padding-top: 20px;
		padding-bottom: 35px;
		box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.4);
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
		margin: 35px 0px;
		border-bottom: 2px solid #000; /* line under input box */
	}

	.inputbox label {
		white-space: nowrap;
		position: absolute;
		top: 50%;
		left: 0%;
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
		width: 250px;
		text-decoration: none;
		color: black;
		margin-top: 10px;
		margin-bottom: 20px;
	}
	
	.success-wrapper {
		text-align: center;
		width: 70%;
	}
	
	.success-text {
		color: green;
		font-family: 'Montserrat', sans-serif;
		font-size: 1.1rem;
	}
	
	.fail-text {
		color: red;
		font-family: 'Montserrat', sans-serif;
		font-size: 1.1rem;
	}
	
	button:hover {
		background-color: #DFC9B5;
		border-radius: 22px;
		transition: all 0.5s ease 0.0s;
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
