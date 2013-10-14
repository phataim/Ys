/*
* 2013.3.27
*
* eachSlide插件    
* 
* 第一种思路解决方案:
*    将每个要滑动的元素分别生成object,独立的进行slide
*    移动超出边界后对位置判断,重新初始化自身位置,是滑动一直进行下去
*    此种思路不适合广告位,更适合一个展区多个frame或多个模块的滑动    
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
    var parent = Ys('#'+options.parentID).element;
    var delay = options.delay||2000;/*每次移动后延迟时间*/
    var direction = options.direction||'left';/*支持向左或向右*/
    
        
    /*初始化*/
    self.init = function(options) {
        defaultIndex = self.index = options.index||0;/*当前target排位*/
        self.target = Ys('#'+targetPrefix+self.index).element;/*初始化时使用index*/
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
            self.target.style.left =(Math.ceil(position)+Math.ceil(Ys.Tween.Quart.easeIn(startTimeTemp,startPosition,variation,duration)))+'px';
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
*    将要滑动的模块
*    移动超出边界后对位置判断,重新初始化自身位置,是滑动一直进行下去
*    此种思路适合广告位，一次展示一个frame
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
    
    var controllerPrefix = options.controllerPrefix;
    var controllerOnClass = options.controllerOnClass;
    var sliderTranslate;
    var vendorTransform = Ys.vendorPrefix + "Transform";
    var vendorDuration = Ys.vendorPrefix + "TransitionDuration";
    var vendorTiming = Ys.vendorPrefix + "TransitionTimingFunction";
     
    self.slideBox = [];
    self.controllerBox = [];
    
    self.init = function() {
        for(var i = 0;i<totalItem;i++) {
            self.slideBox[i] = Ys('#'+prefix+i).element;
            self.slideBox[i].style.zIndex = 9;
            self.slideBox[i].style.position = 'absolute';
             self.controllerBox[i] = Ys('#'+controllerPrefix+i).element;
             if(i === 0){
                Ys(self.slideBox[i]).show();
                Ys.addClass(self.controllerBox[i],controllerOnClass);
            }
            else Ys(self.slideBox[i]).hide();
        }
        slider = Ys('#'+sliderID).element;
        slider.style.position ='absolute';
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
        Ys(self.slideBox[index]).show();
        self.slideBox[onShow].style.zIndex = 9;
        self.slideBox[index].style.zIndex = 10;
    };
    
    var doMove = function(index,slideDirection,callback) {
        if(onShow ==index||sliding)return false;
        Ys.addClass(self.controllerBox[index],controllerOnClass);
        Ys.removeClass(self.controllerBox[onShow],controllerOnClass);
        sliding = 1;
        build(index,onShow,slideDirection);
        before = onShow;
        onShow = index;
        if(Ys.vendorPrefix) {
            /*浏览器支持css3的情况*/
            slider.style[vendorTransform]="translateX("+ sliderTranslate +"px)";
            slider.style[vendorTiming]="ease";
            slider.style[vendorDuration] = css3Duration+"ms";
            Ys.addEventListener(slider,Ys.vendorTransitionEnd,function end() {
                Ys(self.slideBox[before]).hide();
                self.slideBox[onShow].style.left = 0;
                slider.style[vendorTransform]="";
                slider.style[vendorTiming]="";
                slider.style[vendorDuration]="";
                slider.removeEventListener(Ys.vendorTransitionEnd,end);
                sliding = 0;
                if(typeof callback === 'function')callback();
            });
        }else {
            /*浏览器不支持css3的情况*/
            var startTimeTemp = 0;
            var tmpDuration = duration/8;
            var move = function(callbackTmp) {
                startTimeTemp+=stepTime;
                slider.style.left = Math.ceil(Ys.Tween.Quart.easeIn(startTimeTemp,0,sliderTranslate,tmpDuration))+'px';
                if(startTimeTemp<=tmpDuration) {
                    slidingTimeoutID = setTimeout(function() {move(callbackTmp);},stepTime);
                }else {
                    clearTimeout(slidingTimeoutID);
                    Ys(self.slideBox[before]).hide();
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
    
    self.goto = self.show = function(index) {
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
*    要移动的模块堆叠在一起,要展示用的z-index和display控制
*    效果为淡入淡出替换
*    此种思路适合广告位,单一模块展示
*
* 2013.6.25修改
* 加入css3的animation效果，优化支持css3的浏览器显示效果
*    
*/

Ys.fadeSlide = function(options) {
    
    if(typeof options != 'object')options = {};
    
    var self = this;
    
    var fadeinTimeoutID,fadeoutTimeoutID;
    var playTimeoutID;
    
    var totalItem = options.totalItem||5;
    var prefix = options.prefix||'slideItem';
    var startOpacity = options.startOpacity||0;
    var startPosition = options.startPosition||0;/*初始偏移位置*/
    var duration = options.duration||300;
    var css3Duration = options.css3Duration||options.duration||300;/*持续时间*/
    
    //var duration =(options.css3Duration)*0.1||30;/*持续时间*/
    var step = options.step||1;
    var stepTime = options.stepTime||1;
    var tween = options.tween||'Linear';/*tween算子*/
    var variation = 100;/*透明目的值*/
    var delay = options.delay||5000;/*两张切换的延迟*/
    var sliderID = options.sliderID;/**/
     /*controller*/
    var controllerPrefix = options.controllerPrefix || null;
    var controllerOnClass = options.controllerOnClass || null;
    
    var fadingInFlag = 0;
    var fadingOutFlag = 0;
    
    var preShown = 0;
    
    // var vendorAnimation = Ys.vendorPrefix + "AnimationName";
  //       var vendorDuration = Ys.vendorPrefix + "AnimationDuration";
  //       var vendorTiming = Ys.vendorPrefix + "AnimationTimingFunction";
    
    
    /*正在演示的index*/
    self.onShow = 0;
    
    /*滑动元素容器*/
    self.slideBox = [];
    self.controllerBox = [];
     self.init = function() {
        Ys('#'+sliderID).element.style.position = 'relative';
        for(var i = 0 ; i<totalItem ; i++) {
            self.slideBox[i] = Ys('#' + prefix + i).element;
            self.slideBox[i].style.position = 'absolute';
            self.slideBox[i].style.top = self.slideBox[i].style.left = 0;
             if(controllerPrefix !== null) {
                self.controllerBox[i] = Ys('#' + controllerPrefix + i).element;
                Ys('#' + controllerPrefix + i).bind("click",function(index){
                    return function() {
                        self.goto(index);
                    };
                }(i));
                /*$(controllerPrefix + i).bind("click",function(){
                    console.log(this);
                    
                });*/
            }
            if(i === 0) {
                Ys.addClass(self.controllerBox[i],controllerOnClass);
                Ys(self.slideBox[i]).show();
                self.slideBox[i].style.opacity = 1;
            }
            else {
                Ys(self.slideBox[i]).hide();
                self.slideBox[i].style.opacity = 0;
            }
        }
    };
    
    /*单次淡入淡出*/
    var doFade = function(index,time,startOpacity,direction,callback) {
        var opacityValue;
        var timetemp = time;
        opacityValue = Math.ceil(Ys.Tween.Linear(timetemp,startOpacity,variation,duration));
        if(Ys._IEVersion !== undefined && Ys._IEVersion<=8) {
            self.slideBox[index].style.filter ="alpha(opacity ="+opacityValue+")";
            
        }else {
            self.slideBox[index].style.opacity = opacityValue/variation;
        }
        if(direction =='in') {
            timetemp+=step;
            if(Math.abs(timetemp)<=duration) {
                // if(Ys._IEVersion !== undefined && Ys._IEVersion<=8 && opacityValue>=100) {
                // clearTimeout(fadeinTimeoutID);
                // if(typeof callback =='function')callback();
                // }else {
                    fadeinTimeoutID = setTimeout(function() {doFade(index,timetemp,startOpacity,direction,callback);},stepTime);
                //}
            }
            else {
                clearTimeout(fadeinTimeoutID);
                if(typeof callback =='function')callback();
            }
        }
        if(direction =='out') {
            timetemp-=step;
            
            if(Math.abs(timetemp)<=duration) {
                // if(Ys._isIE&&opacityValue>=100) {
                // clearTimeout(fadeoutTimeoutID);
                // if(typeof callback =='function')callback();
                // }else {
                    fadeoutTimeoutID = setTimeout(function() {doFade(index,timetemp,startOpacity,direction,callback);},stepTime);
                // }
            }
            else {
                clearTimeout(fadeoutTimeoutID);
                if(typeof callback =='function')callback();
            }
        }
        
    };
    
    /*单次淡出效果*/
    self.fadeOut = function(index,callback) {
        if(Ys._IEVersion !== undefined && Ys._IEVersion<=8) {
            self.slideBox[index].style.filter ="Alpha(opacity = 100)";
        } else {
            self.slideBox[index].style.opacity = 1;
        }
        Ys(self.slideBox[index]).show();
        doFade(index,0,variation,'out',function() {
            if(typeof callback =='function')callback();
        });
    };
    
    /*单次淡入效果*/
    self.fadeIn = function(index,callback) {
        if(Ys._IEVersion !== undefined && Ys._IEVersion<=8) {
            self.slideBox[index].style.filter ="alpha(opacity = 0)";
        } else {
            self.slideBox[index].style.opacity = 0;
        }
        Ys(self.slideBox[index]).show();
        
        doFade(index,0,0,'in',function() {
            if(typeof callback =='function')callback();
        });
    };
    
    /*呈现标识符为index的元素*/
    self.show = function(index,callback) {
        if(self.onShow == index || fadingInFlag == 1 || fadingOutFlag==1)return false;
        fadingInFlag = 1;
        fadingOutFlag = 1;
        preShown = self.onShow;
        self.onShow = index;
        /*controller切换*/
        Ys.addClass(self.controllerBox[index],controllerOnClass);
        Ys.removeClass(self.controllerBox[preShown],controllerOnClass);
        /*if(Ys.vendorPrefix) {
        浏览器支持css3时渐变*/
            /*使用关键帧$(self.slideBox[index]).show();
            self.slideBox[index].style[vendorAnimation]="fadeIn";
            self.slideBox[preShown].style[vendorAnimation]="fadeOut";
            self.slideBox[index].style[vendorTiming] = self.slideBox[preShown].style[vendorTiming]="ease-out";
            self.slideBox[index].style[vendorDuration] = self.slideBox[preShown].style[vendorDuration] = css3Duration+"ms";
            self.slideBox[preShown].style.zIndex = 9;
            self.slideBox[index].style.zIndex = 10;
            Ys.addEventListener(self.slideBox[index],Ys.vendorAnimationEnd,function end() {
                self.slideBox[index].style.opacity = 1;
                self.slideBox[preShown].style.opacity = 0;
                Ys(self.slideBox[preShown]).hide();
                self.slideBox[index].style[vendorAnimation] = self.slideBox[preShown].style[vendorAnimation]="";
                self.slideBox[index].style[vendorTiming] = self.slideBox[preShown].style[vendorTiming]="";
                self.slideBox[index].style[vendorDuration] = self.slideBox[preShown].style[vendorDuration]="";
                self.slideBox[index].removeEventListener(Ys.vendorTransitionEnd,end);
                fadingInFlag = 0;
                if(typeof callback === 'function')callback();
            });
            
        } else {*/
            /*浏览器不支持css3时的渐变*/
            self.slideBox[preShown].style.zIndex = 9;
            self.slideBox[index].style.zIndex = 10;
            self.fadeIn(index,function() {
                Ys(self.slideBox[preShown]).hide();
                fadingInFlag = 0;
                if(typeof callback =='function')callback();
            });
             self.fadeOut(preShown,function() {
                Ys(self.slideBox[preShown]).hide();
                fadingOutFlag = 0;
                if(typeof callback =='function')callback();
            });
        /*}*/
    };
    
    self.previous = function(callback) {
        self.stop();
        if(self.onShow === 0)self.show(totalItem-1,function() {
            if(typeof callback == 'function')callback();
            else self.play();
            });
        else self.show(self.onShow-1,function() {
            if(typeof callback == 'function')callback();
            else self.play();
            });
    };
    
    self.next = function(callback) {
        self.stop();
        if(self.onShow ==(totalItem-1))self.show(0,function() {
            if(typeof callback == 'function')callback();
            else self.play();
            });
        else self.show(self.onShow+1,function() {
            if(typeof callback == 'function')callback();
            else self.play();
            });
    };
     self.goto = function(index) {
        self.stop();
        self.show(index,self.play());
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
    
    playTimeoutID = setTimeout(function() {
            self.next(function() { self.play();});
        },delay);
};


