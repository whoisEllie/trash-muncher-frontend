<script lang="ts">
	import { Loader } from '@googlemaps/js-api-loader';
	import { onMount } from 'svelte';

	var errorMessage: string = "Awaiting map.";
	let monsterurl = "http://38.242.137.81:8000/api/monsters/add-score/"

	onMount(() => {
		getPosition().then((position: Position) =>{
  			//document.getElementById("mapAwait").hidden = true;
  			createMap(position.coords.latitude,position.coords.longitude);
		}).catch((err) => {
  			console.log(err);
				errorMessage = "Location access blocked, please enable."
		})

		updateScore(0, [1, 1, 1]);
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
		zoom: 4,
		mapId: '805b0b106a1a291d'
	}

	await loader
		.load()
		.then((google) => {
			new google.maps.Map(document.getElementById("map") as HTMLElement, mapOptions);
		})
		.catch((e) => {
			//do something :sparkle:
		});
	}

	async function updateScore(id: number, scores: number[]) {
		const data = {
			"TM_ID": id,
			"T1Score": scores[0],
			"T2Score": scores[1],
			"T3Score": scores[2]
		};

		const packet: RequestInit = {
			headers: {"content-type": "application/json; charset=UTF-8"},
			body: JSON.stringify(data),
			method: "POST",
			mode: "cors"
		}

		await fetch(monsterurl, packet).then((response) => response.json().then((out) => {
			console.log(out);
		}))
	}

	
</script>


<div class="map-modal">
	<div class="below_map">
	  <button class="mapButton" id="enterScore">Insert trash</button>
	  <button  class="mapButton">Toggle Location</button>
	  <button class="mapButton" >Change Zoom</button>
		<!--onclick="toggleLocation()" onclick = "changeZoom()"-->
		<form method="POST">
			<button>POST!</button>
		</form>
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
