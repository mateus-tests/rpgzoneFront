
const signUp = () => {
	if(inputIsValid()){
		const data = {
			"password" : `${document.getElementsByName("password")[0].value}`,
			"nickName" : `${document.getElementsByName("nickname")[0].value}`,
			"email" : `${document.getElementsByName("email")[0].value}`,
			"type" : "normal"
		}
		Fetch.post("http://localhost:9090/user", data)
		.then( () => {
			let session = JSON.parse(localStorage.getItem("session"));
			session.token = null;
			localStorage.setItem("session", JSON.stringify(session));
			setTimeout( () => {
				window.location.href = "./index.html";
			}, 1000);
		});
	}
}

const inputIsValid = () => {
	return document.getElementsByName("password")[0].value == document.getElementsByName("matchpassword")[0].value;
}

const signIn = () => {
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
		setTimeout( () => {
			window.location.href = "./be-a-pro-request.html";
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
		console.log(resp);
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