<script lang="ts">
	import { Loader } from '@googlemaps/js-api-loader';
	import { onMount } from 'svelte';
	import {AmbientLight,DirectionalLight,PerspectiveCamera,Scene,WebGLRenderer,Raycaster,Vector2,Matrix4,MathUtils} from 'three';
	import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
	import ThreejsOverlayView from '@ubilabs/threejs-overlay-view';
    import { enhance } from '$app/forms';
	import {TWEEN} from 'three/examples/jsm/libs/tween.module.min'


	/** @type {import('./$types').PageData} */
	export let data;
	export let form;

	var locationTracking=true;
	var location = {"lat":null,"lng":null};
	var errorMessage: string = "Awaiting map.";
	var map;
	var playerModel;
	var overlay;
	var vector = new Vector2();
	let monster={}
	var gameData = [];
	var scene;
	
	const gltfLoader = new GLTFLoader();
	
	onMount(async () => {
		if (form?.image) {
			image = form.image
		}
		getPosition().then((position: Position) =>{
			location.lat=position.coords.latitude;
			location.lng=position.coords.longitude;
  			createMap(position.coords.latitude,position.coords.longitude);
		}).then(()=>{
			setInterval(()=>{
				if(locationTracking){
					navigator.geolocation.getCurrentPosition(success)}},3000);
			setInterval(getMonsters,8000);
		}).catch(() => {
				errorMessage = "Location access blocked, please enable."
		})
	})

	function success(position){
		//updates the current player position
		location.lat=position.coords.latitude;
		location.lng=position.coords.longitude;
		let vector = overlay.latLngAltToVector3({lat:location.lat,lng:location.lng})
		new TWEEN.Tween(playerModel.position).to({x: vector.x,y:vector.y},1000).start()
	}

	function getPosition(){
		//tries to get permission for location access if needed, or initially loads a position to start with
		//promise ensures no loading can take place until completed
  		return new Promise((resolve,reject) => {
    		navigator.geolocation.getCurrentPosition(resolve,reject,{maximumAge: 100,enableHighAccuracy:true})
  		});
	}

	async function getMonsters(){
		const packet: RequestInit = {
		headers: {
			"content-type": "application/json; charset=UTF-8",
			"Authorization": data.cookie
		},
		method: "GET",
		mode: "cors"
		}
		let url="http://38.242.137.81:8000/api/monsters/get-tms"
		await fetch(url,packet).then((response) => response.json().then((out) => {
			let monsters=out;
			drawMonsters(scene,monsters)
			addHTML()
		}))
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
		maxZoom: 18,
		minZoom:15,
		panControl:false,
        gestureHandling: "auto",
		streetViewControl:false,
		mapTypeControl:false,
		fullscreenControl:false,
		mapId: '805b0b106a1a291d'
	}

	await loader
		.load()
		.then((google) => {
			//only draws onto map when the map has loaded in the promise
			map = new google.maps.Map(document.getElementById("map") as HTMLElement, mapOptions);
			let scene = initWebglOverlayView(map);
			scene = drawMonsters(scene,data.monsters);
			let button=document.getElementById("location");
			map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(button);
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

		scene = overlay.getScene();
    	camera = new PerspectiveCamera();

		//adds light to the models so they show colour
    	const ambientLight = new AmbientLight(0xffffff, 0.75); // Soft white light.
    	scene.add(ambientLight);
    	const directionalLight = new DirectionalLight(0xffffff, 0.25);
    	directionalLight.position.set(0.5, -1, 0.5);
    	scene.add(directionalLight);

    	// Sets a reference point for drawing onto the map (dont change its kinda important for setting relative points)
		overlay.setReferencePoint({lat:50.75646948193597, lng:-3.5397420013942633})
		
		gltfLoader.load("models/sans.gltf", (gltf) => {
			//gltfLoader.load("models/poly.glb", (gltf) => {
			let vector = overlay.latLngAltToVector3({lat:location.lat,lng:location.lng})
			playerModel = gltf.scene;
			playerModel.position.set(vector.x,vector.y,0);
    		playerModel.scale.set(10, 10, 10);
			playerModel.rotation.x = Math.PI/2; // Rotations are in radians.
			scene.add(playerModel);
			
		})

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
				gameData.forEach(m => {
					//detects that the correct monster has been clicked, then sets it as the current monster
					m.model.children[0].material.color.r=0.8227857351303101;
				})
				monster = {}
			}
		})
		


		const animate = () => { //cool animations
			gameData.forEach(element => {
				element.model.rotateY(MathUtils.degToRad(0.2));
			});
			overlay.requestRedraw();
			TWEEN.update()

  			requestAnimationFrame(animate);
		};

		overlay.update = () => {
};

		// start animation loop
		requestAnimationFrame(animate);
		return scene;
}

let spans = []
function addHTML() {
	spans = []
	let scores = []
	let sortedScores = []
	scores.push("" + monster.Team1_Score + 1)
	scores.push("" + monster.Team2_Score + 2)
	scores.push("" + monster.Team3_Score + 3)
	scores.sort((a,b)=>b-a)
	var order = []
	for (var i = 0; i < scores.length; i++) {
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


function drawMonsters(scene, monsters){
	//loads the gltf models
	monsters.forEach(element => {
		let monExists = false;
		gameData.forEach(previousMonster =>{
			if(previousMonster.monster.TM_ID==element.TM_ID){
				
				monExists=true;
				previousMonster.monster.Team1Score = element.Team1Score;
				previousMonster.monster.Team2Score = element.Team2Score;
				previousMonster.monster.Team3Score = element.Team3Score;
				if(monster.TM_ID==element.TM_ID){
					monster=element;
				}
				return true;
			}
		})
		if(!monExists){
		gltfLoader.load("models/poly.glb", (gltf) => {
			//gltfLoader.load("models/poly.glb", (gltf) => {
			let vector = overlay.latLngAltToVector3({lat:element.Latitude,lng:element.Longitude})
			gltf.scene.position.set(vector.x,vector.y,40);
    		gltf.scene.scale.set(50, 50, 50);
			gltf.scene.rotation.x = Math.PI/2; // Rotations are in radians.
			scene.add(gltf.scene);
			gameData.push({"monster":element,"model":gltf.scene})
		})
	}
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
function goToLocation(){
	map.panTo({lat:location.lat,lng:location.lng});
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

let submitButton, submitForm
function freezeForm(e) {
	if (submitForm.classList.contains('is-submitting')) {
		e.preventDefault();
	}
	if(!submitForm.classList.contains('is-submitting')){
	submitForm.classList.add('is-submitting');
	setTimeout(()=> {submitForm.classList.remove('is-submitting')},1000)
	}
}

function unfreezeForm(e) {
	submitForm.classList.remove('is-submitting')
}
	
</script>


<!-- pre loads hover image -->
<link rel="preload" as="image" href="/images/upload_hover.png">
<link rel="preload" as="image" href="/images/upload_hover_mobile.png">
<button id="location" on:click={goToLocation}><img class="location" alt="a location centering icon" src="images/location.png"></button>


<div class="map-modal">	
	<div class="form-wrapper">
		<div class="file-chosen-wrapper">
			{#if image}
			<img class="file-chosen" src="{image}" alt="d"/>
		{:else}
			{#if form?.image}
				<img class="file-chosen" src="{form.image}" alt=""/>
			{:else}
				<div class="no-file-chosen">No file chosen</div>
			{/if}
		{/if}
		</div>
		<div class="upload-container">
			<button class="upload-button" on:click={()=>{fileinput.click();}}>
				<img src="/images/upload_black.png" alt="A small upload icon" width="40px" height="40px"/>
				{#if form?.success === false || form?.success === true}
					{form.message}
				{:else if error !== true}
					{name}
				{/if}
			</button>
			</div>
			<form method="POST" action="?/uploadImage" enctype="multipart/form-data" bind:this={submitForm} use:enhance>
				<input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} name="file">
				<input type="hidden" name="image" value={image}>
				<input type="hidden" name="tm" value={monster.TM_ID}>
				<input type="hidden" name="team" value={data.team_id}>
				<input type="hidden" name="lat" value={location.lat}>
				<input type="hidden" name="lng" value={location.lng}>
				<button type="submit" class="submit-button" bind:this="{submitButton}" on:click={freezeForm}>Submit Image</button>
			</form>
			{#if Object.keys(monster).length > 0}
		<div class="monsterScore">
			Name: {monster.TM_Name}<br>
			{#each spans as item}
				{@html item}<br>
			{/each}
			<br>
			Carbon consumed
			<br>
			<span style="color: #EA6E6E">R: {monster.Team1_Carbon}g</span>
			<br>
			<span style="color: #6285DC">B: {monster.Team2_Carbon}g</span>
			<br>
			<span style="color: #6DC462">G: {monster.Team3_Carbon}g</span>
		</div>
	{/if}
</div>

	<div id="map" class="map">
		<!--
		<div id="mapAwait">
			<p id="awaitText">{errorMessage}</p>
		</div>
		-->
	</div>
</div>

<div class="mobile-button">
	<button class="mobile-upload-button" on:click={()=>{fileinput.click();}}>
				<img src="/images/upload_black.png" alt="A small upload icon" width="40px" height="40px"/>
				{#if form?.success === false || form?.success === true}
					{form.message}
				{:else if error !== true}
					{name}
				{/if}
			</button>
			{#if image}
				<form method="POST" action="?/uploadImage" enctype="multipart/form-data" bind:this={submitForm} use:enhance>
					<input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} name="file">
					<input type="hidden" name="image" value={image}>
					<input type="hidden" name="tm" value={monster.TM_ID}>
					<input type="hidden" name="team" value={data.team_id}>
					<input type="hidden" name="lat" value={location.lat}>
					<input type="hidden" name="lng" value={location.lng}>
					<button type="submit" class="mobile-submit-button" bind:this="{submitButton}" on:click={freezeForm}>Submit Image</button>
				</form>
			{/if}

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
		grid-template-areas: "Form Map";
		border-radius: 25px;
		overflow: hidden;
		box-shadow: 0px 0px 21px rgba(0, 0, 0, 0.5); /* drop shadow */
		background-color: #E1E1E1;
	}

	.form-wrapper {
		grid-area: Form;
		display: grid;
		grid-template-rows: 250px auto auto 5fr;
		overflow-y: scroll;
	}

	.no-file-chosen {
		font-family: Montserrat;
		text-transform: uppercase;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #ECECEC;
		max-height: 100%;
		width: 100%;
		border-radius: 15px;
	}

	.file-chosen-wrapper {
		display: flex;
		justify-content: center;
		height: 100%;
		margin: 15px 15px 0px 15px;
	}

	.file-chosen{
		border-radius: 15px;
		max-width: 100%;
		object-fit: cover; /* crop images to correct size */
	}

	.map {
		grid-area: Map;
		height: 100%;
		width: 100%;
	}

	.monsterScore {
		margin: 15px;
		background-color: #ECECEC;
		padding: 10px 20px 10px 10px;
		font-size: 1.1em;
		border-radius: 15px;
		font-family: "Montserrat", sans-serif;
	}

	.location {
		width: 25px;
		height: 25px;
	}
	
	#location {
		top: 1%;
		margin-right: 1%;
		width: 50px;
		height: 50px;
	}
	
	.upload-container {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 30px 15px 15px 15px;
	}

	.upload-button {
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
		padding: 0px 15px;
		max-width: 250px;
		text-decoration: none;
		color: black;
		margin: 0px auto;
	}

	.upload-button img {
		padding: 0px 5px 5px 5px;
	}

	.upload-button:hover {
		background-color: #DFC9B5;
		border-radius: 25px;
		transition: all 0.5s ease 0.0s;
	}
	
	.submit-button {
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
		padding: 0px 15px;
		max-width: 200px;
		text-decoration: none;
		color: black;
		margin: 0px auto;
	}
	
	.submit-button:hover {
		background-color: #DFC9B5;
		border-radius: 25px;
		transition: all 0.5s ease 0.0s;
	}

	.mobile-button {
		visibility: hidden;
		width: 0px;
		height: 0px;
	}

	/* device sensitive */
	@media screen and (max-width: 450px) {
		.map-modal {
			height: 92.5vh;
			width: 100vw;
			border-radius: 15px 15px 0px 0px;
			bottom: 0;
			transform: translate(-50%, -46.125%);
			grid-template-columns: 1fr;
			grid-template-rows: 1fr;
			grid-template-areas: "Map";
		}

		.form-wrapper {
			visibility: hidden;
			width: 0px;
			height: 0px;
		}

		.mobile-button {
			position: absolute;
			bottom: 15%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 70vw;
			max-height: 80px;
			visibility: visible;
			background-color: paleturquoise;
			border-radius: 55px;
			box-shadow: 0px 0px 21px #00000044;
			display: flex;
			flex-direction: column;
		}

		.mobile-upload-button {
			display: flex;
			width: 100%;
			height: 40px;

		}

		.mobile-submit-button {
			display: flex;
			width: 100%;
			height: 40px;
		}
	}
</style>
