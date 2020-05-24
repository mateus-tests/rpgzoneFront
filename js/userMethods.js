const loadUser = async () => {
	let nick = document.querySelector("#nick-field");
	let id = document.querySelector("#id-field");
	let lastLogin = document.querySelector("#last-login-field");
	let proState = document.querySelector("#pro-state-field");
	const res = await Fetch.getAuth(`http://localhost:9090/account`)
	if(res){
		nick.innerHTML = "My nick: " + res.nickName;
		id.innerHTML = "My ID: " + res.userID;
		lastLogin.innerHTML = "My Last Login: " + res.lastLogin;
		proState.innerHTML = "My PRO state: " + res.pro;
	}
	else{
		window.alert("Error");
	}
	totalPlayers();
	loadMyInvites();	
}

const userDecision = async e => {
	const props = JSON.parse(e.target.value);
	if(props.accept){
		const response = await Fetch.postAuthWithoutResponse(`http://localhost:9090/rooms/${props.roomID}`);
		if(response.status === 204){
			window.alert('You accepted this invite');
		}
		else{
			window.alert('Error while you was tried entrance into this room');
		}
	}
	const inviteDeleted = await Fetch.deleteAuth(`http://localhost:9090/user/invites/${props.roomID}`);
	loadMyInvites();
	
}

const loadMyInvites = async () => {
	let col2 = document.querySelector('.col-2');
	let content = '';
	
	const res = await Fetch.getAuth('http://localhost:9090/user/invites');
	if(res.length === 0) { col2.innerHTML = ''; } else {
		res.forEach( async room => {
			const roomDetails = await Fetch.getAuth('http://localhost:9090/rooms');
			if(roomDetails){
				roomDetails.forEach( roomDetail => {
					if(room.roomID == roomDetail.roomID){
						content += `
										<div class="section blur-purple-dark">
											<div class="invites">
												<span>Room nick -> ${roomDetail.roomNick}</span></br>
												<button value=${ JSON.stringify({ accept : true , roomID : roomDetail.roomID }) }  class="accept-or-refuse">Accept</button>
												<button value=${ JSON.stringify({ accept : false , roomID : roomDetail.roomID }) } class="accept-or-refuse">Refuse</button>
											</div>
										</div>
						`;
					}
				});
				
				col2.innerHTML = content;
				document.querySelectorAll('.accept-or-refuse').forEach( item => {
					item.addEventListener('click', userDecision);
				});
			}
			else{
				window.alert('Error on load room details');
			}
		});
	}
}

const totalPlayers = async () => {
	let totalPlayers = document.querySelector("#total-players-field");
	const res = await Fetch.getAuth("http://localhost:9090/user/account/quantity")
	if( res ){
		totalPlayers.innerHTML = "Total Players: " + res;
	}
	else{
		window.alert("Error");
	}
}

const loadProfile = () => {
	let password = document.getElementsByName("password")[0];
	let matchPassword = document.getElementsByName("matchpassword")[0];
	let email = document.getElementsByName("email")[0];
	let nick = document.getElementsByName("nickname")[0];
	let bio = document.getElementsByName("bio")[0];
	let profilePicture = document.querySelector("#profile-picture");
	Fetch.getAuth(`http://localhost:9090/account`)
	.then( res => {
		profilePicture.src = res.profilePicture;
		password.value = res.password;
		email.value = res.email;
		nick.value = res.nickName;
		bio.value = res.bio;
		matchPassword.value = res.password;
	})
	.catch(_ => {
		window.alert("Error");
	});
}

const updateProfile = () => {
	let password = document.getElementsByName("password")[0];
	let matchPassword = document.getElementsByName("matchpassword")[0];
	let email = document.getElementsByName("email")[0];
	let nick = document.getElementsByName("nickname")[0];
	let bio = document.getElementsByName("bio")[0];
	
	const token = JSON.parse(localStorage.getItem("session")).token;
	
	const data = {
		"bio" : bio.value,
		"password" : password.value,
		"nickName" : nick.value,
		"email" : email.value
	}
	
	Fetch.putAuth("http://localhost:9090/user", data)
	.then( resp => {
		window.location.href = "./my-profile.html";
	})
	.catch(_ => {
		window.alert("Error");
	});
}


const selectedThisRoom = roomID => {
	Fetch.postAuthWithoutResponse(`http://localhost:9090/rooms/${roomID}` )
	.then( () => {
		window.alert("Insert with success in Room!!!");
		searchRooms();
	})
	.catch (_ => {
		window.alert("Room Full!!!");
	});
}

const isNumber = str => {
    return !isNaN(str)
}

const clearString = wordField => {                
    let newString = "";           
    for( let i = 0; i < wordField.length; i++ ) {       
        if( wordField.charAt(i) !== ' ' ) {           
            newString += wordField.charAt(i);                  
        }
    }        
	return newString.trim();
}

const searchKeyword = (props) => {
	const { room, searchField, filters  } = props;
	let finded = false;
	let content = "";
	let searchFieldText = isNumber(searchField.value) ? clearString(searchField.value) : clearString( ( searchField.value ).toUpperCase() );
	
	const waysOfCompare = {
		"compareByNick" : () => {
			return clearString( ( room.roomNick ).toUpperCase() ) == searchFieldText;
		},
		"compareByID" : () => {
			return room.roomID == searchFieldText;
		},
		"compareByPlayer" : () => {
			let findedUser = false;
			room.users.forEach( user => {
				if( clearString( ( user.nickName ).toUpperCase() ) == searchFieldText )
					findedUser = true;
			});
			return findedUser;
		},
		"compareByGame" : () => {
			if(room.roomConfig != null)
				return clearString( ( room.roomConfig.game.title ).toUpperCase() ) == searchFieldText;
			return false;
		},
		"default" : () => {
			return false;
		}
	}
	for(let i = 0; (!finded) && (i < filters.length); i++){
		finded = waysOfCompare[filters[i]]();
	}
	return finded	? `
						<div>
							<span> - ID : ${room.roomID}</span><br/>
							<span> - Room Nick : ${room.roomNick}</span><br/>
							<span> - Room Description : ${room.roomDescription}</span><br/>
							<span> - Room Game : ${ room.roomConfig != null ? room.roomConfig.game.title : "null"}</span><br/>
							<span> - Qtd players : ${ room.qtdeUsersInRoom}</span><br/>
							<button class="btn btn-primary btn-large" onclick=selectedThisRoom(${room.roomID})>Enter in this room</button>
						</div> ` 
					: " ";
	
}

const searchRooms = () => {
	let myRooms = new Array();
	Fetch.getAuth("http://localhost:9090/rooms/myrooms")
	.then( resp => {
		resp.forEach( room => {
			myRooms.push(room.roomID);
		});
		searchExec(myRooms);
	})
	.catch(_ => {
		console.log("Error Ocurred in request myRooms");
	});
}

const searchExec = myRooms => {
	let filters = document.getElementsByName("option");
	let searchField = document.querySelector("#search");
	let searchResult = document.querySelector("#search-result");
	let content = "";
	Fetch.getAuth("http://localhost:9090/rooms")
	.then( resp => {
		if(searchField.value == ""){
			resp.forEach( room => {
				content +=  (myRooms.indexOf(room.roomID) == -1) 	&&
							(parseInt(room.qtdeUsersInRoom) < 6) 	? 
																	`	<div>
																			<span> - ID : ${room.roomID}</span><br/>
																			<span> - Room Nick : ${room.roomNick}</span><br/>
																			<span> - Room Description : ${room.roomDescription}</span><br/>
																			<span> - Room Game : ${ room.roomConfig != null ? room.roomConfig.game.title : "null"}</span><br/><br/>
																			<span> - Qtd players : ${ room.qtdeUsersInRoom}</span><br/>
																			<button class="btn-yes btn-yes-primary btn-yes-large" onclick=selectedThisRoom(${room.roomID})>Enter in this room</button>
																		</div>`
																	:
																		" ";
			});
		}
		else{
			resp.forEach( room => {
				content +=  (myRooms.indexOf(room.roomID) == -1) 	&&
							(parseInt(room.qtdeUsersInRoom) < 6)  	?
																		searchKeyword({
																			"room" : room,
																			"searchField" : searchField,
																			"filters" : [
																				filters[0].checked ? "compareByNick" : "default",
																				filters[1].checked ? "compareByID" : "default",
																				filters[2].checked ? "compareByPlayer" : "default",
																				filters[3].checked ? "compareByGame" : "default", 
																			]
																		})
																	: 
																		"";
			});
		}
		searchResult.innerHTML = content;
	})
	.catch(_ => {
		window.alert("Error");
	});
}

const enterInThisRoom = roomID => {
	window.location.href = "./room.html";
}


const redirectSearchRoom = () => window.location.href = "./room-search.html";

const loadMyRooms = () => {
	let roomsResult = document.querySelector("#rooms-result");
	let content = "";
	let count = 0;
	let nullContent = 	`<div>
							<span> - Nothing yet...</span><br/><br/>
							<span style="cursor: pointer;" onclick="redirectSearchRoom();" >     -> CLICK HERE FOR SEARCH ROOMS</span><br/><br/>
						</div>`;
	Fetch.getAuth("http://localhost:9090/rooms/myrooms")
	.then( resp => {
		resp.forEach( room => {
			content += `	<div>
								<span> - ID : ${room.roomID}</span><br/>
								<span> - Room Nick : ${room.roomNick}</span><br/>
								<span> - Room Description : ${room.roomDescription}</span><br/>
								<span> - Room Game : ${ room.roomConfig != null ? room.roomConfig.game.title : "null"}</span><br/>
								<span> - Qtd players : ${ room.qtdeUsersInRoom}</span><br/>
								<button class="btn-yes btn-yes-primary btn-yes-large" onclick=enterInThisRoom(${room.roomID})>Enter in this room</button>
							</div>`;
			count++;
		});
		
		roomsResult.innerHTML = (count == 0) ? nullContent : content;
	})
	.catch(_ => {
		console.log("Error Ocurred in request myRooms");
	});
}

const loadSearchPageByPlayer = () => {
	const form = document.querySelector('#search-form');
	loadAllUsers();
	form.addEventListener('submit', e => {
		e.preventDefault();
		searchPlayer();
	});
	
}
const selectRoom = async e => {
	const { userID, roomID } = JSON.parse(e.target.value);
	const response = await Fetch.postAuthWithoutResponse(`http://localhost:9090/rooms/${roomID}/${userID}`);
	if(response.status === 204){
		window.alert("user was invited with success!!!");
		window.location.href = './players-search.html';
	}
}

const insertEvent = () => {
	$('.inline').modaal({
		content_source: '#room-selector',
		before_open : e => {
			console.log(e.target.value);
			let finded = false;
			for(let i = 0; !finded && i < availableRooms.length; i++){
				if(availableRooms[i].userID == e.target.value){
					$('#room-selector').html( `${ availableRooms[i].content }`);
					finded = true;
				}
			}
			$('.room-submit').on('click', selectRoom);
		},
		after_close : () => {
			$('#room-selector').html("");
		}
	});
}

let availableRooms = [];

const loadAvailableRooms = async (userID) => {
	const response = await Fetch.getAuth(`http://localhost:9090/rooms/myrooms/filtered/${userID}`);
	let content = '';
	
	if(response){
		response.forEach( room => {
			content += `
						<div class="room" >
							<div class="room-id-label">
								<span class="room-id-label">ID: </span><span class="room-id">${room.roomID}</span>
							</div>
							<div class="room-nick">
								<span class="room-nick">${room.roomNick}</span>
								<button value=${ JSON.stringify({userID : userID, roomID : room.roomID}) } class="room-submit">Add User in this room</button>
							</div>
						</div>
			`;
		});
	}
	else {
		window.alert("Err");
	}
	availableRooms.push({ content : content, userID : userID });
	console.log(availableRooms);
}

const loadAllUsers = async () => {
	const response = await Fetch.getAuth("http://localhost:9090/user");
	const searchResult = document.querySelector('#search-result');
	let content = '';
	let indexUsers = [];
	availableRooms = [];
	if(response){
		response.forEach( user => {
			content += `
							<div class="player">
								<span class="nick-label label">Nick: </span><span class="nick">${user.nickName}</span><br>
								<span class="bio-label label">Bio: </span><span class="bio">${user.bio}</span><br>
								<span class="id-label label">ID: </span><span class="bio">${user.userID}</span><br>
								<button value=${user.userID} class="inline btn btn-primary">Add</button>
							</div>
			`;
			indexUsers.push(`${user.userID}`);
		});
	}
	indexUsers.forEach( async index => {
		await loadAvailableRooms(index);
	});
	searchResult.innerHTML = content;
	
	insertEvent();
}

const searchPlayer = async () => {
	
	let textInputValue = document.querySelector('#search').value;
	if(textInputValue !== ""){
		availableRooms = [];
		let indexUsers = [];
		textInputValue = isNumber(textInputValue) ? clearString(textInputValue) : clearString(textInputValue).toUpperCase();
		const response = await Fetch.getAuth("http://localhost:9090/user");
		const searchResult = document.querySelector('#search-result');
		let content = '';
		if(response){
			response.forEach( user => {
				if(clearString(user.nickName).toUpperCase() === textInputValue){
					content += `
								<div class="player">
									<span class="nick-label label">Nick: </span><span class="nick">${user.nickName}</span><br>
									<span class="bio-label label">Bio: </span><span class="bio">${user.bio}</span><br>
									<span class="id-label label">ID: </span><span class="bio">${user.userID}</span><br>
									<button value=${user.userID} class="inline btn btn-primary">Add</button>
								</div>
					`;
					indexUsers.push(`${user.userID}`);
				}
			});
		}
		indexUsers.forEach( async index => {
			await loadAvailableRooms(index);
		});
		searchResult.innerHTML = content;
		insertEvent();
	}
	else{
		loadAllUsers();
	}
	
}