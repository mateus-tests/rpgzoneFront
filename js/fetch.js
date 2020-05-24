
Fetch = {
	get : url => {
		return new Promise( (resolve, reject) => {//gerando uma promessa ou seja já que é uma ação assícrona então essa ação pode ocorrer instantaneamente ou demorar muito para retornar algo ou até mesmo não responder
			fetch(url, {//fazendo a requisição pela api do próprio navegador
				headers : {
					'Content-Type' : 'application/json'
				},
				method: "GET",
				mode: "cors"
			})
			.then(resp => {//quando há uma resposta então executa esse bloco
				if(resp.status == 401){
					window.alert("UNAUTHORIZED");
					window.location.href = "./index.html";
				}
				if(resp.status == 404){
					window.location.href = "./404.html";
				}
				else if(resp.status !== 200){
					reject("Don't was possible to make this action");
				} else {
					resp.json().then(data => resolve(data));
				}
				
			})
			.catch(_ => {//captura algum erro do servidor
				alert("Server unavailable.");
			});
		});
	},
	getAuth : url  => {
		const token = JSON.parse( localStorage.getItem("session") ).token;//token com jwt
		return new Promise( (resolve, reject) => {
			fetch(url,{
				headers : {
					'Content-Type' : 'application/json',
					'Authorization': 'Bearer ' + token
				},
				method: "GET",
				mode: "cors"
			})
			.then( resp => {
				if(resp.status == 404){
					window.location.href = "./404.html";
				}
				if(resp.status == 401){
					window.alert("UNAUTHORIZED !!! Try login later");
					window.location.href = "./index.html";
				} else if(resp.status !== 200 && resp.status !== 204 && resp.status !== 203 && resp.status !== 202 && resp.status !== 201){
					window.alert("Don't was possible to make this action");
				} else{
					resp.json().then( data => resolve(data));
				}
			})
			.catch(_ => {
				window.alert("Some Error Ocurred in request!!!");
			});
		});
	},
	
	userIsAuthenticated : url  => {
		const token = JSON.parse( localStorage.getItem("session") ).token;//token com jwt
		return new Promise( (resolve, reject) => {
			fetch(url,{
				headers : {
					'Content-Type' : 'application/json',
					'Authorization': 'Bearer ' + token
				},
				method: "GET",
				mode: "cors"
			})
			.then( resp => {
				if(resp.status == 404){
					window.location.href = "./404.html";
				}
				if(resp.status === 200 || resp.status === 204 || resp.status === 203 || resp.status === 202 || resp.status === 201){
					window.location.href = "./be-a-pro-request.html";//se o usuário já estiver autenticado ele será redirecionado direto para a página sua dashboard com seu perfil
				}
			})
			.catch(_ => {
				window.alert("Some Error Ocurred in request!!!");
			});
		});
	},
	
	post : (url, data) => {
		return new Promise( (resolve, reject) => {
			fetch(url, {
				headers : {
					'Content-Type' : 'application/json'
				},
				method: "POST",
				mode: "cors",
				body: JSON.stringify(data)
			})
			.then( res => {
				if(res.status == 404){
					window.location.href = "./404.html";
				}
				if(res.status == 401){
					window.alert("UNAUTHORIZED!!! Try login later");
					window.location.href = "./index.html";
				} else if(res.status !== 200 && res.status !== 204 && res.status !== 203 && res.status != 202 && res.status != 201){
					reject("Don't was possible to make this action");
				} else{
					res.json().then( resp => {
						resolve(resp);
					})
				}
			})
			.catch(_ => {
				alert("Server unavailable.");
			});
		});
	},
	
	postAuth : (url, data) => {
		const token = JSON.parse(localStorage.getItem("session")).token;
		/*if(token == null){
			window.alert("Look like that you don't is logged !!!");
			window.location.href = "./home.html";
		}*/
		return new Promise( (resolve, reject) => {
			fetch(url, {
				headers : {
					'Content-Type' : 'application/json',
					'Authorization' : 'Bearer ' + token
				},
				method : "POST",
				mode : "cors",
				body : JSON.stringify(data)
			})
			.then( resp => {
				if(resp.status == 404){
					window.location.href = "./404.html";
				}
				if(resp.status == 401){
					window.alert("UNAUTHORIZED");
					window.location.href = "./index.html";
				} else if(resp.status !== 200 && resp.status !== 204 && resp.status !== 203 && resp.status != 202 && resp.status != 201){
					reject("Don't was possible to make this action");
				} else{
					resp.json().then( data => { resolve(data) });
				}
			})
			.catch(_ => {
				window.alert("Server unavailable.");
			});
		});
	},
	
	postAuthWithoutResponse : (url) => {
		const token = JSON.parse(localStorage.getItem("session")).token;
		return new Promise( (resolve, reject) => {
			fetch(url, {
				headers : {
					'Authorization' : 'Bearer ' + token
				},
				method : "POST",
				mode : "cors"
			})
			.then( resp => {
				if(resp.status == 404){
					window.location.href = "./404.html";
				}
				if(resp.status == 401){
					window.alert("UNAUTHORIZED");
					window.location.href = "./index.html";
				} else if(resp.status !== 200 && resp.status !== 204 && resp.status !== 203 && resp.status != 202 && resp.status != 201){
					reject("Don't was possible to make this action");
				} else{
					resolve(resp);
				}
			})
			.catch(_ => {
				window.alert("Server unavailable.");
			});
		});
	},
	
	put : (url) => {
		return new Promise( (resolve, reject) => {
			fetch(url, {
				headers : {
					'Content-Type' : 'application/json'
				},
				method: "PUT",
				mode: "cors",
			})
			.then( res => {
				if(res.status == 404){
					window.location.href = "./404.html";
				}
				if(res.status == 401){
					window.alert("UNAUTHORIZED!!! Try login later");
					window.location.href = "./index.html";
				} else if(res.status !== 200 && res.status !== 204 && res.status !== 203 && res.status != 202 && res.status != 201){
					reject("Don't was possible to make this action");
				} else{
					resolve(res);
				}
			})
			.catch(_ => {
				alert("Server unavailable.");
			});
		});
	},
	
	putAuth : (url, data) => {
		const token = JSON.parse(localStorage.getItem("session")).token;
		return new Promise( (resolve, reject) => {
			fetch(url, {
				headers : {
					'Content-Type' : 'application/json',
					'Authorization' : 'Bearer ' + token
				},
				method : "PUT",
				mode : "cors",
				body : JSON.stringify(data)
			})
			.then( resp => {
				if(resp.status == 404){
					window.location.href = "./404.html";
				}
				if(resp.status == 401){
					window.alert("UNAUTHORIZED!!! Try Login later!!!");
				} else if(resp.status != 200){
					window.alert("Unknown Error");
				} else{
					resp.json().then( data => resolve(data) );
				}
			})
			.catch(_ => {
				window.alert("Internal Error");
			});
		});
	},
	deleteAuth : (url) => {
		const token = JSON.parse(localStorage.getItem("session")).token;
		return new Promise( (resolve, reject) => {
			fetch(url, {
				headers : {
					'Content-Type' : 'application/json',
					'Authorization' : 'Bearer ' + token
				},
				method : 'DELETE',
				mode : 'cors',
			})
			.then( resp => {
				if(resp.status == 404){
					window.location.href = "./404.html";
				}
				if(resp.status == 401){
					window.alert("UNAUTHORIZED!!! Try Login later!!!");
				} else if(resp.status != 200){
					window.alert("Unknown Error");
				} else{
					resp.json().then( data => resolve(data) );
				}
			})
			.catch(_ => {
				window.alert("Internal Error");
			});
		});
		
	}
}