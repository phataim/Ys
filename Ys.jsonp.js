;(function(){
	if (typeof(window.Ys) === 'undefined') window.Ys = {};
    Ys.jsonp = function(options){

        Ys.jsonp.id = 0;

        var script = document.createElement('script');

        if(/\?/.test(options.url)){
            script.src = options.url + '&callback=' + options.callback;
        } else {
            script.src = options.url + '?callback=' + options.callback;
        }
 
        var tmpData = null;

        window[options.callback] = function(data){tmpData = data};

        script.onload = script.onreadystatechange = function(){
            if(typeof(this.readyState) === "undefined" || this.readyState === "loaded" || this.readyState === "complete" ){
            
                options.onSuccess(tmpData);
                tmpData = null;
                delete window[options.callback];
                var tmp = document.getElementById('jsonpScript' + Ys.jsonp.id);
                tmp.parentNode.removeChild(tmp);
                Ys.jsonp.id++;
            } 
        }
        script.id = 'jsonpScript' + Ys.jsonp.id;
        Ys('#content')[0].appendChild(script);   

    }
    
})(window);
