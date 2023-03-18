<script lang="ts">
	export let data;
</script>

<div class="home-wrapper">
	<div class="home_page">
		<div class="title">
			<p class="title-trash">TRASH</p>
			<p class="title-munchers">MUNCHERS</p>
		</div>
		<p class="description">A location-based game to promote <br>sustainability at the University of Exeter</p>
		{#if data?.gamekeeper === true}
			<div class="button-wrapper">
				<a class="buttons" href="/gamekeeper/map-select">Add monsters</a>
				<a class="buttons" href="/gamekeeper/image-approve">Approve images</a>
			</div>
		{:else}
			<a class="start" href="/play">Let's go!</a>
		{/if}
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
		grid-template-rows: repeat(2, 1fr); /* splits into rows (layout is nicer this way) */
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
	
	.button-wrapper {
		display: grid;
		grid-template-areas:
		". .";
	}
		
	.start {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border-radius: 20px;
		font-family: 'Chilanka', cursive;
		font-size: 1.5rem;
		background-color: #B5D3D2;
		box-shadow: 0px 0px 16px #00000044;
		transition: all 0.5s; /* allows button colour fade/shape change to be animated */
		padding: 0 50px;
		width: fit-content;
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


	.buttons {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border-radius: 20px;
		font-family: 'Chilanka', cursive;
		font-size: 1.5rem;
		background-color: #B5D3D2;
		box-shadow: 0px 0px 16px #00000044;
		transition: all 0.5s; /* allows button colour fade/shape change to be animated */
		padding: 0 25px;
		width: fit-content;
		height: 70px;
		margin: 25px auto;
		text-decoration: none;
		color: black;
	}

	.buttons:hover {
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
		
		.buttons {
			margin: 10px;
			font-size: 1.3rem;
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
		
		.buttons {
			font-size: 1rem;
			min-width: 80px;
			height: 60px;
		}
		
		.button-wrapper {
			margin: auto;
			margin-top: 20px;
			justify-items: center;
			grid-template-areas:
			"."
			".";
		}
	}

</style>
