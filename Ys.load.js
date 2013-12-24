;(function(){
	if (typeof(window.Ys) === 'undefined') window.Ys = {};
	Ys.load = function(options){
		var op = {
			url:options.url,
			onSuccess:options.onSuccess
		}
		var script = document.createElement('script');
		script.onload = script.onreadystatechange = function(){
			console.log(script.readyState)
		}
		script.src = op.url;
		document.body.appendChild(script)
		// Ys.ajax({
		// 	type:'GET',
		// 	url:op.url,
		// 	onSuccess:function(data){

		// 	}
		// })
	}
	
})(window);