<script lang="ts">
	import { Loader } from '@googlemaps/js-api-loader';
	import { onMount } from 'svelte';
	import {AmbientLight,DirectionalLight,PerspectiveCamera,Scene,WebGLRenderer,Raycaster,Vector2,Matrix4,MathUtils,AnimationMixer} from 'three';
	import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
	import ThreejsOverlayView from '@ubilabs/threejs-overlay-view';
    import { enhance } from '$app/forms';


	/** @type {import('./$types').PageData} */
	export let data;


	var errorMessage: string = "Awaiting map.";
    let latForm: number;
    let lngForm: number;
	var map;
	let formChoice=0;
	var gameData = [];
	let monster = {}, t1score=0,t2score=0,t3score=0, forms;
	var overlay: ThreejsOverlayView;
	var vector = new Vector2();
	var mixer: AnimationMixer;
	const gltfLoader = new GLTFLoader();

	onMount(() => {
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
			intersections.forEach(element => {
				gameData.forEach(m => {
					//detects that the correct monster has been clicked, then sets it as the current monster
					if (m.model==element.object.parent){
						monster=m.monster;
						t1score=monster.Team1_Score;
						t2score=monster.Team2_Score;
						t3score=monster.Team3_Score;
						element.object.material.color.r=0.06;
						
					}
					else{
						if(element.object.material.color.r==0.06){
							m.model.children[2].material.color.r=0.8227857351303101;
						}
					}
				});
				//sets form to choose whether to add or update the monster's score
                formChoice=2;
			});
			}
			else{
				//clicked on map directly, sets up form for creating a new monster
                latForm=event.latLng.lat();
                lngForm=event.latLng.lng();
				formChoice=1;
			}
		})

		const animate = () => { //cool animations :)
			gameData.forEach(element => {
				element.model.rotateZ(MathUtils.degToRad(0.2));
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

function drawMonsters(scene){
	//loads the gltf models
	data.monsters.forEach(element => {
		gltfLoader.load("https://raw.githubusercontent.com/googlemaps/js-samples/main/assets/pin.gltf", (gltf) => {
			let vector = overlay.latLngAltToVector3({lat:element.Latitude,lng:element.Longitude})
			gltf.scene.position.set(vector.x,vector.y,vector.z);
    		gltf.scene.scale.set(30, 30, 30);

			//will initialise the animations for each monster here
			mixer = new AnimationMixer(gltf.scene);

			gltf.scene.rotation.x = Math.PI; // Rotations are in radians.
			scene.add(gltf.scene);
			//sets the monsters to an array to access later
			gameData.push({"monster":element,"model":gltf.scene})
		})
		
	});
	return scene;
}

	
</script>


<div class="map-modal">
	<div class="below_map">
		<!--Forms to add monsters, change score and add score
		formChoice 1 - Adding a new monster to the map, with name, latitude and longitude
		formChoice > 1 - Shows radio buttons to select which of the two score forms to use
		formChoice 3 - Updating the monsters score. Has default values as the current scores
		formChoice 4 - Adds score to the monster. Defaults to 0.
		-->

		{#if formChoice == 1}
		<form method="POST" action="?/newMonster" use:enhance id="monsterForm">
			<label for="mName">Monster Name:</label>
			<input name="mName">
			<label for="latitude">Latitude: </label><br>
            <input name="latitude" value={latForm}>
			<label for="latitude">Longitude: </label>
            <input name="longitude" value={lngForm}>
			<button>Submit new monster!</button>
		</form>
		{:else if formChoice > 1}
				<label for="scoreType"> Change Scores</label>
				<input name="scoreType" type="radio" on:click={() => {formChoice=3}}>
				<label for="scoreType">Add Scores</label>
				<input name="scoreType" type="radio" on:click={() => {formChoice=4}}>
		
		{#if formChoice == 3}
			<form method="POST" id="updateScore" action="?/updateScore" use:enhance>
				<label for="t1score">Team 1</label>
				<input type="number" name="t1score" value={t1score}><br>
				<label for="t2score">Team 2</label>
				<input type="number" name="t2score" value={t2score}><br>
				<label for="t3score">Team 3</label>
				<input type="number" name="t3score" value={t3score}>
				<input type="hidden" name="id" value={monster.TM_ID}>
				<button>Update Scores!</button>
			</form>
		{:else if formChoice == 4}
			<form method="POST" id="addScore" action="?/addScore" use:enhance>
				<label for="t1score">Team 1</label>
				<input type="number" name="t1score" value=0><br>
				<label for="t2score">Team 2</label>
				<input type="number" name="t2score" value=0><br>
				<label for="t3score">Team 3</label>
				<input type="number" name="t3score" value=0>
				<input type="hidden" name="id" value={monster.TM_ID}>
				<button>Add Scores!</button>
			</form>
		{/if}
		{/if}
	</div>

	
	<div id="mapAwait">
	  <p id="awaitText">{errorMessage}</p>
	</div>
	<div id="mapContainer">
	  <div id="map">
	</div>
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
		border-radius: 25px;
		overflow: hidden;
		box-shadow: 0px 0px 21px rgba(0, 0, 0, 0.5);
		background-color: #61846F;
	}

	#map {
		height: 60vh; /* The height is 400 pixels */
		width: 50vw; /* The width is the width of the web page */
		z-index: -1;
		float: right;
		position: absolute;

	}

	#mapAwait {
		height: 60vh; /* The height is 400 pixels */
		width: 50vw; /* The width is the width of the web page */
		z-index: -1;
		float: right;
		position: absolute;
		top:50%;
		left:65%;
		transform: translate(-50%,-50%);
	}

	#mapContainer {
		height: 60vh; /* The height is 400 pixels */
		width: 50vw; /* The width is the width of the web page */
		z-index: -1;
		box-shadow: 0px 4px 30px #272727;
		float: right;
		position: absolute;
		top:50%;
		left:65%;
		transform: translate(-50%,-50%);
	}

	#awaitText{
		text-align: center;
		font-size: 32px;
		font-family: "Montserrat", sans-serif;
		position: absolute;
		top:50%;
		left:50%;
		transform: translate(-50%,-50%);
	}

	.below_map {
		width:30%;
		list-style-type: none;
		text-align: center;
		float: left;
		position: absolute;
	}

	.mapButton {
		float: left;
		padding: 12px;
		text-decoration: none;
		font-size: 17px;
		width: 33.33%; /* Four links of equal widths */
		text-align: center;
		height: 75px;
		border: none;
		cursor: pointer;
		background-color: white;
	}

	.mapButton:hover {
		background-color: #F0F0F0;
	}

	#errorText{
		font-size: 1.2em;
		width: max-content;
		background-color: red;
		position: absolute;
		width: 50vw; /* The width is the width of the web page */
		font-family: "Montserrat", sans-serif;

	}

	#status{
		font-family: "Montserrat", sans-serif;
		text-align: center;
		font-size: larger;
	}

</style>