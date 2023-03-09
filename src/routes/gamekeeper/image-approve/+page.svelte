<script lang="ts">
	export let data
	
	function reloadImages(event) {
		location.reload()
	}
	function denyButton(event) {
		this.parentNode.remove()
	}
	
	function acceptButton(event) {
		this.parentNode.remove()
	}
	
</script>

<div class = "grid">
	{#each data.images as i}
		<div class = "item">
			<img src={i.image}>
			<button type="button" class="deny" on:click={denyButton}>X</button>
			<button type="button" class="accept" on:click={acceptButton}>A</button>
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
		display: flex;
		flex-flow: wrap;
		overflow-x: hidden;
		overflow-y: auto;
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