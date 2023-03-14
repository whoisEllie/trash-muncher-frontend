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