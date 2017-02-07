function checkConsigneeName(t,id)
{
	var submit_disabled = false;
	if (t.value.length < 1) { 
		document.getElementById(id).innerHTML = 'Please input your first name.';
		submit_disabled = true;
	} else {
		document.getElementById(id).innerHTML = '';
	}

	if (submit_disabled) {
		document.forms['theForm'].elements['Submit'].disabled = 'disabled';
		return false;
	}
}
function checkLastName(t,id)
{
	var submit_disabled = false;
	if (t.value.length < 1) { 
		document.getElementById(id).innerHTML = 'Please input your last name';
		submit_disabled = true;
	} else {
		document.getElementById(id).innerHTML = '';
	}

	if (submit_disabled) {
		document.forms['theForm'].elements['Submit'].disabled = 'disabled';
		return false;
	}
}
function checkCountry(t,id)
{
	var submit_disabled = false;
	if (t.value.length<1) {
		document.getElementById(id).innerHTML = 'Please select Country.';
		submit_disabled = true;
	} else {
		document.getElementById(id).innerHTML = '';
	}

	if (submit_disabled) {
		document.forms['theForm'].elements['Submit'].disabled = 'disabled';
		return false;
	}
}
function checkProvince(t,id)
{
	var submit_disabled = false;
	if (t.value.length<1) {
		document.getElementById(id).innerHTML = 'Please select Province.';
		submit_disabled = true;
	} else {
		document.getElementById(id).innerHTML = '';
	}

	if (submit_disabled) {
		document.forms['theForm'].elements['Submit'].disabled = 'disabled';
		return false;
	}
}
function checkCity(t,id)
{
	var submit_disabled = false;
	if (t.value.length < 2) { 
		document.getElementById(id).innerHTML = 'At least 2 characters.';
		submit_disabled = true;
	} else {
		document.getElementById(id).innerHTML = '';
	}
}
function checkAddress(t,id)
{
	var submit_disabled = false;
	if (t.value.length < 5) { 
		document.getElementById(id).innerHTML = 'At least 5 characters.';
		submit_disabled = true;
	} else {
		document.getElementById(id).innerHTML = '';
	}
}
function checkMobile(t,id)
{
	var submit_disabled = false;
	if (t.value.length < 5) { 
		document.getElementById(id).innerHTML = 'At least 5 numbers.';
		submit_disabled = true;
	} else {
		document.getElementById(id).innerHTML = '';
	}
}
function checkZipcode(t,id)
{
	var submit_disabled = false;
	if (t.value.length < 4) { 
		document.getElementById(id).innerHTML = 'At least 4 characters.';
		submit_disabled = true;
	} else {
		document.getElementById(id).innerHTML = '';
	}
}

function check_preg_match(v, type) {
	var pattern = '';
	switch (type) {
	case 'taxpayer_id':
		pattern = '^[0-9]{15,}$';
		break;
	case 'name':
		pattern = '^[0-9A-z]+ *[0-9A-z]+$';
		break;
	case 'phone_number':
		pattern = '^1[0-9]{10}$';
	}
	var preg = new RegExp(pattern);
	return preg.test(v);
}