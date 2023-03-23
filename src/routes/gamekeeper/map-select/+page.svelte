<script lang="ts">
	import { Loader } from '@googlemaps/js-api-loader';
	import { onMount } from 'svelte';
	import {AmbientLight,DirectionalLight,PerspectiveCamera,Scene,WebGLRenderer,Raycaster,Vector2,Matrix4,MathUtils,AnimationMixer} from 'three';
	import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
	import ThreejsOverlayView from '@ubilabs/threejs-overlay-view';
    import { enhance } from '$app/forms';


	/** @type {import('./$types').PageData} */
	export let data;
	export let form;


	var errorMessage: string = "Awaiting map.";
    let latForm: number;
    let lngForm: number;
	var map;
	let formChoice=0;
	var gameData = [];
	let monster = {}, t1score=0,t2score=0,t3score=0, forms, monsters = data.monsters;
	var overlay: ThreejsOverlayView;
	var vector = new Vector2();
	var mixer: AnimationMixer;
	const gltfLoader = new GLTFLoader();

	onMount(async () => {
		createMap(50.72506135303006,-3.5306954520836453);
	})
	
	async function createMap(latitude: number, longitude: number) {
		//creates loader to get the map from the api
		const loader = new Loader({
		apiKey:  "AIzaSyAjhTLsegGf1Zz7wgAU506zeXw2pHRUqe0",
		version: "weekly",
		libraries: ["places"],
	});
	
	//sets settings for the gamekeeper map page. Gives them full control over the map so they can place monsters anywhere
	const mapOptions = {
		center: {
			lat: latitude,
			lng: longitude
		},
		tilt: 45,
		zoom: 15,
		disableDefaultUI: true,
		mapId: '805b0b106a1a291d'
	}

	await loader
		.load()
		.then((google) => {
			//only draws onto map when the map has loaded in the promise
			map = new google.maps.Map(document.getElementById("map") as HTMLElement, mapOptions);
			let scene = initWebglOverlayView(map);
			scene = drawMonsters(scene);
		})
		.catch((e) => {
			//do something :sparkle:
		});
	}

	//WebGL initialisation. Loads all the models onto the map
	function initWebglOverlayView(map) {
  		let camera:PerspectiveCamera;

		overlay = new ThreejsOverlayView({lat:0,lng:0});
		overlay.setMap(map);

		const scene = overlay.getScene();
    	camera = new PerspectiveCamera();

		//adds light to the models so they show colour
    	const ambientLight = new AmbientLight(0xffffff, 0.75); // Soft white light.
    	scene.add(ambientLight);
    	const directionalLight = new DirectionalLight(0xffffff, 0.25);
    	directionalLight.position.set(0.5, -1, 0.5);
    	scene.add(directionalLight);

    	// Sets a reference point for drawing onto the map (dont change its kinda important for setting relative points)
		overlay.setReferencePoint({lat:50.75646948193597, lng:-3.5397420013942633})
		
		//creates a listener to detect mouse clicks onto the map. Raycasts for 3d objects, and shows coordinates when clicking everywhere else
		map.addListener('click', (event) => {
			const {domEvent} = event;
    		const {left, top, width, height} = map.getDiv().getBoundingClientRect();
    		const x = domEvent.clientX - left;
    		const y = domEvent.clientY - top;
    		vector.x = 2 * (x / width) - 1;
    		vector.y = 1 - 2 * (y / height);
			overlay.requestRedraw();
			//detects if you click onto an object
			const intersections = overlay.raycast(vector);

			if(intersections.length>0){
			let clicked = false;
			formChoice=2;
			intersections.forEach(element => {
				gameData.forEach(m => {
					//detects that the correct monster has been clicked, then sets it as the current monster
					m.model.children[0].material.color.r=0.8227857351303101;
					if (m.model==element.object.parent){
						monster=m.monster;
						element.object.material.color.r=0.06;
						clicked=true;
						addHTML()
					}
				});
			});
			} else {
			 	latForm=event.latLng.lat();
                lngForm=event.latLng.lng();
				formChoice=1;
				gameData.forEach(m => {
					//detects that the correct monster has been clicked, then sets it as the current monster
					m.model.children[0].material.color.r=0.8227857351303101;
				})
				monster = {}
			}
		})

		const animate = () => { //cool animations :)
			gameData.forEach(element => {
				element.model.rotateY(MathUtils.degToRad(0.2));
			});
			overlay.requestRedraw();
  			

  			requestAnimationFrame(animate);
		};

		overlay.update = () => {
};

		// start animation loop
		requestAnimationFrame(animate);
		return scene;
}

let spans = []
// display leaderboard information
function addHTML() {
	spans = []
	let scores = []
	let sortedScores = []
	// add monsters to array along with team id
	scores.push("" + monster.Team1_Score + 1)
	scores.push("" + monster.Team2_Score + 2)
	scores.push("" + monster.Team3_Score + 3)
	scores.sort((a,b)=>b-a)
	var order = []
	for (var i = 0; i < scores.length; i++) {
		// sorting array so winning team is on top
		if (scores[i] % 10 == 1) {
			sortedScores.push("Red Score: " + Math.floor(scores[i]/10))
			order[i] = "red"
		}
		if (scores[i] % 10 == 2) {
			sortedScores.push("Green Score: " + Math.floor(scores[i]/10))
			order[i] = "green"
		}
		if (scores[i] % 10 == 3) {
			sortedScores.push("Blue Score: " + Math.floor(scores[i]/10))
			order[i] = "blue"
		}
	}
	
	for (var i = 0; i < sortedScores.length; i++) {
		var team = order[i]
		var span = document.createElement('span')
		if (order[i] == "red") {
			span.style.color = "#EA6E6E"
		}
		if (order[i] == "blue") {
			span.style.color = "#6285DC"
		}
		if (order[i] == "green") {
			span.style.color = "#6DC462"
		}
		span.innerHTML = sortedScores[i]
		spans.push(span.outerHTML)
	}
}

function drawMonsters(scene){
	//loads the gltf models
	monsters.forEach(element => {
		try {
			gltfLoader.load("../models/" + element.TM_Name + ".glb", (gltf) => {
				let vector = overlay.latLngAltToVector3({lat:element.Latitude,lng:element.Longitude})
				gltf.scene.position.set(vector.x,vector.y,40);
	    		gltf.scene.scale.set(50, 50, 50);
				gltf.scene.rotation.x = Math.PI/2; // Rotations are in radians.
				scene.add(gltf.scene);
				gameData.push({"monster":element,"model":gltf.scene})
			})
		} catch(error) {
			// monster model does not exist
		}
		
	});
	return scene;
}

	function setOverwrite() {
		formChoice = 3;
	}

	function setAddTo() {
		formChoice = 4;
	}

	
</script>


<div class="map-modal">

	<div class="map-form">
		<!--Forms to add monsters, change score and add score
		formChoice 1 - Adding a new monster to the map, with name, latitude and longitude
		formChoice > 1 - Shows radio buttons to select which of the two score forms to use
		formChoice 3 - Updating the monsters score. Has default values as the current scores
		formChoice 4 - Adds score to the monster. Defaults to 0.
		-->
			{#if formChoice == 0}
				{#if form?.success == true}
					<br><br><br>
					<div class="success-wrapper">
						<center><span class="success-text">{form.message}</span></center>
					</div>
				{:else if form?.success == false}
					<br><br><br>
					<div class="success-wrapper">
						<center><span class="fail-text">{form.message}</span></center>
					</div>
				{/if}
				<div class="no-selection">
					Click anywhere on the map to add a new monster. Click on an existing monster to adjust It's scores.
				</div>
			{/if}
			{#if formChoice == 1}
				<form method="POST" action="?/newMonster" id="monsterForm">
					<label for="latitude">Location:</label>
					<input name="latitude" id="latitude" value={latForm} style="border-radius: 10px 10px 0px 0px;">
						<input name="longitude" id="longitude" value={lngForm} style="border-radius: 0px 0px 10px 10px;">
					<label for="TM_Name" class="TM_Label">Pick a name for this location:</label>
						<input name="TM_Name" id="TM_Name" class="TM_Name" required>
					<button>Add a new monster!</button>
				</form>
			{:else if formChoice > 1}
				<div class="change-add-scores">
					<button on:click={setOverwrite} style="border-radius: 10px 0px 0px 10px;">Overwrite</button>
					<button on:click={setAddTo} style="border-radius: 0px 10px 10px 0px;">Add to</button>
				</div>
			{#if formChoice == 3}
				<form method="POST" id="updateScore" action="?/updateScore">
					<label for="t1score">Team 1</label>
						<input type="number" name="t1score" value={t1score}>
					<label for="t2score">Team 2</label>
						<input type="number" name="t2score" value={t2score}>
					<label for="t3score">Team 3</label>
						<input type="number" name="t3score" value={t3score}>
						<input type="hidden" name="id" value={monster.TM_ID}>
					<button>Overwrite Scores!</button>
				</form>
			{:else if formChoice == 4}
				<form method="POST" id="addScore" action="?/addScore">
					<label for="t1score">Team 1</label>
					<input type="number" name="t1score" value=0>
					<label for="t2score">Team 2</label>
					<input type="number" name="t2score" value=0>
					<label for="t3score">Team 3</label>
					<input type="number" name="t3score" value=0>
					<input type="hidden" name="id" value={monster.TM_ID}>
					<button>Add to Scores!</button>
				</form>
			{/if}
			{/if}
		</div>

	<!--	
	<div id="mapAwait">278740cca7ef
	  <p id="awaitText">{errorMessage}</p>
	</div>
	-->
	<div id="map" class="map">
	{#if Object.keys(monster).length > 0}
		<div class="monsterScore">
			<!-- display leaderboard with information -->
			Name: {monster.TM_Name}<br>
			<!-- sveltekit loop (for items) -->
			{#each spans as item}
				{@html item}<br>
			{/each}
			<br>
			Carbon consumed
			<br>
			<span style="color: #EA6E6E">R: {monster.Team1_Carbon}g</span>
			<br><span style="color: #6285DC">B: {monster.Team2_Carbon}g</span>
			<br><span style="color: #6DC462">G: {monster.Team3_Carbon}g</span>
		</div>
		{/if}
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css?family=Montserrat:500');
	@import url('https://fonts.googleapis.com/css?family=Montserrat:400');
	@import url('https://fonts.googleapis.com/css2?family=Bubbler+One&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Chilanka&display=swap');

	* {
		margin: 0;
		padding: 0;
		font-family: Montserrat;
	}

	.map-modal {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 85vw;
		height: 75vh;
		display: grid;
		grid-template-columns: 2fr 7fr;
		grid-template-areas: "Form Map";
		border-radius: 25px;
		overflow: hidden;
		box-shadow: 0px 0px 21px rgba(0, 0, 0, 0.5);
		background-color: #E1E1E1;
	}

	.map {
		height: 100%; 
		width: 100%;
		grid-area: Map; /* displays in Map template area (map-modal) */
	}

	.no-selection {
		margin: 25px;
		font-weight: 500;
	}

	.map-form form {
		display: grid;
		margin: 25px 0px;
		grid-area: Form; /* displays in Form template area */
	}

	.map-form form input {
		margin: 2px 25px;
		border: none;
		padding: 10px 5px;
		border-radius: 10px;
		background-color: #ECECEC;
	}

	.map-form form input:focus {
		display: flex;
		justify-content: center;
		align-items: bottom;
		background-color: #FCFCFC;
	}

	.map-form form label {
		margin: 15px 25px 0px 25px;
		height: 25px;
		vertical-align: bottom;
		font-size: 14px;
		font-weight: 450;
	}

	.map-form form button {
		height: 50px;
		margin: 15px 25px;
		border-radius: 10px;
		border: none;
		background-color: #F2DBC6;
		cursor: pointer;
		transition: all 0.5s ease 0.0s;
		font-weight: 500;
	}

	.change-add-scores {
		margin: 25px 25px -25px 25px;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		height: 50px;
	}

	.change-add-scores button {
		border: none;
		margin: 1px;
		cursor: pointer;
		transition: all 0.2s; /* allows button colour fade/shape change to be animated */
	}

	.change-add-scores button:hover {
		background-color: #B5D3D2;
		transition: all 0.2s; /* allows button colour fade/shape change to be animated */
	}

	.map-form form button:hover {
		border-radius: 15px;
		background-color: #B5D3D2;
		transition: all 0.5s ease 0.0s;
	}
	
	.monsterScore {
		float: right;
		background-color: #E0E0E0;
		position: relative;
		width: fit-content; /* ensures div isn't too big */
		padding: 10px 20px 10px 10px;
		font-size: 1.1em;
		box-shadow: 0px 0px 16px #00000044;
		border-radius: 15px;
		font-family: "Montserrat", sans-serif;
	}
	
	.success-wrapper {
		margin: auto;
		width: fit-content;
		padding-left: 20px;
		padding-right: 20px;
		margin-top: -15px;
	}
	
	.success-text {
		position: relative;
		color: green;
	}
	
	.fail-text {
		position: relative;
		color: red;
	}
	
	.TM_Label {
		position: relative;
		z-index: 3; /* ensures text appears over input box (different device settings) */
		text-align: center;
	}

	@media screen and (max-width: 750px) {
		.map-modal {
			grid-template-columns: auto;
			grid-template-rows: 7fr 2fr;
			grid-template-areas: 
			"Map"
			"Form";
			padding-bottom: 25px;
		}

		.map-form form input {
			padding: 5px 5px;
		}

		.map-form form label {
			font-size: 12px;
			height: 15px;
		}

		.change-add-scores {
			height: 30px;
		}
		
		.success-wrapper {
			margin-top: -20px;
		}
	}

	@media screen and (max-width: 450px) {
		.map-modal {
			height: 92.5vh;
			height: 92.5svh;
			width: 100vw;
			border-radius: 15px 15px 0px 0px;
			bottom: 0;
			transform: translate(-50%, -46.125%);
		}
	}

</style>
