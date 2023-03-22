<script lang="ts">
	export let data // get images data to load
	
	function reloadImages(event) {
		location.reload()
	}
	
	let removeButton, form, popup = false, currentItem
	let item = []
	
	function freezeForm(e) {
		if (form.classList.contains('is-submitting')) {
			e.preventDefault();
		}
		
		form.classList.add('is-submitting');
	}
	
	function addDiv(citem) {
		currentItem = citem
		popup = true
	}
	
	function removeDiv(e) {
		popup = false
	}
	
	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}
</script>

<div class = "grid">
	<!-- svelte for loop -->
	{#each data.images as i, index}
		<div class = "item" bind:this="{item[index]}">
			{#if popup == true && currentItem == item[index]}
				<div class="trash-size" on:mouseleave="{removeDiv}">
					<form method="POST" action="?/accept" bind:this={form}>
						<input type="hidden" name="id" value={i.id}>
						<input type="hidden" name="team" value={i.team}>
						<input type="hidden" name="score" value=0>
						<input type="hidden" name="carbon" value={70 + getRandomInt(10)}>
						<input type="hidden" name="tm" value={i.monster_id}>
						<button type="submit" class="trash" on:click={freezeForm}>Small trash</button>
					</form>
					<form method="POST" action="?/accept" bind:this={form}>
						<input type="hidden" name="id" value={i.id}>
						<input type="hidden" name="team" value={i.team}>
						<input type="hidden" name="score" value=1>
						<input type="hidden" name="carbon" value={240 + getRandomInt(10)}>
						<input type="hidden" name="tm" value={i.monster_id}>
						<button type="submit" class="trash" on:click={freezeForm}>Medium trash</button>
					</form>
					<form method="POST" action="?/accept" bind:this={form}>
						<input type="hidden" name="id" value={i.id}>
						<input type="hidden" name="team" value={i.team}>
						<input type="hidden" name="score" value=2>
						<input type="hidden" name="carbon" value={490 + getRandomInt(10)}>
						<input type="hidden" name="tm" value={i.monster_id}>
						<button type="submit" class="trash" on:click={freezeForm}>Large trash</button>
					</form>
				</div>
			{/if}
			<img src={i.image} on:mouseover="{removeDiv}">
			<form method="POST" action="?/deny" bind:this={form}>
				<!-- hidden form to load data into server side API call -->
				<input type="hidden" name="id" value={i.id}>
				<input type="hidden" name="team" value={i.team}>
				<input type="hidden" name="tm" value={i.monster_id}>
				
				<button type="submit" class="deny" formaction="?/deny" style="border: 0;
				background: transparent; cursor: pointer;" bind:this="{removeButton}" on:click={freezeForm} on:mouseover="{removeDiv}">
						<img src="/images/deny.png" width="30" height="30" />
				</button>
			</form>
			<form method="POST" action="?/accept">
				<input type="hidden" name="id" value={i.id}>
				<div class="accept" on:mouseover="{addDiv(item[index])}"><img src="/images/accept.png" width="30" height="30" /></div>
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
		top: 0%;
		z-index: 0;
		height: 100%; /* ensures image fits in grid */
		width: 100%;
		position: absolute;
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
		width: 30px;
		height: 30px;
		z-index: 2;
		position: absolute;
		top: 93.5%;
		right: 30px;
	}
	
	.trash-size {
		position: relative;
		left: 37%;
		top: 43%;
		z-index: 1;
		height: 200px;
		width: 170px;
		background-color: #e0e0e0;
		border-radius: 15px;
	}
	
	.trash {
		margin-left: 10px;
		margin-top: 17.5px;
		padding: 10px 10px 10px 10px;
		font-family: "Montserrat", sans-serif;
		font-size: 1.2rem;
		border: none;
		border-radius: 10px;
		background-color: #B5D3D2;
		transition: all 0.5s ease 0.0s;
		cursor: pointer;
	}
	
	.trash:hover {
		background-color: #DFC9B5;
		transition: all 0.5s ease 0.0s;
	}
	
	@media screen and (max-width: 635px) {
		.item{
			margin-bottom: 20px;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>
