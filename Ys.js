;(function(window, undefined) {
	
	"use strict";
	
	var Ys = {};
	
	/*网站配及=置及用户信息*/
	Ys.config = {};
	
	/*快速选择器*/
	var $=function(id) {
		//return document.getElementById(id);
		return new F(id);
	};
	
	
	/*类jquery实现*/
	var F=function(id) {
		return this.getElementById(id);
	};

	F.prototype.getElementById=function(id) {
		if(typeof(id) === "object") {
			this.element = id;
		} else {
			this.element = document.getElementById(id);
		}
		return this;
	};

	F.prototype.hide=function() {
		this.element.style.display = "none";
	};

	F.prototype.show=function() {
		this.element.style.display = "block";
	};

	F.prototype.element=function() {
		return this.element;
	};
		
	var $class = function(className) {
		return document.getElementsByClassName(className);
	};
	
	Ys.$=$;

	Ys.getElementsByClassName = function (searchClass, node,tag) {
		var result=[];
		if(document.getElementsByClassName) {
			var nodes =  (node || document).getElementsByClassName(searchClass);
			for(var i=0 ;node = nodes[i++]; ) {
				if(tag !== "*" && node.tagName === tag.toUpperCase()) {
					result.push(node);
				}
			}
			return result;
		}else{
			node = node || document;
			tag = tag || "*";
			var classes = searchClass.split(" "),
			elements = (tag === "*" && node.all)? node.all : node.getElementsByTagName(tag),
			patterns = [],
			current,
			match;
			for( var l = 0;l<classes.length;l++) {
				patterns.push(new RegExp("(^|\\s)" + classes[l] + "(\\s|$)"));
			}
			for( var j = 0;j<elements.length;j++) {
				current = elements[j];
				match = false;
				for(var k=0, kl=patterns.length; k<kl; k++){
					match = patterns[k].test(current.className);
					if (!match)  break;
			}
			if (match)  result.push(current);
		}
		return result;
		}
	};

	/*这里借用一下jquery的函数，返回浏览器的vender前缀*/
	var getVendorPrefix = function(index) {
		var body, i, style, transition, vendor ,transEndEventNames,animationEndEventNames;
		body = document.body || document.documentElement;
		style = body.style;
		transition = "transition";
		vendor = ["Moz", "Webkit", "O", "ms", "Khtml"];
		transEndEventNames = ["transitionend", "webkitTransitionEnd", "oTransitionEnd otransitionend", "MSTransitionEnd", "transitionend"];
		animationEndEventNames = ["animationend", "webkitAnimationEnd", "oAnimationEnd oanimationend", "MSAnimationEnd", "animationend"];
		transition = transition.charAt(0).toUpperCase() + transition.substr(1);
		i = 0;
		while (i < vendor.length) {
			if (typeof style[vendor[i] + transition]===  "string") {
				if(index ==1)return vendor[i];
				if(index ==2)return transEndEventNames[i];
				if(index ==3)return animationEndEventNames[i];
			}
			i++;
		}
		return false;
	};
	
	
	var venderPrefix = getVendorPrefix(1);
	var venderTransitionEnd = getVendorPrefix(2);
	var venderAnimationEnd = getVendorPrefix(3);
	
	/*判断当前是否为ie浏览器*/
	Ys._isIE = /*@cc_on!@*/!1;
	
	
	Ys.addEventListener = function(element,type,fn) {
		if(typeof element == 'undefined') return false;
		if(element.addEventListener) {
			element.addEventListener(type,fn,false);
		}
		else if(element.attachEvent) {
		//将事件缓冲到该标签上,已解决this指向window(现fn内this指向element)和移除匿名事件问题
			var _EventRef ='_'+type+'EventRef';
			if(!element[_EventRef]) {
				element[_EventRef]=[];
			}
			var _EventRefs = element[_EventRef];
			var index;
			for(index in _EventRefs) {
				if(_EventRefs[index]['realFn'] == fn) {
					return;
				}
			}
			var nestFn = function() {
				fn.apply(element,arguments);
			};
			element[_EventRef].push( {'realFn':fn,'nestFn':nestFn});
			element.attachEvent('on'+type,nestFn);
		}else {
			element['on'+type] = fn;
		}
	};
	
	Ys.removeListener = function(element,type,fn) {
		if(typeof element == 'undefined') return false;
		if(element.removeEventListener) {
			element.removeEventListener(type,fn,false);
		}
		else if(element.detachEvent) {
			var _EventRef ='_'+type+'EventRef';
			if(!element[_EventRef]) {
				element[_EventRef]=[];
			}
			var _EventRefs = element[_EventRef];
			var index;
			var nestFn;
			for(index in _EventRefs) {
				if(_EventRefs[index]['realFn'] == fn) {
					nestFn = _EventRefs[index]['nestFn'];
					if(index ==_EventRefs.length-1) {
						element[_EventRef] = _EventRefs.slice(0,index);
					}else {
						element[_EventRef] = _EventRefs.slice(0,index).concat(_EventRefs.slice(index+1,_EventRefs.length-1));
					}
					break;
				}
			}
			if(nestFn) {
			element.detachEvent('on'+type,nestFn);
			}
		} else {
			element['on'+type] = null;
		}
	};
	
	Ys.stopDefault = function(e) {
		if (e && e.preventDefault) {//如果是FF下执行这个
			e.preventDefault();
		} else {
			window.event.returnValue = false;//如果是IE下执行这个
		}
		return false;
	};
	
	Ys.addClass = function(element,className) {
		var classArray = null;
		var c = false;
		try {
			classArray = element.className.split(' ');
			for(var i = 0;i<classArray.length;i++) {
				if(classArray[i] == className)c = true;
			}
			if(!c)classArray.push(className);
			element.className = classArray.join(' ');
		}catch(e) {}
	};
	
	Ys.removeClass = function(element,className) {
		var classArray = null;

		try {
			classArray = element.className.split(' ');
			for(var i = 0;i<classArray.length;i++) {
				if(classArray[i] == className)classArray[i] = '';
			}
			element.className = classArray.join(' ');

		}catch(e) {}
	};
	
	
	/**
	 * 2012.8.20
	 *
	 * ajax控件
	 *
	 *
	 */
	
	Ys.ajax = function(options) {
		
		if(typeof options !=='object')options = {};
		
		options = {
			type: options.type || 'POST',
			url: options.url || '',
			async: options.async || 'ture',
			timeout: options.timeout || 5000,
			onComplete: options.onComplete || function() {},
			onError: options.onError || function() {},
			onSuccess: options.onSuccess || function() {},
			onSend: options.onSend || function() {},
			onTimeout: options.onTimeout || function() {},
			acceptdatatype: options.acceptdatatype || 'json',
			data: options.data || '',
			useIframe:options.useIframe|| false,
			formDom:options.formDom|| null
		};
		
		
		var self = this;
		
		self.Ajax = null;
		
		var createAjaxRequest = function() {
			if (typeof XMLHttpRequest == 'undefined')
			{
				self.Ajax = new ActiveXObject("Microsoft.XMLHTTP");
			} else {
				self.Ajax = new XMLHttpRequest();
			}
		};
		
		/*超时时间*/
		var timer;
		
		
		var send = function() {
			
			
			self.Ajax.open(options.type, options.url, options.async);
		
			if (options.type == 'GET') {
				self.Ajax.setRequestHeader("If-Modified-Since", "Thu, 01 Jan 1970 00:00:00 GMT");
				self.Ajax.send();
			}else {
				switch (options.acceptdatatype) {
				case 'json':
					self.Ajax.setRequestHeader("Accept", 'application/json, text/javascript');
					break;
				default:
					self.Ajax.setRequestHeader("Accept", 'application/json, text/javascript');
				}
			}
			
			
			self.Ajax.setRequestHeader("If-Modified-Since", "Thu, 01 Jan 1970 00:00:00 GMT");
			self.Ajax.send(options.data);
			timer = setTimeout(function() {
				if (typeof options.onTimeout == "function") options.onTimeout();
				if (self.Ajax) {
					self.Ajax.abort();
					self.Ajax = null;
				}
				return 0;
			},options.timeout);
		};
		
		
		
		
		var stateHandler = function() {
			switch (self.Ajax.readyState) {
				case 1:
					break;
				case 2:options.onSend();
					break;
				case 3:
					break;
				case 4:
					try {
					switch (self.Ajax.status) {
						case 200:
							if(timer)clearTimeout(timer);
							if(typeof options.onSuccess ===  'function')options.onSuccess(self.Ajax.responseText);
							if(typeof options.onComplete ===  'function')options.onComplete(self.Ajax.responseText);
							break;
						case 404:
							if (timer) clearTimeout(timer);
							if(typeof options.onError ===  'function')options.onError(self.Ajax.responseText);
							options.onComplete(Ajax.responseText);
							break;
						default:
							if (timer) clearTimeout(timer);
							if(typeof options.onComplete ===  'function')options.onComplete(self.Ajax.responseText);
						}
					}catch(e) {}
					break;
				default:
					break;
			}
		};
		
		var useIframeInit = function() {
			var id='iframePost';
			try{
				self.iframe = document.createElement('<iframe id = ' + name + ' name=' + id + '/>');
			}catch(e) {
				self.iframe = document.createElement('iframe');
			}
			self.iframe.id = id;
			self.iframe.name = id;
			self.iframe.src= window.location.href;
			self.iframe.style.position = 'absolute';
			self.iframe.style.top = self.iframe.style.left = '-1000px';
			options.formDom.target = id;
			options.formDom.action = options.url;
			if(options.formDom.encoding) {
				//ie浏览器
				options.formDom.setAttribute('encoding','multipart/form-data');
				options.formDom.setAttribute('enctype','multipart/form-data');//ie8
			}else {
				//w3c
				options.formDom.setAttribute('enctype','multipart/form-data');
			}
			
			document.body.insertBefore(self.iframe,document.body.firstChild);
			
		};
		
		
		var iframeSend = function() {
			
			function checkstate(){
				if(doc.readyState=='complete')alert(doc.responseText);
				else setTimeout(checkstate,200);
				
			}
			
			
			options.formDom.submit();
			//var doc =null;
			/*if (document.all){//IE
                doc = document.frames["iframePost"].document;
			}else{//Firefox    
                doc = document.getElementById("iframePost").contentDocument;
			}*/
			var doc = self.iframe.contentDocument ? self.iframe.contentDocument : self.iframe.document;
			Ys.addEventListener(self.iframe,'load',function() {
				checkstate();
			});
			
			/*setInterval(function(){
				alert()
			},2000)*/

		};
		
		var XHR2Send = function(file) {
			
			if(!file.files.length)
			return;
			//暂时禁用上传按钮
				
			var formData = new FormData();
			//XMLHttpRequest2 对象，支持上传文件
			self.xhr2 = new XMLHttpRequest();
			//已上传字节数
			var uploadedBytes = 0;
			//文件总字节数
			var totalBytes = 0;
		
			formData.append('file',file.files[0]);
			Ys.addEventListener(self.xhr2.upload,'progress',function(e) {
				if (e.lengthComputable) {
					uploadedBytes = e.loaded;
					totalBytes = e.total;
					var percentComplete = Math.round(uploadedBytes * 100 / totalBytes),
					//已上传文件大小
					bytesTransfered = '';
					if (uploadedBytes > 1024 * 1024)bytesTransfered = Math.round(uploadedBytes * 100 / (1024 * 1024)) / 100 + 'MB';
					else bytesTransfered = Math.round(uploadedBytes * 100 / 1024) / 100 + 'KB';
					$('username_info').element.innerHTML = bytesTransfered;
					//上传完成，显示上传文件信息
					if(percentComplete ===  100) {}
				} else {
				}
			});
			
			Ys.addEventListener(self.xhr2,'load',function(e) {
				if(typeof(options.onSuccess)=='function') {
					options.onSuccess(e.target.responseText);
				}
				self.destruct();
			});
			Ys.addEventListener(self.xhr2,'abort',function(e) {
				self.destruct();
			});
			Ys.addEventListener(self.xhr2,'error',function(e) {
				if(typeof(options.onError)=='function') {
					options.onError(e.target.responseText);
				}
				self.destruct();
			});
			
				
			self.xhr2.open(options.type,options.url,options.async);
			self.xhr2.send(formData);

		};
		
		self.destruct = function() {
			self.iframe.src ='';
			self.iframe.parentNode.removeChild(self.iframe);
			self.iframe = null;
			Ys.removeListener(self.xhr2.upload,'progress');
			Ys.removeListener(self.xhr2,'load');
			Ys.removeListener(self.xhr2,'abort');
			Ys.removeListener(self.xhr2,'error');
			self.xhr2 = null;
		};
		
		var run = function() {
			if(options.useIframe) {
				useIframeInit();
				if(typeof(window.FileReader) == 'function'){
					self.Ajax =new XHR2Send(options.formDom['test_input']);
				}
				else iframeSend();
			}else {
				createAjaxRequest();
				self.Ajax.onreadystatechange = stateHandler;
				send();
			}
		};
		
		run();
	
	};
	
	
	/*几个常用的tween算法*/
	var Tween = {
		Linear: function( t, b, c, d) { return c*t/d + b; },
		Quad: {
			easeIn: function(t,b,c,d) {
				return c*(t/=d)*t + b;
			},
			easeOut: function(t,b,c,d) {
				return -c *(t/=d)*(t-2) + b;
			},
			easeInOut: function(t,b,c,d) {
				if ((t/=d/2) < 1) {return c/2*t*t + b;}
				return -c/2 * ((--t)*(t-2) - 1) + b;
			}
		},
		Quart: {
			easeIn: function(t,b,c,d) {
				return c*(t/=d)*t*t*t + b;
			},
			easeOut: function(t,b,c,d) {
				return -c * ((t = t/d-1)*t*t*t - 1) + b;
			},
			easeInOut: function(t,b,c,d) {
				if ((t/=d/2) < 1) {return c/2*t*t*t*t + b;}
				return -c/2 * ((t-=2)*t*t*t - 2) + b;
			}
		},
		Back: {
			easeOut: function(t, b, c, d, s) {
				if (s === undefined) s = 1.70158;
				return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
			}
		},
		Bounce: {
			easeOut: function(t, b, c, d) {
				if ((t /= d) < (1 / 2.75)) {
					return c * (7.5625 * t * t) + b;
				} else if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
				} else if (t < (2.5 / 2.75)) {
					return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
				} else {
					return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
				}
			}
		}
	};
	
	/*
	* 2013.3.27
	*
	* eachSlide插件	
	* 
	* 第一种思路解决方案:
	*	将每个要滑动的元素分别生成object,独立的进行slide
	*	移动超出边界后对位置判断,重新初始化自身位置,是滑动一直进行下去
	*	此种思路不适合广告位,更适合一个展区多个frame或多个模块的滑动	
	*
	* 最近参考了大量滑动的插件，发现这种方式并不适用，理由如下：
	* 1.每个滑动元素单独生成一个实例，之间的关联性较难达到统一控制。要对整体的移动或效果进行操作，
	* 程序复杂性方面过高，暂时无法实现
	* 2.测试了大部分浏览器，在滑动过程中，由于元素单独生成实例，初始化（init）有时间上的先后，
	* 在slide过程中元素之间会有空隙存在。
	* 
	*/
	
	Ys.eachSlide = function(options) {
		
		if(typeof options != 'object')options = {};
		
		/*不知道这个要怎么描述了*/
		var self = this;
		
		/*初始排位*/
		var defaultIndex;
		
		/*延迟容器*/
		var moveOnceTimeOutID;
		var runTimeOutID;
		var runOn = 1;
		var runtimeControlID;
		
		var totalItemNum = options.totalItemNum||5;
		var viewItemNum = options.viewItemNum||4;
		var targetPrefix = options.targetPrefix||'slideItem';
		var startTime = options.startTime||0;//开始时间
		var startPosition = options.startPosition||0;//初始偏移位置
		var duration = options.duration||100;//持续时间
		var step = options.step||1;/*每次tween移动像素*/
		var stepTime = options.stepTime||1;/*每次tween移动时间*/
		var tween = options.tween||'Linear';/*tween算子*/
		var parent =$(options.parentID).element;
		var delay = options.delay||2000;/*每次移动后延迟时间*/
		var direction = options.direction||'left';/*支持向左或向右*/
		
			
		/*初始化*/
		self.init = function(options) {
			defaultIndex = self.index = options.index||0;/*当前target排位*/
			self.target =$(targetPrefix+self.index).element;/*初始化时使用index*/
			self.targetWidth = self.target.offsetWidth;
			self.variation = options.variation||self.targetWidth;/*目的地相对初始位置移动增量*/
		};
		
		/*单次移动*/
		var moveOnce = function(position,tempDirection,callback) {
			/*position为当前target距左边位置*/
			var startTimeTemp = startTime;
			var variation = self.variation;
			var doMove = function() {
				switch (tempDirection) {
				case 'left':startTimeTemp -= stepTime;/*向左滑动*/
					break;
				case 'right':startTimeTemp += stepTime;/*向右滑动*/
					break;
				default:startTimeTemp -= stepTime;
				}
				self.target.style.left =(Math.ceil(position)+Math.ceil(Tween.Quart.easeIn(startTimeTemp,startPosition,variation,duration)))+'px';
				if(Math.abs(startTimeTemp)<duration) {
					moveOnceTimeOutID = setTimeout(doMove,stepTime);
				}
				else {
					clearTimeout(moveOnceTimeOutID);callback();
				}
			};
			doMove();
		};
		
		
		/*滑动至下一个*/
		var next = function(callback) {
			var position = self.index*self.variation;
			moveOnce(position,direction,function() {
				switch (direction) {
					case 'left':self.index--;/*向左滑动*/
						break;
					case 'right':self.index++;/*向右滑动*/
						break;
					default:self.index--;
				}
				callback();
			});
		};
		
		/*滑动至上一个*/
		var previous = function() {
			var position = self.index*self.variation;
			moveOnce(position,(direction =='left'?'right':'left'),function() {
				switch (direction) {
					case 'left':self.index++;/*向左滑动*/
						break;
					case 'right':self.index--;/*向右滑动*/
						break;
					default:self.index--;
				}
			});
		};
		
		self.toPrevious = function() {
			self.stop();
			previous();
			self.restart();
		};
		
		self.toNext = function() {
			self.stop();
			next();
			self.restart();
		};
		/*运行slide*/
		self.run = function(t) {
			if(!runOn)return null;
			var position=null;
			switch (direction) {
				case 'left'://向左滑动
					if(self.index<-(totalItemNum-viewItemNum-1)) {
						self.index = viewItemNum;
						t = self.index;
					}
					position = t*self.variation;
					moveOnce(position,direction,function() {
							runTimeOutID = setTimeout(function() {self.run(--self.index);},delay);
						}
					);
					break;
				case 'right'://向右滑动
					if(self.index>=totalItemNum-1) {
						self.index =-1;
						t = self.index;
					}
					position = t*self.variation;
					moveOnce(position,direction,function() {
							runTimeOutID = setTimeout(function() {self.run(++self.index);},delay);
						}
					);
					break;
			}
		};
		
		
		/*暂停动画后重新启动*/
		self.restart = function() {
			if(runOn)return true;
			runOn = 1;
			runtimeControlID = setTimeout(function() {self.run(self.index);},delay);
		};
		
		/*停止运行,不支持moveonce的停止*/
		self.stop = function() {
			if(!runOn)return true;
			runOn = 0;
			clearTimeout(runTimeOutID);
			clearTimeout(runtimeControlID);
		};
		
		/*初始化参数并开始slide*/
		self.init(options);
		setTimeout(function() {self.run(self.index);},delay);
		
	};
	
	
	/*
	* 2013.4.10
	*
	* Slide插件	
	* 
	* 第二种思路解决方案:
	*	将要滑动的模块
	*	移动超出边界后对位置判断,重新初始化自身位置,是滑动一直进行下去
	*	此种思路适合广告位，一次展示一个frame
	* 
	*   如果浏览器支持css3则使用css3动画效果
	*/
	
	Ys.Slide = function(options) {
		
		if(typeof options != 'object')options = {};

		var self = this;
		
		var totalItem = options.totalItem;
		var itemWidth = options.itemWidth;
		var prefix = options.prefix||'slideItem';
		var duration = options.duration||300;
		var css3Duration=options.css3Duration||options.duration;
		var step = options.step||1;
		var stepTime = options.stepTime||1;
		var delay = options.delay||3000;
		var sliderID = options.sliderID||'slider';
		var slidingTimeoutID;
		var playingTimeoutID;
		var sliding = 0;
		var slider;
		var onShow = 0;
		var before;
		
		var sliderTranslate;
        var venderTransform = venderPrefix + "Transform";
        var venderDuration = venderPrefix + "TransitionDuration";
        var venderTiming = venderPrefix + "TransitionTimingFunction";

		
		self.slideBox = [];
		
		self.init = function() {
			for(var i = 0;i<totalItem;i++) {
				self.slideBox[i]=$(prefix+i).element;
				self.slideBox[i].style.zIndex = 9;
				
				if(i === 0)$(self.slideBox[i]).show();
				else $(self.slideBox[i]).hide();
			}
			slider = $(sliderID).element;
			slider.style.position ='relative';
			if(!itemWidth)itemWidth = slider.offsetWidth;
		};
		
		var build = function(index,onShow,slideDirection) {
			switch(slideDirection) {
				case 'left':
					self.slideBox[index].style.left = itemWidth+'px';
					sliderTranslate = -itemWidth;
					break;
				case 'right':
					self.slideBox[index].style.left = -itemWidth+'px';
					sliderTranslate = itemWidth;
					break;
				default:
					if((index-onShow)<0) {
						self.slideBox[index].style.left = -itemWidth+'px';
						sliderTranslate = itemWidth;
					}else {
						self.slideBox[index].style.left = itemWidth+'px';
						sliderTranslate = -itemWidth;
					}
			}
			$(self.slideBox[index]).show();
			self.slideBox[onShow].style.zIndex = 9;
			self.slideBox[index].style.zIndex = 10;
		};
		
		var doMove = function(index,slideDirection,callback) {
			if(onShow ==index||sliding)return false;
			sliding = 1;
			build(index,onShow,slideDirection);
			before = onShow;
			onShow = index;
			if(venderPrefix) {
				/*浏览器支持css3的情况*/
				slider.style[venderTransform]="translateX("+ sliderTranslate +"px)";
				slider.style[venderTiming]="ease";
				slider.style[venderDuration] = css3Duration+"ms";
				Ys.addEventListener(slider,venderTransitionEnd,function end() {
					$(self.slideBox[before]).hide();
					self.slideBox[onShow].style.left = 0;
					slider.style[venderTransform]="";
					slider.style[venderTiming]="";
					slider.style[venderDuration]="";
					slider.removeEventListener(venderTransitionEnd,end);
					sliding = 0;
					if(typeof callback === 'function')callback();
				});
			}else {
				/*浏览器不支持css3的情况*/
				var startTimeTemp = 0;
				var tmpDuration = duration/8;
				var move = function(callbackTmp) {
					startTimeTemp+=stepTime;
					slider.style.left = Math.ceil(Tween.Quart.easeIn(startTimeTemp,0,sliderTranslate,tmpDuration))+'px';
					if(startTimeTemp<=tmpDuration) {
						slidingTimeoutID = setTimeout(function() {move(callbackTmp);},stepTime);
					}else {
						clearTimeout(slidingTimeoutID);
						$(self.slideBox[before]).hide();
						self.slideBox[onShow].style.left = 0;
						slider.style.left = 0;
						sliding = 0;
						if(typeof callbackTmp === 'function')callbackTmp();
					}
				};
				if(typeof callback === 'function')move(callback);
				else move();
			}
			return true;
		};
		
		self.prev = function(callback) {
			self.stop();
			var index = onShow-1;
			if(index<0)index = totalItem-1;
			doMove(index,'right',function() {self.play();});
		};
		
		self.next = function(callback) {
			self.stop();
			var index = onShow+1;
			if(index>=totalItem)index = 0;
			doMove(index,'left',function() {self.play();});
		};
		
		self.show = function(index) {
			self.stop();
			if(!doMove(index,'',function() {self.play();}))self.play();
		};
		
		self.play = function() {
			playingTimeoutID = setTimeout(function() {
				self.next();
				},delay);
		};
		
		self.stop = function() {
			return clearTimeout(playingTimeoutID);
		};
		
		self.init();
		
		self.play();
	};
	
	
	/*
	* 2013.4.3
	*
	* Slide插件	
	* 
	* 第三种思路解决方案:
	*	要移动的模块堆叠在一起,要展示用的z-index和display控制
	*	效果为淡入淡出替换
	*	此种思路适合广告位,单一模块展示
	*
	* 2013.6.25修改
	* 加入css3的animation效果，优化支持css3的浏览器显示效果
	*	
	*/
	
	Ys.fadeSlide = function(options) {
		
		if(typeof options != 'object')options = {};
		
		var self = this;
		
		var fadeTimeoutID;
		var playTimeoutID;
		
		var totalItem = options.totalItem||5;
		var prefix = options.prefix||'slideItem';
		var startOpacity = options.startOpacity||0;
		var startPosition = options.startPosition||0;/*初始偏移位置*/
		var css3Duration = options.css3Duration||300;/*持续时间*/
		var duration =(options.css3Duration)*0.1||30;/*持续时间*/
		var step = options.step||1;
		var stepTime = options.stepTime||1;
		var tween = options.tween||'Linear';/*tween算子*/
		var variation = 800;/*透明目的值*/
		var delay = options.delay||5000;/*两张切换的延迟*/
		var sliderID = options.sliderID;/**/
		
		var fadingInFlag = 0;
		var fadingOutFlag = 0;
		
		var preShown = 0;
		
		var venderAnimation = venderPrefix + "AnimationName";
        var venderDuration = venderPrefix + "AnimationDuration";
        var venderTiming = venderPrefix + "AnimationTimingFunction";
		
		
		/*正在演示的index*/
		self.onShow = 0;
		
		/*滑动元素容器*/
		self.slideBox = [];
		
		self.init = function() {
			$(sliderID).element.style.position='relative';
			for(var i = 0;i<totalItem;i++) {
				self.slideBox[i]=$(prefix+i).element;
				if(i === 0) {
					$(self.slideBox[i]).show();
					self.slideBox[i].style.opacity = 1;
				}
				else {
					$(self.slideBox[i]).hide();
					self.slideBox[i].style.opacity = 0;
				}
			}
		};
		
		/*单次淡入淡出*/
		var doFade = function(index,time,startOpacity,direction,callback) {
			var opacityValue;
			var timetemp = time;
			opacityValue = Math.ceil(Tween.Quad.easeIn(timetemp,startOpacity,variation,duration));
			if(Ys._isIE) {
				self.slideBox[index].style.filter ="alpha(opacity ="+opacityValue+")";
			}else {
				self.slideBox[index].style.opacity = opacityValue/variation;
			}
			if(direction =='in') {timetemp+=step;}
			if(direction =='out') {timetemp-=step;}
			if(Math.abs(timetemp)<=duration) {
				if(Ys._isIE&&opacityValue>=100) {
					clearTimeout(fadeTimeoutID);
					if(typeof callback =='function')callback();
				}else {
					fadeTimeoutID = setTimeout(function() {doFade(index,timetemp,startOpacity,direction,callback);},stepTime);
				}
			}
			else {
				clearTimeout(fadeTimeoutID);
				if(typeof callback =='function')callback();
			}
		};
		
		/*单次淡出效果*/
		self.fadeOut = function(index,callback) {
			
			try {
				$(self.slideBox[index]).show();
				self.slideBox[index].style.opacity = 1;
				
			}catch(e) {
				self.slideBox[index].style.filter ="alpha(opacity = 100)";
			}
			doFade(index,0,variation,'out',function() {
				if(typeof callback =='function')callback();
			});
		};
		
		/*单次淡入效果*/
		self.fadeIn = function(index,callback) {
			
				try {
					self.slideBox[index].style.opacity = 0;
					$(self.slideBox[index]).show();
				}catch(e) {
					self.slideBox[index].style.filter ="alpha(opacity = 0)";
				}
			
				doFade(index,0,0,'in',function() {
					if(typeof callback =='function')callback();
				});
		};
		
		/*呈现标识符为index的元素*/
		self.show = function(index,callback) {
			if(self.onShow == index||fadingInFlag == 1)return false;
			fadingInFlag = 1;
			preShown = self.onShow;
			self.onShow = index;
			if(venderPrefix) {
			/*浏览器支持css3时渐变*/
				$(self.slideBox[index]).show();
				self.slideBox[index].style[venderAnimation]="fadeIn";
				self.slideBox[preShown].style[venderAnimation]="fadeOut";
				self.slideBox[index].style[venderTiming] = self.slideBox[preShown].style[venderTiming]="ease-out";
				self.slideBox[index].style[venderDuration] = self.slideBox[preShown].style[venderDuration] = css3Duration+"ms";
				Ys.addEventListener(self.slideBox[index],venderAnimationEnd,function end() {
					self.slideBox[index].style.opacity = 1;
					self.slideBox[index].style.zIndex = 10;
					self.slideBox[preShown].style.opacity = 0;
					$(self.slideBox[preShown]).hide();
					self.slideBox[preShown].style.zIndex = 9;
					self.slideBox[index].style[venderAnimation] = self.slideBox[preShown].style[venderAnimation]="";
					self.slideBox[index].style[venderTiming] = self.slideBox[preShown].style[venderTiming]="";
					self.slideBox[index].style[venderDuration] = self.slideBox[preShown].style[venderDuration]="";
					self.slideBox[index].removeEventListener(venderTransitionEnd,end);
					fadingInFlag = 0;
					if(typeof callback === 'function')callback();
				});
			}else {
				/*浏览器不支持css3时的渐变*/
				self.slideBox[preShown].style.zIndex = 9;
				self.slideBox[index].style.zIndex = 10;
				self.fadeIn(index,function() {
					$(self.slideBox[preShown]).hide();
					fadingInFlag = 0;
					if(typeof callback =='function')callback();
				});
			}
		};
		
		self.previous = function(callback) {
			self.stop();
			if(self.onShow === 0)self.show(totalItem-1,function() {
				if(typeof callback == 'function')callback();
				});
			else self.show(self.onShow-1,function() {
				if(typeof callback == 'function')callback();
				});
		};
		
		self.next = function(callback) {
			self.stop();
			if(self.onShow ==(totalItem-1))self.show(0,function() {
				if(typeof callback == 'function')callback();
				});
			else self.show(self.onShow+1,function() {
				if(typeof callback == 'function')callback();
				});
		};
		
		/*循环播放*/
		self.play = function() {
			if(playTimeoutID)clearTimeout(playTimeoutID);
			playTimeoutID = setTimeout(function() {
				self.next(function() { self.play();});
			},delay);
		};
		
		self.stop = function() {
			if(playTimeoutID)clearTimeout(playTimeoutID);
		};
		
		self.init();
		
		self.play();
	};
	
	/*表单验证组件*/
	Ys.formValidator = function(options) {
		
		if(typeof options != 'object')options = {};
		
		var self = this;
		
		self.regexEnum = {
			
			captcha:"^\\w{4}$",								//四字母
			password:"^.{6,40}$",
			intege:"^-?[1-9]\\d*$",					//整数
			intege1:"^[1-9]\\d*$",					//正整数
			intege2:"^-[1-9]\\d*$",					//负整数
			num:"^([+-]?)\\d*\\.?\\d+$",			//数字
			num1:"^[1-9]\\d*|0$",					//正数（正整数 + 0）
			num2:"^-[1-9]\\d*|0$",					//负数（负整数 + 0）
			decmal:"^([+-]?)\\d*\\.\\d+$",			//浮点数
			decmal1:"^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$",　　	//正浮点数
			decmal2:"^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$",　 //负浮点数
			decmal3:"^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$",　 //浮点数
			decmal4:"^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$",　　 //非负浮点数（正浮点数 + 0）
			decmal5:"^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$",　　//非正浮点数（负浮点数 + 0）

			email:"^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", //邮件
			color:"^[a-fA-F0-9]{6}$",				//颜色
			url:"^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$",	//url
			chinese:"^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$",					//仅中文
			ascii:"^[\\x00-\\xFF]+$",				//仅ACSII字符
			zipcode:"^\\d{6}$",						//邮编
			mobile:"^(13|15)[0-9]{9}$",				//手机
			ip4:"^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$",	//ip地址
			notempty:"^\\S+$",						//非空
			picture:"(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$",	//图片
			rar:"(.*)\\.(rar|zip|7zip|tgz)$",								//压缩文件
			qq:"^[1-9]*[1-9][0-9]*$",				//QQ号码
			tel:"^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$",	//电话号码的函数(包括验证国内区号,国际区号,分机号)
			username:"^\\w+$",						//用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
			letter:"^[A-Za-z]+$",					//字母
			letter_u:"^[A-Z]+$",					//大写字母
			letter_l:"^[a-z]+$",					//小写字母
			idcard:"^[1-9]([0-9]{14}|[0-9]{17})$"	//身份证
		};
	
		function matchStr(regexEnum,str,rgExp) {
			if(!regexEnum[rgExp])return false;
			if(str.match(regexEnum[rgExp]) === null)return false;
			return true;
		}
		
		function checkOnce(index) {
			if(!matchStr(self.regexEnum,self.toVerifyItems[index].value,options.verifyType[index])) {
				Ys.removeClass(self.itemsWrap[index],'right');
				Ys.addClass(self.itemsWrap[index],'wrong');
				self.infoWrap[index].innerHTML = options.errorInfo[index];
				return false;
			}else {
				Ys.removeClass(self.itemsWrap[index],'wrong');
				Ys.addClass(self.itemsWrap[index],'right');
				self.infoWrap[index].innerHTML = '';
				self.validValue[index] = true;
				return true;
			}
		}
		
		options = {
			formId:options.formId||'form',
			asyncPost:options.asyncPost||'true',
			toVerifyItems:options.toVerifyItems,
			itemsWrap:options.itemsWrap||'',
			infoWrap:options.infoWrap||'',
			verifyType:options.verifyType,
			errorInfo:options.errorInfo||''
		};
		
		self.form =$(options.formId).element;
		self.toVerifyItems = [];
		self.itemsWrap = [];
		self.infoWrap = [];
		self.validValue = [];
		
		self.init = function() {
			
			for(var j = 0;j<options.toVerifyItems.length;j++) {
				self.toVerifyItems[j] = $(options.toVerifyItems[j]).element;
				if(!matchStr(self.regexEnum,self.toVerifyItems[j].value,options.verifyType[j])) {
					self.validValue[j] = false;
				}else {
					self.validValue[j] = true;
				}
				if(typeof(options.itemsWrap[j])=='undefined') {
					self.itemsWrap[j] = self.toVerifyItems[j].parentNode;
				}
				if(typeof(options.infoWrap[j])=='undefined') {
					self.infoWrap[j] = $(self.toVerifyItems[j].id+'_info').element;
				}
			}
			
			for(var i = 0;i<options.toVerifyItems.length;i++) {
				
				Ys.addEventListener(self.toVerifyItems[i],'blur',function(i) {
					return function(){
						checkOnce(i);
					};
				}(i));
			}
			
			Ys.addEventListener(self.form,'submit',function(e) {
				for(var i = 0;i<options.toVerifyItems.length;i++) {
					if(self.validValue[i] === false) {
						if(!checkOnce(i)){
							Ys.stopDefault(e);
						}
					}
				}
			});
		};
		
		self.init();
		
	};
	
	
	
	/*
	 *
	 *
	 *	拖拽组件
	 *  粗糙实现
	 *
	 *	
	*/
	Ys.Drag = {
		obj: null,
		init: function (options) {
			options.handler.onmousedown = this.start;
			options.handler.root = options.root || options.handler;
			var root = options.handler.root;
			root.onDragStart = options.dragStart || new Function();
			root.onDrag = options.onDrag || new Function();
			root.onDragEnd = options.onDragEnd || new Function();
		},
		start: function (e) {
			/*此时的this是handler */
			var obj = Drag.obj = this;
			obj.style.cursor = 'move';
			e = e || Drag.fixEvent(window.event);
			ex = e.pageX;
			ey = e.pageY;
			obj.lastMouseX = ex;
			obj.lastMouseY = ey;
			var x = obj.root.offsetLeft;
			var y = obj.root.offsetTop;
			obj.root.style.left = x + "px";
			obj.root.style.top = y + "px";
			document.onmouseup = Drag.end;
			document.onmousemove = Drag.drag;
			obj.root.onDragStart(x, y);
		},
		drag: function (e) {
			e = e || Drag.fixEvent(window.event);
			ex = e.pageX;
			ey = e.pageY;
			var root = Drag.obj.root;
			var x = root.style.left ? parseInt(root.style.left) : 0;
			var y = root.style.top ? parseInt(root.style.top) : 0;
			var nx = ex - Drag.obj.lastMouseX + x;
			var ny = ey - Drag.obj.lastMouseY + y;
			root.style.left = nx + "px";
			root.style.top = ny + "px";
			Drag.obj.root.onDrag(nx, ny);
			Drag.obj.lastMouseX = ex;
			Drag.obj.lastMouseY = ey;
		},
		end: function (e) {
			var x = Drag.obj.root.style.left ? parseInt(Drag.obj.root.style.left) : 0;
			var y = Drag.obj.root.style.top ? parseInt(Drag.obj.root.style.top) : 0;
			Drag.obj.root.onDragEnd(x, y);
			document.onmousemove = null;
			document.onmouseup = null;
			Drag.obj = null;
		},
		fixEvent: function (e) {
			e.pageX = e.clientX + document.documentElement.scrollLeft;
			e.pageY = e.clientY + document.documentElement.scrollTop;
			return e;
		}
	};
	
	Ys.showOverlay = function() {
		var overlay = document.createElement('div');
		overlay.id = 'overlay';
		document.body.insertBefore(overlay,document.body.firstChild);
	};
	
	Ys.collect = function(prefix,url) {
		
		var params = [];
	
		params[0]= document.URL || '';
		var args ='p ='+prefix;
	
		var c = new Ys.ajax( {
			url:url+args,
			type:'GET'
		});
	};

	Ys.loadJs = function(url) {
		var i;
		var ss = document.getElementsByTagName("script");
		for (i = 0; i < ss.length; i++) {
			if (ss[i].src && ss[i].src.indexOf(url) != -1) {
				return;
			}
		}
		var s = document.createElement("script");
		s.type = "text/javascript";
		s.src = url;
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(s);
	};
	
	window.Ys = Ys;
	
})(window);

