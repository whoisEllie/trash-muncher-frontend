<script>
	var map;
var monsterArray = [];
var shapes = [];
var curLocation = true;
var zoomedIn = true;

//draws the map onto the screen
function initMap(){
//future code for setting current position
var coords;

getPosition().then((position) =>{
  document.getElementById("mapAwait").hidden = true;
  createMap(position.coords);
}).catch((err) => {
  console.log(err);
  document.getElementById("awaitText").textContent="Permission not granted. Pls grant <3"
})
}
//deals with initial current position
function getPosition(){
  return new Promise((resolve,reject) => {
    navigator.geolocation.getCurrentPosition(resolve,reject,{maximumAge: 100,enableHighAccuracy:true})
  });
}

//def important function needs changing for different uses
function createMap(coords){
  map = new google.maps.Map(document.getElementById("map"), options.player);
  map.setCenter({lat:coords.latitude,lng:coords.longitude});

  //const webglOverlayView = new google.maps.WebGLOverlayView();
  //webglOverlayView.setMap(map);


  //will track position
  navigator.geolocation.watchPosition(successMove,failure,{timeout:1000, maximumAge: 100,enableHighAccuracy:true});

  getMonsters().then(response => {
    if(response!=null){
    response.forEach(element => {
      drawMonsters(element);
    });
  }
  })
  setInterval(test,2400);
}


function test(){
  getMonsters().then(response => {
    if(response!=null){
    response.forEach(element => {
      drawMonsters(element);
    });
  }
  })
}
async function getMonsters(){
  const url="api/monsters/get-tms";
  const response = await fetch(url, { method: "get" });
    return await response.json();
}

function drawMonsters(monster){
  var done = false;
  monsterArray.forEach(element => {
    if(monster.TM_ID==element.monster.TM_ID){
      element.monster=monster;
      done = true;
      if(getRadius(monster).radius!=element.shape.getRadius()/5){
        var newShape = drawShape(monster);
        element.shape.setMap(null);
        element.shape = newShape;
      }
      return;
      }
    })
  if(!done){
    let latitude = monster.Latitude;
    let longitude = monster.Longitude;
    var marker = new google.maps.Marker({
      position:{lat:latitude,lng:longitude},
      map,
      //title:"id:"+monster.TM_ID,
    })
    var shape = drawShape(monster);
    monsterArray.push({"id":monster.TM_ID,"monster":monster,"marker":marker,"shape":shape})

    marker.addListener("click", () => {
      //some distance checker stuff
      


      var oldButton = document.getElementById("enterScore");
      var button = oldButton.cloneNode(true);
      oldButton.parentNode.replaceChild(button,oldButton);

      monsterArray.forEach(element => {
        if(element.marker==marker){
          let monster = element.monster;
          document.getElementById("status").textContent="Red Team Points:"+monster.Team1_Score+" Green Team Points:"+monster.Team2_Score+" Blue Team Points:"+ monster.Team3_Score
          console.log("you have clicked on marker with id: "+element.id);
          
          //bit of a jank system, button press is done here instead of the usual onclick="" stuff
          button.addEventListener("click", async () => {
            var scoreInc=[0,0,0];
            //value is the player's team, no need for the query anymore
            let value = document.querySelector('input[name="points"]:checked').value;
            switch(value){
              case "red_team":scoreInc[0]++;break;
              case "green_team":scoreInc[1]++;break;
              case "blue_team":scoreInc[2]++;break;
            }
            updateScore(monster.TM_ID,scoreInc).then(response =>{
              element.monster = response;
              monster = response;
              document.getElementById("status").textContent=" Red Team Points:"+monster.Team1_Score+" Green Team Points:"+monster.Team2_Score+" Blue Team Points:"+ monster.Team3_Score
              drawMonsters(monster);
            })
          })
        }
      });
    });
  }
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

function drawShape(monster){
  let data = getRadius(monster);
  circleColour=data.colour;
  radius=data.radius;
  var shape = new google.maps.Circle({
    map:map,
    fillColor:circleColour,
    center:{lat:monster.Latitude,lng:monster.Longitude},
    radius:radius*5});
  return shape;
}


async function updateScore(id,scores){
  const data = {"TM_ID":id,"T1Score":scores[0],"T2Score":scores[1],"T3Score":scores[2]};
  const url="api/monsters/add-score";
  var csrftoken = Cookies.get('csrftoken');
  const params = {credentials: 'include',body:JSON.stringify(data),method:"POST",headers: {"X-CSRFToken": csrftoken,"content-type":"application/json"}};
  return fetch(url,params).then(response => response.json());
}

//might change this to a view campus button
function toggleLocation(){
  if(curLocation==false) {
    curLocation = true;
    console.log("enabled");  
  }
  else if(curLocation==true) curLocation = false;
}

//this one still cool, nice to see big picture
function changeZoom() {
  if(zoomedIn){
      if(map.getZoom()>15){
          
          google.maps.event.addListenerOnce(map, 'zoom_changed', function(event) {
          changeZoom();
      });
      setTimeout(function(){map.setZoom(map.getZoom()-1)},80);
      }
      else{
          zoomedIn=false;
      }
  }
  else{
      if(map.getZoom()<18){
          google.maps.event.addListenerOnce(map, 'zoom_changed', function(event) {
              changeZoom();
          });
          setTimeout(function(){map.setZoom(map.getZoom()+1)},80);
      }
      else{
          zoomedIn=true;
      }
  }
}



function successMove(position){ //will handle distances from monsters to player
  let errorBar = document.getElementById("errorText");
  errorBar.hidden=true;
  console.log(curLocation);
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  if(curLocation==true){
    console.log(latitude,longitude);
    map.panTo({lat:latitude,lng:longitude});
  }
  else{
    //map.panTo({lat:50.73646948193597,lng:-3.5317420013942633})
  }
}
function success(position){ //will handle distances from monsters to player
  return position.coords
}
function failure(err){
  console.log(err)
  let errorBar = document.getElementById("errorText");
  errorBar.hidden=false;
  errorBar.textContent="Error, location not found";
  return [50.73646948193597, -3.5317420013942633]
}

window.initMap = initMap;
</script>

<div class="map-modal">
	<p id="status">Welcome!</p>
	
	<div class="below_map">
	  <button class="mapButton" id="enterScore">Insert trash</button>
	  <button  class="mapButton">Toggle Location</button>
	  <button class="mapButton" >Change Zoom</button>
		<!--onclick="toggleLocation()" onclick = "changeZoom()"-->
	  

	</div>
	
	<div id="mapAwait">
	  <p id="awaitText">Awaiting map</p>
	</div>
	<div id="mapContainer">
	  <p id="errorText" hidden>Error bar</p>
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
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

body {
	background-color: #61846F;
}

li, a, button {
	font-family: "Montserrat", sans-serif;
	font-weight: 500;
	font-size: 0.97vw;
	text-decoration: none;
	decoration: none;
}

a.home:visited {
	text-decoration: none;
	color: white;
}

a.about:visited {
	text-decoration: none;
	color: white;
}

a.login:visited {
	text-decoration: none;
	color: black;
}

a.register:visited {
	text-decoration: none;
	color: black;
}

.images { 
	position: absolute;
}

.green {
	width: 28%;
	position: fixed;
	top: 0;
	left: 0;
	display: inline-block;
}

.red {
	width: 21%;
	position: fixed;
	bottom: 0;
	left: 0;
	display: inline-block;
}

.pale {
	width: 48%;
	height: 87%;
	position: fixed;
	bottom: 0;
	right: 0;
	display: inline-block;
}

.left_plant {
	width: 14%;
	position: fixed;
	bottom: 3vh;
	left: 2.2vw;
	display: inline-block;
}

.right_plant {
	width: 17.5%;
	position: fixed;
	bottom: 0;
	right: 0;
	display: inline-block;
}

.container {
	height: 93vh;
	width: 95vw;
	background-color: #D9D9D9;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	box-shadow: 0px 0.7vw 6vh #272727;
}

.header {
	align-items: center;
	padding: 1.6vw 4vh;
	position: relative;
}

.header {
	z-index: 10;
}

.nav_links li {
	display: inline-block;
	padding: 0px 2.5vh;
}

.nav_links li a {
	transition: all 0.3s ease 0s;
}

.nav_links li a.home:hover {
	color: #FCDFC4;
}

.nav_links li a.about:hover {
	color: #FCDFC4;
}

.nav_links li a.register:hover {
	color: #977453;
}

.nav_links li a.login:hover {
	color: #977453;
}

.home {
	color: #FFFFFF;
	float: left;
}

.about {
	color: #FFFFFF;
	float: left;
}

.register {
	color: #000000;
	float: right;
}

.login {
	color: #000000;
	float: right;
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
