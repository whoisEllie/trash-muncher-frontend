<script lang="ts">

	let testImages = [
		{id: '0', image: '/images/the-blowup-t06aN6vewaQ-unsplash.jpg'},
		{id: '1', image: '/images/tempmap.png'}
	]
	
	function loadImages() {
		// do stuff here
	}
	
	function removeButton(event) {
		this.parentNode.remove()
	}
</script>

<div class = "grid">
	<div class = "refresh">
		<button type="button" name="add" on:click={loadImages}>+</button>
	</div>
	{#each testImages as i}
		<div class = "item">
			<img src={i.image}>
			<button type="button" class="remove" on:click={removeButton}>X</button>
		</div>
	{/each}
</div>

<style>
	.grid {
		position: absolute;
		width: 70%;
		height: 80%;
		display: flex;
		flex-flow: wrap;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #FFFFFF;
	}
	
	.item{
		height: 50%;
	}
	
	.item > img {
		height: 100%; /* ensures image fits in grid */
	}
	
	.refresh {
		position: absolute;
		top: 100%;
		left: 100%;
	}
</style>