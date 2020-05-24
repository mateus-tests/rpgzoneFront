
const loadBeaPro = async () => {
	let response = await Fetch.getAuth('http://localhost:9090/account');
	if(response){
		if(response.pro == 'True'){
			window.location.href = "./be-a-pro-success.html";
		}
	}
}

window.Mercadopago.setPublishableKey("TEST-8d4d74ff-c2eb-4c00-8e93-eff108ba3de2");

window.Mercadopago.getIdentificationTypes();


document.getElementById('cardNumber').addEventListener('keyup', guessPaymentMethod);
document.getElementById('cardNumber').addEventListener('change', guessPaymentMethod);

function guessPaymentMethod(event) {
    let cardnumber = document.getElementById("cardNumber").value;

    if (cardnumber.length >= 6) {
        let bin = cardnumber.substring(0,6);
        window.Mercadopago.getPaymentMethod({
            "bin": bin
        }, setPaymentMethod);
    }
};

function setPaymentMethod(status, response) {
    if (status == 200) {
        let paymentMethodId = response[0].id;
        let element = document.getElementById('payment_method_id');
        element.value = paymentMethodId;
        getInstallments();
    } else {
        alert(`payment method info error: ${response}`);
    }
}


function getInstallments(){
    window.Mercadopago.getInstallments({
        "payment_method_id": document.getElementById('payment_method_id').value,
        "amount": parseFloat(document.getElementById('transaction_amount').value)

    }, function (status, response) {
        if (status == 200) {
            document.getElementById('installments').options.length = 0;
            response[0].payer_costs.forEach( installment => {
                let opt = document.createElement('option');
                opt.text = installment.recommended_message;
                opt.value = installment.installments;
                document.getElementById('installments').appendChild(opt);
            });
        } else {
            alert(`installments method info error: ${response}`);
        }
    });
}


getInstallments();


doSubmit = false;
if(document.querySelector('#pay')){
	document.querySelector('#pay').addEventListener('submit', doPay, false);
}


function doPay(event){
    event.preventDefault();
    let form = event.target;
	console.log(form);
    window.Mercadopago.createToken(form, sdkResponseHandler);
};

async function sdkResponseHandler(status, response) {
	console.log(response);
	console.log(status);
	
    if (status == 200 || status == 201) {
        let form = document.querySelector('#pay');
        let card = document.createElement('input');
        card.setAttribute('name', 'token');
        card.setAttribute('type', 'hidden');
        card.setAttribute('value', response.id);
        form.appendChild(card);
        doSubmit=true;
        form.submit();
    }else{
		window.alert("filed data error");
    }
}
