const setPro = async () => {
	let response = await Fetch.getAuth('http://localhost:9090/account');
	if(response){
		if(response.pro == 'False'){
			await Fetch.put('http://localhost:9090/user/rank/pro');
			let verifyPro = await Fetch.getAuth('http://localhost:9090/account');
			console.log(verifyPro.pro);
		}
		else{
			window.alert('You already pro');
		}
	}
}