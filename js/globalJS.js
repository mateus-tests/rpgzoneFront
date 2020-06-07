
const sessionStore = {
	"token" : null,
	"userDataSignUp" : null,
	"roomID" : null
}

const init = () => {
	let session = JSON.parse( localStorage.getItem("session") );
	if(!session){
		session = sessionStore;
		localStorage.setItem("session", JSON.stringify(session));
	}
}//em qualque página precisa antes de tudo iniciar o armazenamento local da sessão

function injectFavicon(){

    let element = document.getElementsByTagName('head')[0];
        element.innerHTML +=
    `
    <link rel="shortcut icon" href="assets/favicon.png" />
    <meta name="theme-color" content="#5e2a53">
    
    `;
}



function inject(){
	init();//chama a função que cria o armazenamento da sessão do usuário(localStorage);
}


/* Execution trace */
injectFavicon();
inject();
