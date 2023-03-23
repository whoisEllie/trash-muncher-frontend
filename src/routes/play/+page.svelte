<script lang="ts">
	import { Loader } from '@googlemaps/js-api-loader';
	import { onMount } from 'svelte';
	import {AmbientLight,DirectionalLight,PerspectiveCamera,Scene,WebGLRenderer,Raycaster,Vector2,Matrix4,MathUtils,AnimationMixer,Clock} from 'three';
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
	let message = "no message"
	var gameData = [];
	var scene;
	var monsters = data.monsters
	let google2;
	let monsterSelected = false
	const gltfLoader = new GLTFLoader();
	const clock = new Clock()
  
	if (form?.success == true || form?.success == false) {
		message = form.message	
	}

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
			//setInterval(getMonsters,5000);
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
			if(navigator.geolocation){
    		navigator.geolocation.getCurrentPosition(resolve,reject,{maximumAge: 100,enableHighAccuracy:true})
			}
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
		let url="https://api.trashmunchers.co.uk/api/monsters/get-tms"
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
		zoomControl:false,
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
		var animationAction;
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
				monsterSelected = true
				let clicked = false;
				intersections.forEach(element => {
					gameData.forEach(m => {
						var elemObject
						var colour;
						if(m.mixer){
							m.animation.stop()
							elemObject=element.object.parent.parent
							colour=m.model.children[0].children[0].material.color
						}
						else{
							elemObject=element.object.parent
							colour=m.model.children[0].material.color
						}
						//detects that the correct monster has been clicked, then sets it as the current monster
						colour.r=1;
						colour.g=1;
						colour.b=1;
						if (m.model==elemObject){
							if(m.mixer) {
								m.animation.play()
							}
							monster=m.monster;
							colour.r=0.5;
							colour.g=0.5;
							colour.b=0.5;
							clicked=true;
							addHTML()
							return true;
						}
					});
				});
			} else {
				monsterSelected = false
				gameData.forEach(m => {
					//detects that the correct monster has been clicked, then sets it as the current monster
					let colour;
					if(m.mixer){
							m.animation.stop()
							colour=m.model.children[0].children[0].material.color
						}
						else{
							colour=m.model.children[0].material.color
						}
					colour.r=1;
					colour.g=1;
					colour.b=1;
				})
				//monster = {}
			}
		})
		


		const animate = () => { //cool animations
			let delta = clock.getDelta();
			gameData.forEach(element => {
				if(element.monster!=monster || !monsterSelected){
				element.model.rotateY(MathUtils.degToRad(0.2));
				}
				
				if(element.mixer) {
					element.mixer.update(delta)}
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
				var totalCarbon = element.Team1_Carbon + element.Team2_Carbon + element.Team3_Carbon
				var totalScore = element.Team1_Score + element.Team2_Score + element.Team3_Score
				previousMonster.monster=element;
				var multiplier;
				if (totalCarbon != 0) {
					multiplier = 3 * Math.log2(totalCarbon)
				} else {
					multiplier = 0
				}
				previousMonster.model.scale.set(35 + multiplier,35 + multiplier,35 + multiplier);
				previousMonster.circle.setRadius(20 + getRadius(element).radius*4)

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
					let mixer;
					let animationAction;
					if(gltf.animations.length>0){
						mixer = new AnimationMixer(gltf.scene);
						animationAction = mixer.clipAction((gltf as any).animations[0])
					}
					let circleStats = getRadius(element)
					var shape = new google2.maps.Circle({
							map:map,
							fillColor:circleStats.colour,
							center:{lat:element.Latitude,lng:element.Longitude},
							clickable: false
						})

					shape.setRadius(20 + circleStats.radius*4)
					gameData.push({"monster":element,"model":gltf.scene,"circle":shape,"mixer":mixer,"animation":animationAction})	

				})
			} catch(error) {

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
	var root = document.documentElement;
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
		image = "no file"
		name = "Please submit a file below 4mb!"
	} else {
		if (form?.success == true || form?.success == false) {
			message = name
		}
		error = false
		reader.readAsDataURL(tempImage);
		reader.onload = e => {
			// display uploaded image
			image = e.target.result;
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
	setTimeout(()=> {submitForm.classList.remove('is-submitting')},2000)
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
				{#if image == "no file"}
					<div class="no-file-chosen">No file chosen</div>
				{:else}
					<img class="file-chosen" src="{image}" alt="d"/>
				{/if}
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
					{#if error == true}
						{name}
					{:else if message != "no message"}
						{message}
					{:else}
						{form.message}
					{/if}
				{:else if error == true}
					{name}
				{:else}
					{name}
				{/if}
			</button>
		</div>
		{#if error == false}
			<form method="POST" action="?/uploadImage" enctype="multipart/form-data" bind:this={submitForm} use:enhance>
				<input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} name="file">
				<input type="hidden" name="image" value={image}>
				<input type="hidden" name="tm" value={monster.TM_ID}>
				<input type="hidden" name="team" value={data.team_id}>
				<input type="hidden" name="lat" value={location.lat}>
				<input type="hidden" name="lng" value={location.lng}>
				<button type="submit" class="submit-button" bind:this="{submitButton}" on:click={freezeForm}>Submit Image</button>
			</form>
		{:else}
			<button class="submit-button" bind:this="{submitButton}" on:click={freezeForm}>Submit Image</button>
		{/if}
		{#if monsterSelected}
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
		<div class="map-await">
			{errorMessage}
		</div>
	</div>
</div>

<div class="mobile-button">
	<button class="mobile-upload-button" on:click={()=>{fileinput.click();}}>
				<img src="/images/upload_black.png" alt="A small upload icon" width="28px" height="28px"/>
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

	:root {
		--corner-radius: 15px;
	}

	* {
		margin: 0;
		padding: 0;
	}

	.map-await {
		display: flex;
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
		font-family: Montserrat;
		font-weight: 500;
		font-size: 25px;
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
		margin: 15px 20px 0px 15px;
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
		font-size: 1.2em;
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
		max-width: 300px;
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
	@media screen and (max-width: 1515px) {
		.upload-button {
			font-size: 0.85rem;
		}
	}
	@media screen and (max-width: 1200px) {
		.map-modal {
			height: 92.5vh;
			height: 92.5svh;
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
			width: 90vw;
			max-height: 80px;
			visibility: visible;
			background-color: paleturquoise;
			border-radius: 55px;
			box-shadow: 0px 0px 21px #00000044;
			display: flex;
			flex-direction: column;
		}

		.mobile-upload-button {
			font-family: Montserrat;
			padding-top: 10px;
			padding-bottom: 10px;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 40px;
			border: none;
			border-radius: 15px 15px var(--corner-radius) var(--corner-radius);
			background-color: #B5D3D2;
			font-size: 18px;
		}

		.mobile-upload-button img {
			padding: 0px 5px 5px 5px;
		}

		.mobile-submit-button {
			font-family: Montserrat;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 40px;
			border: none;
			border-radius: 0px 0px 15px 15px;
			background-color: #B5D3D2;
			font-size: 18px;
		}
	}
</style>
