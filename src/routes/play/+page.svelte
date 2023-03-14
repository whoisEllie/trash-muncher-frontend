<script lang="ts">
	import { Loader } from '@googlemaps/js-api-loader';
	import { onMount } from 'svelte';
	import {AmbientLight,DirectionalLight,PerspectiveCamera,Scene,WebGLRenderer,Raycaster,Vector2,Matrix4,MathUtils} from 'three';
	import * as THREE from "three";
	import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
	import {latLngToVector3Relative, latLngToVector3} from '@googlemaps/three';
	import ThreejsOverlayView from '@ubilabs/threejs-overlay-view';
    import { enhance } from '$app/forms';


	/** @type {import('./$types').PageData} */
	export let data;

	var errorMessage: string = "Awaiting map.";
	var map: undefined;
	var overlay;
	var vector = new Vector2();
	let monster={}
	var gameData = [];
	const gltfLoader = new GLTFLoader();
	
	onMount(() => {
		getPosition().then((position: Position) =>{
  			//document.getElementById("mapAwait").hidden = true;
  			createMap(position.coords.latitude,position.coords.longitude);
		}).catch((err) => {
  			console.log(err);
				errorMessage = "Location access blocked, please enable."
		})
	})

	function getPosition(){
  		return new Promise((resolve,reject) => {
    		navigator.geolocation.getCurrentPosition(resolve,reject,{maximumAge: 100,enableHighAccuracy:true})
  		});
	}

	async function createMap(latitude: number, longitude: number) {
		const loader = new Loader({
		apiKey:  "",
		version: "weekly",
		libraries: ["places"],
	});

	const mapOptions = {
		center: {
			lat: latitude,
			lng: longitude
		},
		tilt: 45,
		zoom: 15,
		mapId: '805b0b106a1a291d'
	}

	await loader
		.load()
		.then((google) => {
			map = new google.maps.Map(document.getElementById("map") as HTMLElement, mapOptions);
			let scene = initWebglOverlayView(map);
			scene = drawMonsters(scene);
		})
		.catch((e) => {
			//do something :sparkle:
		});
	}

	
	function initWebglOverlayView(map: undefined) {
  		let camera:PerspectiveCamera;

		overlay = new ThreejsOverlayView({lat:0,lng:0});
		overlay.setMap(map);

		const scene = overlay.getScene();
    	camera = new PerspectiveCamera();

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
					}
				});
				element.object.material.color.r=0.06;
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

let image, fileinput;
var name = "Select Image"
	
const onFileSelected =(e)=> {
	let tempImage = e.target.files[0];
	name = e.target.files[0].name;
	if (name.length > 17) {
		name = name.slice(0, 17) + "..."
	}
	let reader = new FileReader();
	
	reader.readAsDataURL(tempImage);
	reader.onload = e => {
		image = e.target.result
    };
}

	
</script>


<div class="map-modal">	
	<div id="mapAwait">
		<p id="awaitText">{errorMessage}</p>
	</div>
	<div id="mapContainer">
		<div id="map">
		</div>
   		<div class="below_map">
			<button class="mapButton">Toggle Location</button>
			<button class="mapButton">Change Zoom</button>
		</div>
	</div>
	<div class="submit-image">
		<div class="image-display">
	        {#if image}
				<center><img class="image" src="{image}" alt="d" /></center>
	        {:else}
	        	<center><img class="no-image" src="/images/no_file.png" alt="" /></center>
	        {/if}
			<br>
			<div class="upload-container">
				<center><img class="upload" src="/images/upload.png" alt="" on:click={()=>{fileinput.click();}} /></center>
		        <span class="upload-click" on:click={()=>{fileinput.click();}}>{name}</span>
			</div>
			<form method="POST" action="?/uploadImage">
		        <input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput}
				name="file">
				<br>
				<center><button type="submit" class="button">Submit Image</button></center>
			</form>
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
		height: 60vh;
		width: 50vw;
		z-index: -1;
		float: right;
		position: absolute;

	}

	#mapAwait {
		height: 60vh;
		width: 50vw;
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
		top: 86%;
		position: relative;
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
	
	.submit-image {
		position: relative;
		left: 20%;
		top: 20%;
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
	
	.upload:hover{
		content: url("/images/upload_hover.png");
	}
	
	.image{
		display:flex;
		height:250px;
		width:200px;
		object-fit: cover;
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
		transform: translateY(35%);
		padding-left: 0.5rem;
	}
	
	.upload-click:hover {
		color: #FCDFC4;
	}
	
	.upload-container {
		justify-content: center;
		margin: auto;
		display: flex;
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

</style>
