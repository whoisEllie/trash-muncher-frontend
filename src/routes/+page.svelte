<script lang="ts">
</script>

<div class="home-wrapper">
	<div class="home_page">
		<div class="title">
			<p class="title-trash">TRASH</p>
			<p class="title-munchers">MUNCHERS</p>
		</div>
		<p class="description">A location based "cookie-clicker" type game to <br>promote sustainability at University of Exeter</p>
		<a class="start" href="/play">Let's go!</a>
	</div>
</div>

<style>

	* {
		/* clearing default paddings & margins */
		margin: 0px;
		padding: 0px;
	}

	.home-wrapper {
		position: absolute;
		display: flex;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		align-items: center;
		justify-content: center;
	}

	.home_page {
		height: 60%;
		max-width: 1080px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
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
	
	.description {
		text-align: center;
		font-family: 'Chilanka', cursive;
		font-size: 1rem;
		letter-spacing: 0.2vw;
	}
		
	.start {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border-radius: 15px;
		font-family: 'Chilanka', cursive;
		font-size: 1.5rem;
		background-color: #B5D3D2;
		box-shadow: 0px 0px 16px #00000044;
		transition: all 0.5s;
		padding: 0 50px;
		min-width: 140px;
		max-width: 540px;
		height: 70px;
		margin: 25px auto;
		text-decoration: none;
		color: black;
	}

	.start:hover {
		background-color: #DFC9B5;
		border-radius: 25px;
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

		.start {
			font-size: 1rem;
			min-width: 80px;
			height: 60px;
		}
	}

</style>
