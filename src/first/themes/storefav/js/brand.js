// JavaScript Document
function guanzhu1(sid){
	Ajax.call('user.php', 'act=add_guanzhu&suppId=' + sid, selcartResponse1, 'GET', 'JSON');
}
function selcartResponse1(result){
	if(result.error == 0){
		alert(result.info)
		$("#collect_brand_"+result.brand_id).html(result.content);
	}else if(result.error == 1){
		$('#myModal').modal();
		return;
		//alert(result.info)
		//window.location.href='user.php';
		//return;
	}else{
		alert(result.info)
		$("#collect_brand_"+result.brand_id).html(result.content);
	}
}

function cancel_fav(sid){
	Ajax.call('user.php', 'act=del_follow&supplierid=' + sid, cancel_favResponse1, 'GET', 'JSON');
}
function cancel_favResponse1(result){
	if(result.error == 0){
		alert(result.info)
		$("#collect_brand_"+result.brand_id).html(result.content);
	}else if(result.error == 1){
		$('#myModal').modal();
		return;
		//alert(result.info)
		//window.location.href='user.php';
		//return;
	}else{
		alert(result.info)
		$("#collect_brand_"+result.brand_id).html(result.content);
	}
}
