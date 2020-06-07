function toggleFAB(fab) {
    if (document.querySelector(fab).classList.contains('show')) {
        document.querySelector(fab).classList.remove('show');
    } else {
        document.querySelector(fab).classList.add('show');
    }
}

document.querySelector('.fab .main').addEventListener('click', function () {
    toggleFAB('.fab');
});

document.querySelectorAll('.fab ul li button').forEach((item) => {
    item.addEventListener('click', function () {
        toggleFAB('.fab');
    });
});

/*Embed features */
/* URL */
function refreshURL(source){
    let iframe = document.getElementById('embed-url');
    iframe.src = source;
    document.getElementById('embed-url').style.display = 'block';
    document.getElementById('object-pdf').style.display = 'none';
    document.getElementById('embed-pdf').style.display = 'none';
}
/* PDF */
async function refreshPDF(){
    let object = document.getElementById('object-pdf');
	let embed = document.getElementById('embed-pdf');
	let session = JSON.parse(localStorage.getItem('session'));
	let response = await Fetch.getAuth(`http://localhost:9090/rooms/${session.roomID}`);
	source = response.roomConfig.game.pdfGuide;
    object.data = source;
    embed.src = source;
    document.getElementById("embed-pdf").style.display = 'block';
    document.getElementById('object-pdf').style.display = 'block';
    document.getElementById("embed-url").style.display = 'none';
}

/*MAPA*/
let map;
function GetMap(lat,lon){
		map = new Microsoft.Maps.Map('#myMap', {
			center: new Microsoft.Maps.Location(lat,lon), //Location center position
			mapTypeId: Microsoft.Maps.MapTypeId.load, //aerial,canvasDark,canvasLight,birdseye,grayscale,streetside
			zoom: 17  //Zoom:1=zoomOut ~ 20=zoomUp
		});
    
}

/*COLOCAR PUSHPIN */

const addPushpinMap = async (country, zipcode, street, props) => {
	const { latitude, longitude } = await getCoords(country, zipcode, street);
	createPushpin(map.getCenter(), props, (pin) => {
		map.entities.push(pin);
		console.log('teste');
		Microsoft.Maps.Events.addHandler(pin, 'click', pin => {
			//make show this session on left side
		});
	});
} 

function createPushpin(location, props, callback) {

    const pin = new Microsoft.Maps.Pushpin(location, {
        icon: './assets/favicon.png',
		title: props.title,
        subTitle: props.subTitle,
        anchor: new Microsoft.Maps.Point(12, 39)
    });

    if (callback) {
        callback(pin);
    }
	
}

/* OBTER COORDENADAS */



const getCoords = async (country, zipcode, street) => {
	//street = street.replace(" ","");
	//zipcode = zipcode.replace("-","");
	console.log(country, zipcode, street);
    const requestURL = "http://dev.virtualearth.net/REST/v1/Locations?countryRegion="+country+"&postalCode="+zipcode+"&addressLine="+street+"&key=AnzqHklo_lvZR_czqcvXPo-hrYNQ6qElpbIAOWL0U6fgDrJxdvdKazPtBPlFklpu";
    console.log(requestURL);
	const response = await Fetch.get(requestURL);
    const lat = response.resourceSets[0].resources[0].bbox[0];
    const lon = response.resourceSets[0].resources[0].bbox[1];
	return {
		latitude : lat,
		longitude : lon
	}
}

const refreshMap = async () => {
	let sessions = JSON.parse(localStorage.getItem('session'));
	let street;
	let country;
	let zipcode;
	console.log(sessions.roomID);
	let response = await Fetch.getAuth(`http://localhost:9090/session/sort/${sessions.roomID}`);
	if(response.length === 0){
		street = "Rua 18 de Abril";
		country = "Brazil";
		zipcode = "08226021";
	}
	else {
		/*sessão mais recente*/
		street = response[0].street;
		country = response[0].country;
		zipcode = response[0].zipCode;
	}
	const { latitude, longitude } = await getCoords(country, zipcode, street);
	document.getElementById('reload').style.display = 'none';
	GetMap(latitude,longitude);
}

const loadPlayers = async (response) => {
	let playerList = document.querySelector('#players-list');
	playerList.innerHTML = '';
	let contentPlayerList = response.users.map( async userID => {
		const userResponse = await Fetch.getAuth(`http://localhost:9090/user/${userID}`);
		return `
								<li><a href="#" class="nickname">${userResponse.nickName}</a></li>
		`;
	});
	contentPlayerList.forEach( user => {
		user.then( result => {
			playerList.innerHTML += result;
		}).catch (_ => { console.log("Error") });
	} );
}

const loadSessions = async (roomID) => {
	const response = await Fetch.getAuth(`http://localhost:9090/session/sort/${roomID}`);
	/*response.sessions.forEach( session => {
		let date = session.brazilianDate;
		addPushpinMap(session.country, session.zipCode, session.street, {
			"title" : date.dayOfWeek,
			"subTitle" : date.dia + "/" + date.mes + "/" + date.ano
		});
	});*/
	let content = '';
	let container = document.querySelector('#next-sessions');
	
	response.forEach( session => {
		let date = session.brazilianDate;
		content += `
					<div class="session">
						<div class="date">
							<h2>
								${date.dayOfWeek}
							<h2>
							<span>
								${date.dia}/${date.mes}/${date.ano}
							</span>
						</div>
						<div class="location">
							<div>
								<h2>
									Country : ${session.country}
								</h2>
								<span>
									Street : ${session.street} <br> ID : ${session.sessionID}
								</span>
							</div>
							
						</div>
						<button value=${ JSON.stringify({sessionID : session.sessionID, roomID : roomID}) } class="edit-session-button btn-primary" >Edit</button>
						<button value=${ JSON.stringify({sessionID : session.sessionID, roomID : roomID}) } class="edit-session-button btn-primary" >Edit</button>
					</div>
		`;
	});
	container.innerHTML = content;
	
	document.querySelectorAll('.edit-session-button').forEach( editable => {
		editable.addEventListener('click', editDate, false);
	});
}

const loadRoom = async () => {
	
	let session = JSON.parse(localStorage.getItem('session'));
	
	const response = await Fetch.getAuth(`http://localhost:9090/rooms/${session.roomID}`);
	
	loadPlayers(response);
	//await refreshMap('Brazil','08226-021','Rua 18 de Abril');
	loadSessions(session.roomID);
	
}


const requestEditing = async (props) => {
	let value = document.getElementById('edit-date-input').value;
	let dia = value.substring(0, 2);
	let mes = value.substring(3, 5);
	let ano = value.substring(6, 10);
	if( !Number(dia) || !Number(mes) || !Number(ano) ){
		window.alert('input error');
		return;
	}
	if( !verifyIfDateIsValid(Number(ano) + "-" + Number(mes) + "-" + Number(dia)) ){
		window.alert('Older date than today');
		return;
	}
	const data = {
		"ano" : Number(ano),
		"mes" : Number(mes),
		"dia" : Number(dia)
	}
	
	const response = await Fetch.putAuth(`http://localhost:9090/session/${props.roomID}/${props.sessionID}`, data);

	return response;
	
	
}

const verifyValidDate = (e) => {
	let value = e.target.value;
	if(value.length === 2 || value.length === 5){
		document.getElementById('edit-date-input').value = value + '/';
	}
	if(value.length > 10){
		document.getElementById('edit-date-input').value = value.substring(0, 10);
	}
}


const editDate = (e) => {
	const props = JSON.parse(e.target.value);
	let popUp = document.getElementsByClassName("modal-container")[0];
	popUp.classList.remove("hidden-flex-container");
	popUp.classList.add("show-flex-container");
	popUp.addEventListener('click', (e) => {
		if(e.target.id == "background-pop-up")
			closePopUp();
	});
	document.getElementById('edit-date-input').addEventListener('change', verifyValidDate, false);
	document.getElementById('edit-date-input').addEventListener('keyup', verifyValidDate, false);
	document.querySelectorAll('.response-modal').forEach( button => {
		button.addEventListener('click', async (e) => {
			e.preventDefault();
			if(e.target.value === 'done'){
				const response = await requestEditing(props);
				console.log(response);
			}
			loadSessions(props.roomID);
			closePopUp();
			
		}, false);
	});
}

const closePopUp = () => {
	let popUp = document.getElementsByClassName("modal-container")[0];
	popUp.classList.add("hidden-flex-container");
	popUp.classList.remove("show-flex-container");
}

