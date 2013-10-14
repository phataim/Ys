
/*表单验证组件*/
Ys.formValidator = function(options) {
    
    if(typeof options != 'object')options = {};
    
    var self = this;
    
    self.regexEnum = {
        
        captcha:"^\\w{4}$",                                //四字母
        password:"^.{6,40}$",
        intege:"^-?[1-9]\\d*$",                    //整数
        intege1:"^[1-9]\\d*$",                    //正整数
        intege2:"^-[1-9]\\d*$",                    //负整数
        num:"^([+-]?)\\d*\\.?\\d+$",            //数字
        num1:"^[1-9]\\d*|0$",                    //正数（正整数 + 0）
        num2:"^-[1-9]\\d*|0$",                    //负数（负整数 + 0）
        decmal:"^([+-]?)\\d*\\.\\d+$",            //浮点数
        decmal1:"^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$",　　    //正浮点数
        decmal2:"^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$",　 //负浮点数
        decmal3:"^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$",　 //浮点数
        decmal4:"^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$",　　 //非负浮点数（正浮点数 + 0）
        decmal5:"^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$",　　//非正浮点数（负浮点数 + 0）
        email:"^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", //邮件
        color:"^[a-fA-F0-9]{6}$",                //颜色
        url:"^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$",    //url
        chinese:"^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$",                    //仅中文
        ascii:"^[\\x00-\\xFF]+$",                //仅ACSII字符
        zipcode:"^\\d{6}$",                        //邮编
        mobile:"^(13|15)[0-9]{9}$",                //手机
        ip4:"^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$",    //ip地址
        notempty:"^\\S+$",                        //非空
        picture:"(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$",    //图片
        rar:"(.*)\\.(rar|zip|7zip|tgz)$",                                //压缩文件
        qq:"^[1-9]*[1-9][0-9]*$",                //QQ号码
        tel:"^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$",    //电话号码的函数(包括验证国内区号,国际区号,分机号)
        username:"^\\w+$",                        //用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
        letter:"^[A-Za-z]+$",                    //字母
        letter_u:"^[A-Z]+$",                    //大写字母
        letter_l:"^[a-z]+$",                    //小写字母
        idcard:"^[1-9]([0-9]{14}|[0-9]{17})$"    //身份证
    };
    
    options = {
        formId:options.formId||'form',
        asyncPost:options.asyncPost||'true',
        toVerifyItems:options.toVerifyItems,
        itemsWrap:options.itemsWrap||'',
        infoWrapIDs:options.infoWrapIDs||'',
        verifyType:options.verifyType,
        errorInfo:options.errorInfo||'',
        itemWrongFn:options.itemWrongFn||function(){},
        itemRightFn:options.itemRightFn||function(){},
        submit:options.submit||function(form){form.submit();},
        callbacks:options.callbacks
    };
    
    self.form = Ys('#' + options.formId).element;
    self.toVerifyItems = [];
    self.itemsWrap = [];
    self.infoWrap = [];
    self.validValue = [];
    self.callbacks = options.callbacks;
    function matchStr(regexEnum,str,rgExp) {
        if(!regexEnum[rgExp])return false;
        if(str.match(regexEnum[rgExp]) === null)return false;
        return true;
    }
    
    function checkOnce(index) {
        if(self.toVerifyItems[index].value !== '')Ys.addClass(self.itemsWrap[index],'notempty');
        else Ys.removeClass(self.itemsWrap[index],'notempty');
        if(!matchStr(self.regexEnum,self.toVerifyItems[index].value,options.verifyType[index])) {
            Ys.removeClass(self.itemsWrap[index],'right');
            Ys.addClass(self.itemsWrap[index],'wrong');
            Ys.addClass(self.infoWrap[index],'active');
            self.infoWrap[index].innerHTML = options.errorInfo[index];
            self.validValue[index] = false;
            options.itemWrongFn(index,self.toVerifyItems[index],self.infoWrap[index]);
            return false;
        }else {
            Ys.removeClass(self.itemsWrap[index],'wrong');
            Ys.addClass(self.itemsWrap[index],'right');
            self.infoWrap[index].innerHTML = '';
            Ys.removeClass(self.infoWrap[index],'active');
            self.validValue[index] = true;
            options.itemRightFn(index,self.toVerifyItems[index],self.infoWrap[index]);
            self.callbacks[index]();
            return true;
        }
    }
    
    
    
    self.init = function() {
        
        for(var j = 0;j<options.toVerifyItems.length;j++) {

            self.toVerifyItems[j] = Ys('#' + options.toVerifyItems[j]).element;
            if(!matchStr(self.regexEnum,self.toVerifyItems[j].value,options.verifyType[j])) {
                self.validValue[j] = false;
            }else {
                self.validValue[j] = true;
            }
            if(typeof(options.itemsWrap[j])=='undefined') {
                self.itemsWrap[j] = self.toVerifyItems[j].parentNode;
            }
            if(typeof(options.infoWrapIDs[j])!='undefined') {
                self.infoWrap[j] = Ys('#' + options.infoWrapIDs[j]).element;
            }
            Ys.addEventListener(self.toVerifyItems[j],'focus',function(j) {
                return function(){
                    Ys.addClass(self.itemsWrap[j],'focus');
                    Ys.addClass(self.toVerifyItems[j],'focus');
                };
            }(j));
             Ys.addEventListener(self.toVerifyItems[j],'blur',function(j) {
                return function(){
                    Ys.removeClass(self.itemsWrap[j],'focus');
                    Ys.removeClass(self.toVerifyItems[j],'focus');
                    checkOnce(j);
                };
            }(j));
        }
        
        
        Ys.addEventListener(self.form,'submit',function(e) {
            Ys.stopDefault(e);
            var ok = true;
            for(var i = 0;i<options.toVerifyItems.length;i++) {
                if(self.validValue[i] === false) {
                    if(!checkOnce(i)){
                        ok = false;
                    }
                }
            }
            if(ok === true){
                options.submit(self.form);
            } else {
                return false;
            }
        });
    };
    
    self.init();
    
};
