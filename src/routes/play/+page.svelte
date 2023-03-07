<script lang="ts">
	import { Loader } from '@googlemaps/js-api-loader';
	import { onMount } from 'svelte';
	import {AmbientLight,DirectionalLight,Matrix4,PerspectiveCamera,Scene,WebGLRenderer,Vector3,} from 'three';
	import * as THREE from "three";
	import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
	import {latLngToVector3Relative, latLngToVector3,ThreeJSOverlayView} from '@googlemaps/three';

	var errorMessage: string = "Awaiting map.";
	let monsterurl = "http://38.242.137.81:8000/api/monsters/add-score/"
	var map: undefined;

	onMount(() => {
		getPosition().then((position: Position) =>{
  			//document.getElementById("mapAwait").hidden = true;
  			createMap(position.coords.latitude,position.coords.longitude);
		}).catch((err) => {
  			console.log(err);
				errorMessage = "Location access blocked, please enable."
		})

		//updateScore(0, [1, 1, 1]);
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
			map = new google.maps.Map(document.getElementById("map") as HTMLElement, mapOptions);
			const webglOverlayView = new google.maps.WebGLOverlayView();
			initWebglOverlayView(map,webglOverlayView);
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

	function initWebglOverlayView(map: undefined, webglOverlayView:undefined) {
  		let scene:Scene, renderer:WebGLRenderer, camera:PerspectiveCamera, gltfLoader:GLTFLoader;
		  scene = new Scene();
    camera = new PerspectiveCamera();

    const ambientLight = new AmbientLight(0xffffff, 0.75); // Soft white light.

    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 0.25);

    directionalLight.position.set(0.5, -1, 0.5);
    scene.add(directionalLight);
    // Load the model.
    gltfLoader = new GLTFLoader();
    let i = 0;
    //monsterArray.forEach(element => {
		
	let veccer = latLngToVector3Relative({lat:50.75646948193597,lng:-3.5397420013942633},{lat:0,lng:0});
	console.log(veccer);
	
    gltfLoader.load("https://raw.githubusercontent.com/googlemaps/js-samples/main/assets/pin.gltf", (gltf) => {
		gltf.scene.position.set(veccer.x,veccer.y,veccer.z);
    	gltf.scene.scale.set(50, 50, 50);
    	gltf.scene.rotation.x = Math.PI/2; // Rotations are in radians.
    	scene.add(gltf.scene);
    })
	let veccer2 = latLngToVector3Relative({lat:50.72747343933379,lng:-3.5207198022872284},{lat:0,lng:0});
	gltfLoader.load("https://raw.githubusercontent.com/googlemaps/js-samples/main/assets/pin.gltf", (gltf) => {
		gltf.scene.position.set(veccer2.x,veccer2.y,veccer2.z);
    	gltf.scene.scale.set(50, 50, 50);
    	gltf.scene.rotation.x = Math.PI/2; // Rotations are in radians.
    	scene.add(gltf.scene);
    })
	let veccer3 = latLngToVector3Relative({lat:50.73646948193597,lng:-3.5317420013942633},{lat:0,lng:0})
	gltfLoader.load("https://raw.githubusercontent.com/googlemaps/js-samples/main/assets/pin.gltf", (gltf) => {
		gltf.scene.position.set(veccer3.x,veccer3.y,veccer3.z);
    	gltf.scene.scale.set(50, 50, 50);
    	gltf.scene.rotation.x = Math.PI/2; // Rotations are in radians.
    	scene.add(gltf.scene);
    })
	new ThreeJSOverlayView({
            //anchor, // can also anchor to different lat, lng, altitude
            map,
            scene,
			THREE
        });

  	//webglOverlayView.onAdd = () => {
    // Set up the scene.
    

    // loader.load(source, (gltf) => {
    //   gltf.scene.scale.set(10, 10, 10);
    //   gltf.scene.rotation.x = Math.PI; // Rotations are in radians.
    //   scene.add(gltf.scene);
    // });
    //};

  //webglOverlayView.onContextRestored = ({ gl }) => {
    // Create the js renderer, using the
    // maps's WebGL rendering context.
//     renderer = new WebGLRenderer({
//       canvas: gl.canvas,
//       context: gl,
//       ...gl.getContextAttributes(),
//     });
//     renderer.autoClear = false;
//     // Wait to move the camera until the 3D model loads.
//     gltfLoader.manager.onLoad = () => {
//       renderer.setAnimationLoop(() => {
//         webglOverlayView.requestRedraw();
//       })}
//   };

//   webglOverlayView.onDraw = ({ gl, transformer }) => {
//     const latLngAltitudeLiteral = {
//       lat: 50,
//       lng: -3,
//       altitude: 50,
//     };
//     // Update camera matrix to ensure the model is georeferenced correctly on the map.
//     const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);

//     camera.projectionMatrix = new Matrix4().fromArray(matrix);
//     webglOverlayView.requestRedraw();
//     renderer.render(scene, camera);
//     // Sometimes it is necessary to reset the GL state.
//     renderer.resetState();
//   };

//   webglOverlayView.setMap(map);
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
