<script lang="ts">
	var count = 0
	let item = [] // array of divs
	let grid, remove, body
	
	function addDiv(event) {
		count += 1
		
		var clone = item[0].cloneNode(true)
		var removeButton = remove.cloneNode(true)
		
		clone.id = "item" + count
		grid.appendChild(clone)
				
		var image = document.createElement("img")
		image.style.height = "100%"
		
		// example of changing image source below
		
		/*if (count == 1) {
			image.src = '/images/the-blowup-t06aN6vewaQ-unsplash.jpg'
		}
		
		if (count == 2) {
			image.src = '/images/tempmap.png'
		}*/
		
		clone.appendChild(image)
		
		removeButton.style.visibility = "visible";
		clone.appendChild(removeButton)
		
		removeButton.onclick = function() {
			this.parentNode.remove()
			count -= 1
		}
		
		item[count] = clone // can now reference using item[count]
	}
</script>

<div class = "grid" bind:this={grid}>
	<div class = "add">
		<button type="button" name="add" on:click={addDiv}>+</button>
	</div>
</div>

<div class = "item" bind:this={item[count]}>
	<!-- template div -->
</div>

<button type="button" class="remove" bind:this={remove} style="visibility: hidden;">X</button>

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
		max-height: 100%;
		height: 50%;

	}
	
	.item > img {
		height: 100%; /* ensures image fits in grid */
	}
	
	.add {
		position: absolute;
		top: 100%;
		left: 100%;
	}
</style>