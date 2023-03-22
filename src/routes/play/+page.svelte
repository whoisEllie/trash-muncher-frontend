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
	var monsters = data.monsters
	let google2;
	const gltfLoader = new GLTFLoader();

	//runs on page load
	onMount(async () => {
		if (form?.image) {
			image = form.image
		}
		//checks if location is valid, then draws map onto the webpage
		getPosition().then((position: Position) =>{
			location.lat=position.coords.latitude;
			location.lng=position.coords.longitude;
  			createMap(position.coords.latitude,position.coords.longitude);
		}).then(()=>{
			//updates position of player every few seconds
			setInterval(()=>{
				if(locationTracking){
					navigator.geolocation.getCurrentPosition(success)}},3000);
			//sets interval to update the monsters on the screen, including scores and any new monsters
			setInterval(getMonsters,8000);
		}).catch(() => {
				//triggered when location isnt enabled
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

	//fetches current monster db, then updates the monsters
	async function getMonsters(){
		let tempMonsters
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
	//sets settings for the player map. removes some control from the player
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
			google2=google;
			map = new google.maps.Map(document.getElementById("map") as HTMLElement, mapOptions);
			let scene = initWebglOverlayView(map);
			scene = drawMonsters(scene,monsters);
			let button=document.getElementById("location");
			map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(button);
		})
		.catch((e) => {
			//do something :sparkle:
		});
	}

	//WebGL initialisation. Loads all the models onto the map
	function initWebglOverlayView(map) {
		//variables used for webgl
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

    	// Sets a reference point for drawing onto the map
		overlay.setReferencePoint({lat:50.75646948193597, lng:-3.5397420013942633})
		
		gltfLoader.load("models/Player.gltf", (gltf) => {
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
			getMonsters()	
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
//draws the info panel for the currently selected monster
function addHTML() {
	spans = []
	let scores = []
	let sortedScores = []
	scores.push("" + monster.Team1_Score + 1)
	scores.push("" + monster.Team2_Score + 2)
	scores.push("" + monster.Team3_Score + 3)
	scores.sort((a,b)=>b-a)
	var order = []
	//sets the order of scores from highest to lowest
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
		//sets the colour for each team on the display
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
				var totalCarbon = element.Team1_Score + element.Team2_Score + element.Team3_Score
				previousMonster.monster.Team1Score = element.Team1Score;
				previousMonster.monster.Team2Score = element.Team2Score;
				previousMonster.monster.Team3Score = element.Team3Score;
				previousMonster.monster.Team1Carbon = element.Team1Carbon;
				previousMonster.monster.Team2Carbon = element.Team2Carbon;
				previousMonster.monster.Team3Carbon = element.Team3Carbon;
				var multiplier;
				if (totalCarbon != 0) {
					multiplier = 3 * Math.log2(totalScore)
				} else {
					multiplier = 0
				}
				previousMonster.model.scale.set(35 + multiplier,35 + multiplier,35 + multiplier);
				previousMonster.monster=element;
				monExists=true;
				if(monster.TM_ID==element.TM_ID){
					monster=element;
				}
				return true;
			}
		})
		if(!monExists){
			var totalCarbon = element.Team1_Carbon + element.Team2_Carbon + element.Team3_Carbon
			var totalScore = element.Team1_Score + element.Team2_Score + element.Team3_Score
			var multiplier;
			if (totalCarbon != 0) {
				multiplier = 3 * Math.log2(totalCarbon)
			} else {
				multiplier = 0
			}
			try {
				gltfLoader.load("../models/" + element.TM_Name + ".glb", (gltf) => {
					//gltfLoader.load("models/poly.glb", (gltf) => {
					let vector = overlay.latLngAltToVector3({lat:element.Latitude,lng:element.Longitude})
					gltf.scene.position.set(vector.x,vector.y,40);
			    	gltf.scene.scale.set(35 + multiplier, 35 + multiplier, 35 + multiplier);
					gltf.scene.rotation.x = Math.PI/2; // Rotations are in radians.
					scene.add(gltf.scene);
					let circleStats = getRadius(element)
					if (totalScore != 0) {
						var shape = new google2.maps.Circle({
							map:map,
							fillColor:circleStats.colour,
							center:{lat:element.Latitude,lng:element.Longitude},
							radius:circleStats.radius*8 + multiplier,
							clickable: false
						})
					}
					gameData.push({"monster":element,"model":gltf.scene})
				})
			} catch(error) {
				// do nothing
			}
		}
	});
	return scene;
}

function getRadius(monster){
  var colour = "#000000";
  var radius;
  if(monster.Team1_Score>monster.Team2_Score && monster.Team1_Score>monster.Team3_Score){
    colour="#FF0000";
    if(monster.Team2_Score>monster.Team3_Score){
      radius=monster.Team1_Score-monster.Team2_Score;
    }
    else{
      radius=monster.Team1_Score-monster.Team3_Score;
    }
  }
  else if(monster.Team2_Score>monster.Team1_Score && monster.Team2_Score>monster.Team3_Score){
    colour="#00ff00";
    if(monster.Team1_Score>monster.Team3_Score){
      radius=monster.Team2_Score-monster.Team1_Score;
    }
    else{
      radius=monster.Team2_Score-monster.Team3_Score;
    }
  }
  else if(monster.Team3_Score>monster.Team1_Score && monster.Team3_Score>monster.Team2_Score){
    colour="#0000ff";
    if(monster.Team1_Score>monster.Team2_Score){
      radius=monster.Team3_Score-monster.Team1_Score;
    }
    else{
      radius=monster.Team3_Score-monster.Team2_Score;
    }
  }
  else{radius=0};
  return {"colour": colour,"radius":radius};
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
	setTimeout(()=> {submitForm.classList.remove('is-submitting')},3000)
	}
}

function unfreezeForm(e) {
	submitForm.classList.remove('is-submitting')
}
	
</script>


<!-- pre loads hover image -->
<link rel="preload" as="image" href="/images/upload_hover.png">
<link rel="preload" as="image" href="/images/upload_hover_mobile.png">
<button id="location" on:click={goToLocation}><img class="location" src="images/location.png"></button>
<div class="map-wrapper">
	<div class="submit-image">
		<div class="image-display">
	        {#if image}
				<center><img class="image" src="{image}" alt="d" /></center>
	        {:else}
				{#if form?.image}
					<center><img class="image" src="{form.image}" alt="" /></center>
				{:else}
		        	<center><img class="no-image" src="/images/no_file.png" alt="" /></center>
				{/if}
	        {/if}
			<br>
			<div class="upload-container">
				<center><img class="upload" src="/images/upload.png" alt="" on:click={()=>{fileinput.click();}} /></center>
				{#if form?.success === false}
					<span class="upload-click-error" on:click={()=>{fileinput.click();}} bind:this={nameText}>{form.message}</span>
				{:else if form?.success === true}
					<span class="upload-click-success" on:click={()=>{fileinput.click();}} bind:this={nameText}>{form.message}</span>
				{:else}
					{#if error !== true}
				        <span class="upload-click" on:click={()=>{fileinput.click();}} bind:this={nameText}>{name}</span>
					{:else}
						<span class="upload-click-error" on:click={()=>{fileinput.click();}} bind:this={nameText}>{name}</span>
					{/if}
				{/if}
			</div>
			<form method="POST" action="?/uploadImage" enctype="multipart/form-data" bind:this={submitForm} use:enhance>
		        <input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput}
				name="file">
				<input type="hidden" name="image" value={image}>
				<input type="hidden" name="tm" value={monster.TM_ID}>
				<input type="hidden" name="team" value={data.team_id}>
				<input type="hidden" name="lat" value={location.lat}>
				<input type="hidden" name="lng" value={location.lng}>
				<center><button type="submit" class="button" bind:this="{submitButton}" on:click={freezeForm} >Submit Image</button></center>
			</form>
		</div>
	</div>
	<div class="map-modal">	
		<div id="mapAwait">
			<p id="awaitText">{errorMessage}</p>
		</div>
		<div id="mapContainer">
			<div id="map">
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
					<br><span style="color: #6285DC">B: {monster.Team2_Carbon}g</span>
					<br><span style="color: #6DC462">G: {monster.Team3_Carbon}g</span>
				</div>
				{/if}
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
	
	.monsterScore {
		background-color: #E0E0E0;
		position: relative;
		width: fit-content;
		padding: 10px 20px 10px 10px;
		font-size: 1.1em;
		box-shadow: 0px 0px 16px #00000044;
		border-radius: 15px;
		font-family: "Montserrat", sans-serif;
	}

	#errorText{
		font-size: 1.2em;
		width: max-content;
		background-color: red;
		position: absolute;
		width: 50vw;
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
		height:50px;
		width:50px;
		padding-bottom: 10px;
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
		width: 180px;
	}
	
	.upload-click-success {
		font-family: "Montserrat", sans-serif;
		color: #A2FF8B;
		cursor: pointer;
		top: 50%;
		margin: auto;
		padding-left: 5px;
		width: 160px;
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
	
	.upload-container:hover .upload-click-success {
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
			margin-bottom: 200px;
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
			display: none;
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
			margin-top: 60px;
			transform: scale(1.03);
			position: relative;
			overflow-x: hidden;
			overflow-y: auto;
			max-height: 91.5vh;
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
			margin-bottom: 200px;
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
			margin-top: 80px;
			transform: scale(1.03);
			position: relative;
			overflow-x: hidden;
			overflow-y: auto;
			max-height: 88.5vh;
		}
		.below_map {
			display: none;
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