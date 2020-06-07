const loadNewRoomOptions = async () => {
	let content = '';
	let target = document.querySelector('#game-selector');
	let response = await Fetch.getAuth('http://localhost:9090/rooms/configs');
	
	content += '<h1>Select a Game!</h1>';
	response.games.forEach( game => {
		content += `
					<div  class="game-body">
						<img src='assets/rpgdb/thumb/${game.gameImage}' class="game-image"/>
						<div class="game-info">
							<span class="info">Title: </span><h5 class="game-title">${game.title}</h5><br>
							<span class="info">Year: </span><span class="game-year-release">${game.year}</span><br>
							<span class="info">Publisher: </span><span class="game-publisher">${game.publisher}</span><br>
							<span class="info">Language: </span><span class="game-language">${game.language}</span><br>
						</div>
						<button value='${ JSON.stringify(game) }' class="game-body-card"></button>
					</div>
		`;
	});
	content += '<h1>Select a Plot!</h1>';
	response.plots.forEach( plot => {
		content += `
					<div class="plots">
						<p>${plot}</p>
						<button value='${ JSON.stringify(plot) }' class="plot-card"></button>
					</div>
		`;
	});
	content += '<h1>Select a Game Rules!</h1>';
	response.gameRules.forEach( gameRules => {
		content += `
					<div class="gameRules">
						<p>${gameRules}</p>
						<button value='${ JSON.stringify(gameRules) }' class="gameRule-card"></button>
					</div>
					
		`;
	});
	content += `<button onclick="submitConfigs()" class="btn-primary button-ready">Ready</button>`
	target.innerHTML = content;
	setEvents();
}

const submitConfigs = async () => {
	const session = JSON.parse( localStorage.getItem('session') );
	if(!gameCard || !plotCard || !gameRuleCard){
		window.alert('Choose one from each field');
	}
	else{
		const data = {
			game : JSON.parse(gameCard),
			gameRules : gameRuleCard,
			plot : plotCard
		}
		let response = await Fetch.putAuth(`http://localhost:9090/rooms/${session.roomID}`, data);
		if(!response){
			window.alert('Error');
		}
		else{
			window.location.href = './room.html';
		}
	}
}

const setEvents = () => {
	document.querySelectorAll('.game-body-card').forEach( card => {
		card.addEventListener('dblclick', selectThisGameCard, false);
	});
	document.querySelectorAll('.plot-card').forEach( card => {
		card.addEventListener('dblclick', selectThisPlotCard, false);
	});
	document.querySelectorAll('.gameRule-card').forEach( card => {
		card.addEventListener('dblclick', selectThisGameRuleCard, false);
	});
}

let gameCard = null;
let plotCard = null;
let gameRuleCard = null;

const selectThisGameCard = e => {
	document.querySelectorAll('.game-body-card').forEach( card => {
		card.style.border = 'none';
		card.style.background = 'transparent';
	});
	gameCard = e.target.value;
	e.target.style.border = '2px solid orange';
	e.target.style.background = 'rgba(255, 80, 80, .1)';
}
const selectThisPlotCard = e => {
	document.querySelectorAll('.plot-card').forEach( card => {
		card.style.border = 'none';
		card.style.background = 'transparent';
	});
	plotCard = e.target.value;
	e.target.style.border = '2px solid purple';
	e.target.style.background = 'rgba(128, 0, 128, .1)';
}
const selectThisGameRuleCard = e => {
	document.querySelectorAll('.gameRule-card').forEach( card => {
		card.style.border = 'none';
		card.style.background = 'transparent';
	});
	gameRuleCard = e.target.value;
	e.target.style.border = '2px solid red';
	e.target.style.background = 'rgba(150, 0, 0, .1)';
}