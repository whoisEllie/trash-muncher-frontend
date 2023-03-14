<script lang="ts">
	export let data // get images data to load
	
	function reloadImages(event) {
		location.reload()
	}
	
</script>

<div class = "grid">
	<!-- svelte for loop -->
	<!-- TODO: CSS for buttons so they look nicer -->
	{#each data.images as i}
		<div class = "item">
			<img src={i.image}>
			<form method="POST" action="?/deny">
				<!-- hidden form to load data into server side API call -->
				<input type="hidden" name="id" value={i.id}>
				<input type="hidden" name="team" value={i.team}>
				<input type="hidden" name="tm" value={i.monster}>

				<button type="submit" class="deny" formaction="?/deny">X</button>
			</form>

			<form method="POST" action="?/accept">
				<input type="hidden" name="id" value={i.id}>
				<button type="submit" class="accept" formaction="?/accept">A</button>
			</form>
		</div>
	{/each}
	<div class = "refresh">
		<button type="button" name="add" on:click={reloadImages}>+</button>
	</div>
</div>

<style>
	.grid {
		position: absolute;
		width: 85%;
		height: 70%;
		display: flex; /* images are loaded from top left to bottom right in flex */
		flex-flow: wrap;
		overflow-x: hidden;
		overflow-y: auto; /* allows vertical scrolling in the div */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	
	.item{
		position: relative;
		height: 50%;
	    box-shadow: 0px 0px 16px #00000044;
	}
	
	.item > img {
		z-index: 1;
		height: 100%; /* ensures image fits in grid */
	}
	
	.refresh {
		position: absolute;
		top: 0%;
		left: 0%;
	}
	
	.deny {
		z-index: 2;
		position: absolute;
		top: 95%;
		right: 0%;
	}
	
	.accept {
		z-index: 2;
		position: absolute;
		top: 95%;
		right: 30px;
	}
</style>