;(function(){
    Ys = window.Ys || {};
    Ys.observer = function(){
        var ob = function(){
            //订阅者数组
            this.subscribers = [];
        }
        ob.prototype  = {
            //订阅方法，返回订阅event标识符
            sub:function(evt , fn){
                this.subscribers[evt]?this.subscribers[evt].push(fn):(this.subscribers[evt] = [])&&this.subscribers[evt].push(fn);
                return '{"evt":"' + evt +'","fn":"' + (this.subscribers[evt].length - 1) + '"}';
            },
            //发布方法，成功后返回自身
            pub:function(evt , args){
                if(this.subscribers[evt]){
                    for (var i in this.subscribers[evt]) {
                        if(typeof(this.subscribers[evt][i]) === 'function'){
                            this.subscribers[evt][i](args);
                        }
                    };
                    return this;
                }
                return false;
            },
            //解除订阅，需传入订阅event标识符
            unsub:function(subId){
                try{
                    var id = JSON.parse(subId);
                    this.subscribers[id.evt][id.fn] = null;
                    delete this.subscribers[id.evt][id.fn];
                }catch(err){
                    console.log(err);
                }
            }
        }
        return new ob();
    }
})(window);
