<script lang="ts">
	export let data // get images data to load
	
	function reloadImages(event) {
		location.reload()
	}
	
	var submitted = false
	
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
				<input type="hidden" name="tm" value={i.monster_id}>
				
				{#if !submitted}
					<button type="submit" class="deny" formaction="?/deny" style="border: 0; on:click={submitted = true}
					background: transparent; cursor: pointer;">
						<img src="/images/deny.png" width="30" height="30" />
					</button>
				{:else}
					<button type="submit" class="deny" style="border: 0; background: transparent; cursor: pointer;">
						<img src="/images/deny.png" width="30" height="30" />
					</button>
				{/if}
			</form>

			<form method="POST" action="?/accept">
				<input type="hidden" name="id" value={i.id}>
				<button type="submit" class="accept" formaction="?/accept" style="border: 0; background: transparent; cursor: pointer;">
					<img src="/images/accept.png" width="30" height="30" />
				</button>
			</form>
		</div>
	{/each}
</div>
<div class = "refresh">
	<button type="button" name="add" on:click={reloadImages} style="border: 0; background: transparent; cursor: pointer;">
		<img src="/images/refresh.png" width="30" height="30" />
	</button>
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
		height: 350px;
		width: 270px;
	    box-shadow: 0px 0px 16px #00000044;
	}
	
	.item > img {
		z-index: 1;
		height: 100%; /* ensures image fits in grid */
		width: 100%;
		object-fit: cover;
	}
	
	.refresh {
		position: fixed;
		top: 14.9%;
		left: 7.1%;
	}
	
	.deny {
		z-index: 2;
		position: absolute;
		top: 93%;
		right: -3%;
		background-color: transparent;
		outline: none;
	}
	
	.accept {
		z-index: 2;
		position: absolute;
		top: 93%;
		right: 30px;
	}
	
	button {
	}
	button span {
		display: none;
	}
	
	@media screen and (max-width: 635px) {
		.item{
			margin-bottom: 20px;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>