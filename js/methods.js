
const verifyEmailWasAccept = () => {
	
	/*let session = JSON.parse(localStorage.getItem("session"));
	if(!session.userDataSignUp){
		console.log('userDataSignUp IS null');
	}
	else{
		let query = window.location.search.slice(1);
		let parts = query.split('&');
		let data = {};
		parts.forEach( part => {
			let keyValue = part.split('=');
			let key = keyValue[0];
			let value = keyValue[1];
			data[key] = value;
		});
		console.log(data.token == session.userDataSignUp.token);
		if(data.token == session.userDataSignUp.token){
			signUpApproved();
		}
	}
	console.log(session.userDataSignUp);*/
}

const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (caractere) => {
    let random = Math.random() * 16 | 0;
	let value = caractere == 'x' ? random : (random & 0x3 | 0x8);
    return value.toString(16);
  });
}

const signUp = async () => {
	if(inputIsValid()){
		let session = JSON.parse(localStorage.getItem("session"));
		const data = {
			"password" : `${document.getElementsByName("password")[0].value}`,
			"nickName" : `${document.getElementsByName("nickname")[0].value}`,
			"email" : `${document.getElementsByName("email")[0].value}`,
			"type" : "normal",
			"token" : uuid()
		}
		session.userDataSignUp = data;
		localStorage.setItem("session", JSON.stringify(session));
		/*const body = {
			"token" : `${data.token}`,
			"email" : `${data.email}` ,
			"nickName" : `${data.nickName}`
		}
		let response = await Fetch.post("https://api-mercadopago-integration.herokuapp.com/email", body);//link do gitpod
		if(response.status == 200){
			window.alert('The email was sent successfully, see your inbox');
			window.location.href = './index.html';
		}
		else{
			window.alert('Error sending the e-mail');
		}*/
		signUpApproved();
	}
}

const signUpApproved = async () => {
	let session = JSON.parse(localStorage.getItem("session"));
	const data = {
		"email" : `${session.userDataSignUp.email}`,
		"nickName" : `${session.userDataSignUp.nickName}`,
		"password" : `${session.userDataSignUp.password}`,
		"type" : `${session.userDataSignUp.type}`
	}
	let response = await Fetch.post("http://localhost:9090/user", data);
	if(response){
		session.token = null;
		session.userDataSignUp = null;
		localStorage.setItem("session", JSON.stringify(session));
		setTimeout( () => {
			window.location.href = "./index.html";
		}, 1000);
	}
}

const inputIsValid = () => {
	return document.getElementsByName("password")[0].value == document.getElementsByName("matchpassword")[0].value;
}

const signIn = async () => {
	const session = JSON.parse( localStorage.getItem("session") );
	const data = {
		"password" : `${document.getElementsByName("password")[0].value}`,
		"nickName" : `${document.getElementsByName("nickname")[0].value}`
	}
	Fetch.post("http://localhost:9090/auth/login", data)
	.then( resp => {
		//resp.token já é o token
		session.token = resp.token;//armazenando o token jwt para o usuário estar autenticado em requisições posteriores
		localStorage.setItem("session", JSON.stringify(session));
		setTimeout( async () => {
			let response = await Fetch.getAuth('http://localhost:9090/account');
			if(response){
				if(response.pro == 'True'){
					window.location.href = "./dashboard.html";
				}
				window.location.href = "./be-a-pro-request.html";
			}
		}, 1000);
	})
	.catch(_ => {
		window.alert("An Error occurred with your credentials try sign in or sign up page");
	});
}

const createRoom = () => {
	let roomNick = (document.getElementsByName("room-nick")[0].value).trim();
	let roomDescription = document.getElementsByName("room-description")[0].value;
	let popUp = document.getElementsByClassName("modal-container")[0];
	let data = {
		"roomNick" : roomNick,
		"roomDescription" : roomDescription
	}
	
	Fetch.postAuth("http://localhost:9090/rooms", data)
	.then( resp => {
		let session = JSON.parse( localStorage.getItem('session') );
		session.roomID = resp.roomID;
		console.log(session.roomID);
		localStorage.setItem("session", JSON.stringify(session));
		popUp.classList.remove("hidden-flex-container");
		popUp.classList.add("show-flex-container");
		popUp.addEventListener('click', (e) => {
			if(e.target.id == "background-pop-up")
				closePopUp();
		});
	})
	.catch(_ => {
		window.alert("You arrived the limit of rooms per user !!!");
	});
}

const closePopUp = () => {
	let popUp = document.getElementsByClassName("modal-container")[0];
	popUp.classList.add("hidden-flex-container");
	popUp.classList.remove("show-flex-container");
}

const redirectRoomConfig = () => { window.location.href = "./new-room-options.html"; }
