<script lang="ts">
	export let data
	
	function reloadImages(event) {
		location.reload()
		alert("reloaded")
	}

	async function denyButton(event) {
		let data = {
			"id": Number(this.id)
		}

		await fetch("http://38.242.137.81:8000/api/images/delete-image/", {
			method: 'POST',
			body: JSON.stringify(data),
			mode: "cors",
			headers: {"content-type": "application/json; charset=UTF-8"}
		})
		// .then((response) => response.json().then((out) => {
		// 	console.log(out);
		// }))

		alert(JSON.stringify(data))

		location.reload()
		alert("reloaded")
		// alert(JSON.stringify(data))
	}
	
	function acceptButton(event) {
		reloadImages(event)
	}
	
</script>

<div class = "grid">
	{#each data.images as i}
		<div class = "item">
			<img src={i.image}>
			<button type="button" class="deny" id={i.id} on:click={denyButton}>X</button>
			<button type="button" class="accept" id={i.id} on:click={acceptButton}>A</button>
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