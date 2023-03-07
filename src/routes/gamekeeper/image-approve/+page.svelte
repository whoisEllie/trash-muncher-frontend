<script lang="ts">
	var count = 0
	let item = [] // array of divs
	let grid, remove, body
	
	function addDiv(event) {
		count += 1
		var clone = item[0].cloneNode(true)
		var cloneButton = remove.cloneNode(true)
		
		clone.id = "item" + count
		grid.appendChild(clone)
		clone.appendChild(cloneButton)
		
		cloneButton.onclick = function() {
			this.parentNode.remove();
			count -= 1
		}
		
		item[count] = clone // can now reference using item[count]
	}
</script>

<body>
	<div class = "grid" bind:this={grid}>
		<div class = "add">
			<button type="button" name="add" on:click={addDiv}>+</button>
		</div>
	</div>
	<div class = "item" bind:this={item[count]}>
		<!-- add whatever here -->
	</div>
	<button type="button" name="remove" bind:this={remove}>X</button>
</body>

<style>
	.grid {
		position: absolute;
		width: 70%;
		height: 80%;
		display: grid;
		grid-template-columns: repeat(4, 1fr); /* change 4 to change number of cols/rows (16x16 currently) */
		grid-template-rows: repeat(4, 1fr);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #FFFFFF;
	}
	
	.item{
		background-color: #DEDEDE;
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