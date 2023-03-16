<script lang="ts">
	import { Loader } from '@googlemaps/js-api-loader';
	import { onMount } from 'svelte';
	import {AmbientLight,DirectionalLight,PerspectiveCamera,Scene,WebGLRenderer,Raycaster,Vector2,Matrix4,MathUtils} from 'three';
	import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
	import ThreejsOverlayView from '@ubilabs/threejs-overlay-view';
    import { enhance } from '$app/forms';


	/** @type {import('./$types').PageData} */
	export let data;

	var locationTracking=true;
	var errorMessage: string = "Awaiting map.";
	var map;
	var overlay;
	var vector = new Vector2();
	let monster={}
	var gameData = [];
	const gltfLoader = new GLTFLoader();
	
	onMount(() => {
		getPosition().then((position: Position) =>{
  			createMap(position.coords.latitude,position.coords.longitude);
		}).then(()=>{
			setInterval(()=>{
				if(locationTracking){
					navigator.geolocation.getCurrentPosition(success)}},3000);
			setInterval(getMonsters,6000);
		}).catch(() => {
				errorMessage = "Location access blocked, please enable."
		})
	})

	function success(position){
		//updates the current player position
		map.setCenter({lat:position.coords.latitude,lng:position.coords.longitude})
	}

	function getPosition(){
		//tries to get permission for location access if needed, or initially loads a position to start with
		//promise ensures no loading can take place until completed
  		return new Promise((resolve,reject) => {
    		navigator.geolocation.getCurrentPosition(resolve,reject,{maximumAge: 100,enableHighAccuracy:true})
  		});
	}

	function getMonsters(){

	}

	async function createMap(latitude: number, longitude: number) {
		//creates loader to get the map from the api
		const loader = new Loader({
		apiKey:  "AIzaSyAjhTLsegGf1Zz7wgAU506zeXw2pHRUqe0",
		version: "weekly",
		libraries: ["places"],
	});
	//sets settings for the player map. removes most control so they can't go exploring
	const mapOptions = {
		center: {
			lat: latitude,
			lng: longitude
		},
		tilt: 30,
		zoom: 18,
		//zoomControl: false,
        gestureHandling: "cooperative",
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
			intersections.forEach(element => {
				gameData.forEach(m => {
					//detects that the correct monster has been clicked, then sets it as the current monster
					if (m.model==element.object.parent){
						if(!clicked){
						monster=m.monster;
						element.object.material.color.r=0.06;
						clicked=true;
						}
					}
					else{
						if(element.object.material.color.r==0.06){
							m.model.children[2].material.color.r=0.8227857351303101;
						}
					}
				});
			});
			}
		})

		const animate = () => { //cool animations
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
    		gltf.scene.scale.set(50, 50, 50);
			gltf.scene.rotation.x = Math.PI; // Rotations are in radians.
			scene.add(gltf.scene);
			gameData.push({"monster":element,"model":gltf.scene})
		})
		
	});
	return scene;
}

function showCampus(){
	locationTracking=!locationTracking;
	if(locationTracking==false){
		map.setCenter({lat:50.736830961444106, lng:-3.532572733972099})
		map.setZoom(15);
	}
	else{
		navigator.getCurrentPosition
		map.setZoom(18)
	}
}


var image = null;
var error = false
let fileinput, nameText
// placeholder text before submitting image
var name = "Select Image"
	
const onFileSelected =(e)=> {
	let tempImage = e.target.files[0];
	// get file name
	name = e.target.files[0].name;
	// ensure name isn't too long on display
	if (name.length > 17) {
		name = name.slice(0, 17) + "..."
	}
	let reader = new FileReader();
	if (e.target.files[0].size > 4194304) {
		error = true
		image = null
		name = "File size too big! Please submit a file below 4mb!"
	} else {
		error = false
		reader.readAsDataURL(tempImage);
		reader.onload = e => {
			// display uploaded image
			image = e.target.result
	    };
	}
}
	
</script>


<!-- pre loads hover image -->
<link rel="preload" as="image" href="/images/upload_hover.png">
<link rel="preload" as="image" href="/images/upload_hover_mobile.png">
<div class="map-wrapper">
	<div class="submit-image">
		{#if monster.name}
			<p>{monster.name}</p>
		{/if}
		<div class="image-display">
	        {#if image}
				<center><img class="image" src="{image}" alt="d" /></center>
	        {:else}
	        	<center><img class="no-image" src="/images/no_file.png" alt="" /></center>
	        {/if}
			<br>
			<div class="upload-container">
				<center><img class="upload" src="/images/upload.png" alt="" on:click={()=>{fileinput.click();}} /></center>
				{#if error !== true}
			        <span class="upload-click" on:click={()=>{fileinput.click();}} bind:this={nameText}>{name}</span>
				{:else}
					<span class="upload-click-error" on:click={()=>{fileinput.click();}} bind:this={nameText}>{name}</span>
				{/if}
			</div>
			<form method="POST" action="?/uploadImage" enctype="multipart/form-data" use:enhance>
		        <input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput}
				name="file">
				<br>
				<center><button type="submit" class="button">Submit Image</button></center>
			</form>
		</div>
	</div>
	<div class="map-modal">	
		<div id="mapAwait">
			<p id="awaitText">{errorMessage}</p>
		</div>
		<div id="mapContainer">
			<div id="map">
			</div>
			<div class="below_map">
				<button class="mapButton" on:click="{showCampus}">View Campus</button>
				<button class="mapButton">Change Zoom</button>
			</div>
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
		position: absolute; /* stays in fixed position */
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%); /* centers the map */
		width: 85vw;
		height: 80vh;
		display: grid;
		grid-template-columns: 2fr 7fr;
		grid-template-rows: auto;
		border-radius: 25px;
		box-shadow: 0px 0px 21px rgba(0, 0, 0, 0.5); /* drop shadow */
		background-color: #61846F;
	}

	#map {
		height: 60vh;
		width: 50vw;
		position: relative; /* relative to parent (allows for better scaling / scroll bar) */
	}

	#mapAwait {
		height: 60vh;
		width: 50vw;
		position: relative;
		top:50%;
		left:65%;
		transform: translate(-50%,-50%);
	}

	#mapContainer {
		height: 60vh;
		width: 50vw; /* The width is half the width of the web page */
		box-shadow: 0px 4px 30px #272727;
		position: relative;
		top:50%;
		left:10%;
		transform: translate(-50%,-50%);
	}

	#awaitText{
		text-align: center;
		font-size: 32px;
		font-family: "Montserrat", sans-serif;
		position: relative;
		top:50%;
		left:95%;
		transform: translate(-50%,-50%);
	}

	.below_map { /* buttons that appear on top of the map */
		list-style-type: none;
		text-align: center;
		float: left;
		position: relative;
	}

	.mapButton {
		float: left;
		padding: 12px;
		text-decoration: none;
		font-size: 17px;
		width: 140px;
		text-align: center;
		height: 65px;
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
		width: 50vw;
		font-family: "Montserrat", sans-serif;

	}
	
	.submit-image {
		z-index: 2;
		display: block;
		position: relative;
		left: 21%;
		top: 0%;
		height: 30vh;
		width: fit-content;
		max-width: 260px;
		transform: translate(-50%, 85%);
	}
	
	.image-display {
		text-align: center;
	}
	
	.upload{
		display:flex;
		height:50px;
		width:50px;
		cursor:pointer;
	}
	
	.image{
		display:flex;
		height:250px;
		width:200px;
		object-fit: cover; /* crop images to correct size */
	}
	
	.no-image{
		display:flex;
		height:250px;
		width:250px;
	}
	
	.upload-text {
		font-family: "Montserrat", sans-serif;
		color: white;
	}
	
	.upload-click {
		font-family: "Montserrat", sans-serif;
		color: white;
		cursor: pointer;
		top: 50%;
		margin: auto;
		padding-left: 5px;
		width: fit-content;
	}
	
	.upload-click-error {
		font-family: "Montserrat", sans-serif;
		color: #FF8B8B;
		cursor: pointer;
		top: 50%;
		margin: auto;
		padding-left: 5px;
		width: fit-content;
	}
	
	.upload-container {
		justify-content: center;
		margin: auto;
		width: fit-content;
		display: flex;
	}
	
	.upload-container:hover .upload-click {
		color: #FCDFC4;
	}
	
	.upload-container:hover .upload {
		content: url("/images/upload_hover.png");
	}
	
	.upload-container:hover .upload-click-error {
		color: #FCDFC4;
	}
	
	button {
		height: 50px;
		cursor: pointer;
		display: flex;
		border: none;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border-radius: 20px;
		font-family: 'Montserrat', sans-serif;
		font-size: 1.0rem;
		background-color: #B5D3D2;
		transition: all 0.5s;
		width: 155px;
		text-decoration: none;
		color: black;
	}
	
	button:hover {
		background-color: #DFC9B5;
		border-radius: 22px;
		transition: all 0.5s ease 0.0s;
	}

	#status{
		font-family: "Montserrat", sans-serif;
		text-align: center;
		font-size: larger;
	}
	
	/* device sensitive */
	@media screen and (max-width: 450px) {
		.map-modal {
			position: relative;
			left: -66.5%;
			margin-top: 30px;
			transform: translate(0%, -10%); /* resets transformation from previous css */
			width: 100vw;
			background-color: transparent;
			box-shadow: none;
		}
		#map {
			width: 100vw;
		}
		#mapAwait {
			width: 100vw;
		}
		#mapContainer {
			width: 100vw;
		}
		.below_map {
			padding-left: 4%;
		}
		.submit-image {
			position: relative;
			left: 0%;
			transform: translateY(25%);
			width: 100vw;
			margin-bottom: 250px;
			max-width: 100vw;
		}
		.map-wrapper {
			margin-top: 100px;
			transform: scale(1.03);
			position: relative;
			overflow-x: hidden;
			overflow-y: auto;
			max-height: 85.5vh;
		}
		
		.upload-container:hover .upload-click {
			color: #977453;
		}
		
		.upload-container:hover .upload {
			content: url("/images/upload_hover_mobile.png");
		}
		
		.image {
			box-shadow: 0px 0px 21px rgba(0, 0, 0, 0.5); /* drop shadow */
		}
	}
	
	@media screen and (min-width: 451px) and (max-width: 1000px) {
		.map-modal {
			position: relative;
			left: 50%;
			transform: translate(-55%, -10%);
			width: fit-content;
			background-color: transparent;
			box-shadow: none;
		}
		#map {
			width: 84vw;
		}
		#mapAwait {
			width: 84vw;
		}
		#mapContainer {
			width: 84vw;
		}
		.submit-image {
			position: relative;
			left: 0%;
			transform: translateY(25%);
			width: 100vw;
			margin-bottom: 250px;
			max-width: 100vw;
		}
		.map-wrapper {
			margin-top: 100px;
			transform: scale(1.03);
			position: relative;
			overflow-x: hidden;
			overflow-y: auto;
			max-height: 85.5vh;
		}
		
		.upload-container:hover .upload-click {
			color: #977453;
		}
		
		.upload-container:hover .upload {
			content: url("/images/upload_hover_mobile.png");
		}
		
		.image {
			box-shadow: 0px 0px 21px rgba(0, 0, 0, 0.5); /* drop shadow */
		}
	}

</style>