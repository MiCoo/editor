//  Start At 2013/10/15
//  Coded By MiCoo
//  last coded at 2013/12/07
/*
 *  配置方法可到 config.js 文件中参照说明修改
 *  
 *  
 *  
 *  使用方法：
 *  
 *  1. 初始化：       var Aeditor = new Meditor('toolBar');
 *  2. 设置监听函数：    Aeditor.listener(fn);               //添加对编辑区的监听事件，内容若变化就触发
 *  3. 绑定预览区：     Aeditor.bindShowBoard(obj);             //预览区可切换，但同时只能有一个
 *  4. 获取当前编辑区内容： Aeditor.getData();                  //返回的是一串含标签的html字符串
 *  5. 设置预览区的值：   Aeditor.getData('hahahhahahaha');
 *
 */

var Meditor = function (toolBar) {
    this.toolBar = document.getElementById(toolBar);

    this.show = null;

    this.buttons = this.toolBar.getElementsByTagName('a');

    this.selects = this.toolBar.getElementsByTagName('li');

    this.selectUl = this.toolBar.getElementsByTagName('ul');

    this.iframe = document.createElement("iframe");
    // this.iframe.id = 'editor';
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    // this.iframe.style.lineHeight = '80%';
    this.iframe.style.background = '#fff';
    this.iframe.frameBorder = 0;
    this.iframe.style.margin = '0px';
    this.iframe.style.padding = '0px';
    this.iframe.scrolling = "auto";
    // this.iframe.align = "middle";

    this.insertAfter(this.iframe, this.toolBar);

    this.iframeDocument = this.iframe.contentDocument || this.iframe.contentWindow.document;

    // this.iframeDocument.getElementsByTagName('body')[0].style.paddingLeft = '5px';
    // console.log(this.iframeDocument.getElementsByTagName('body')[0]);

    this.iframeDocument.designMode = "on";

    this.iframeDocument.open();

    this.iframeDocument.close();

    if (this.iframe.contentDocument) {
        this.oldContent = this.iframe.contentDocument.body.innerHTML;
    } else {
        this.oldContent = this.iframe.contentWindow.document.body.innerHTML;
    }

    this.historyIe = [];               //为了兼容IE，用数组保存编辑记录

    this.historyKey = 1;              //编辑历史索引键

    this.callback = null;             //编辑文档发生变化后的回调函数

    this.setting = null;

    this.fontsize = '';         //解析字符串到预览区时用到

    this.selectedText = null;       //由于IE下的iframe选中文字后再单击其他区域，选区高亮会消失，所以用这个变量保存选中对象

    this.ranges = null;             //理由同上，但这里保存的是选区，不是对象，用于回显已选的是什么内容

    this.changeBgFirst = null;

    this.init();                //一切完成后就可以开始啦哈哈哈哈哈哈

};
Meditor.prototype = {
    addEvent: function (elm, evType, fn, useCapture) {
        if (elm.addEventListener) {
            elm.addEventListener(evType, fn, useCapture);
            return true;
        } else if (elm.attachEvent) {
            var r = elm.attachEvent('on' + evType, fn);
            return r;
        } else {
            elm['on' + evType] = fn;
        }
    },
    insertAfter: function (newEl, targetEl) {
        var parentEl = targetEl.parentNode;

        if (parentEl.lastChild == targetEl) {
            parentEl.appendChild(newEl);
        } else {
            parentEl.insertBefore(newEl, targetEl.nextSibling);
        }
    },
    getStyle : function(oElm, strCssRule){
        var strValue = "";

        if(oElm.currentStyle){
            strValue = oElm.currentStyle[strCssRule];
        }else if(window.getComputedStyle){
            strValue = document.defaultView.getComputedStyle(oElm,null).getPropertyValue(strCssRule);
        }
        return strValue;
    },
    insertCss: function(css){
        try{
            style = document.createStyleSheet();
            style.cssText = css;
        }catch(e){
            style = document.createElement("style");
            style.type = "text/css";
            style.textContent = css;
            document.getElementsByTagName("HEAD").item(0).appendChild(style);
        }
    },
    setToobarStyle: function () {
        //toolbar
        var This = this;
        var i;
        this.toolBar.style.width = '100%';
        this.toolBar.style.background = '#eee';
        this.toolBar.style.display = 'inline-block';
        this.toolBar.style.padding = '10px 0px';

        //toolbar span
        var toolBar_span = this.toolBar.getElementsByTagName('span');
        for (i = 0; i < toolBar_span.length; i++) {
            // toolBar_span[i].style.position = 'relative';
            toolBar_span[i].style.margin = '0px 1px';
            // toolBar_span[i].style.top = '-10px';
        }
        //toolBar span select
        for (i = 0; i < this.buttons.length; i++) {
            this.buttons[i].style.textDecoration = 'none';
            this.buttons[i].style.color = '#000';
            this.buttons[i].style.display = 'inline-block';
            this.buttons[i].style.width = '24px';
            this.buttons[i].style.height = '24px';
            this.buttons[i].style.position = 'relative';
            this.buttons[i].style.top = '-10px';
            this.buttons[i].style.overflow = 'hidden';
            //toolBar span a:hover img
            this.buttons[i].index = i;

            // this.addEvent(this.buttons[i], 'mouseover', function () {
            //     var _this = this;
            //     alert(i);
            //     // This.buttons[this.index].style.backgroundImage = 'url(Meditor/icon/hover2.png)';
            //     This.buttons[this.index].style.backgroundImage = 'url(Meditor/icon/hover2.png)';
            //     //This.buttons[this.index].style.backgroundRepeat = 'no';
            // });
            // this.addEvent(this.buttons[i], 'mouseout', function () {
            //     var _this = this;
            //     // This.buttons[this.index].style.backgroundImage = 'none';
            //     This.buttons[this.index].style.backgroundImage = 'none';
            //     This.checkStyle();                    //鼠标离开时检测样式
            // });

            this.buttons[i].onmouseover = function(){
                var _this = this;
                // alert(i);
                // This.buttons[this.index].style.backgroundImage = 'url(Meditor/icon/hover2.png)';
                This.buttons[this.index].style.backgroundImage = 'url(Meditor/icon/hover2.png)';
                //This.buttons[this.index].style.backgroundRepeat = 'no'; 
            }
            this.buttons[i].onmouseout = function(){
                var _this = this;
                // This.buttons[this.index].style.backgroundImage = 'none';
                This.buttons[this.index].style.backgroundImage = 'none';
                This.checkStyle();                    //鼠标离开时检测样式
            }
        }
    },
    saveSlection: function(){
        var This = this;
        if(window.getSelection){
            var sel = this.iframeDocument.getSelection(), ranges = [];
            if(sel.rangeCount){
                for(var i=0;i<sel.rangeCount;i++){
                    ranges.push(sel.getRangeAt(i));
                }
            }

            This.ranges = ranges;
            // console.log(This.iframeDocument.execCommand('bold'));
            // return sel;
        }else{
            var sel = this.iframeDocument.selection;
            This.ranges = (sel.type != 'None') ? sel.createRange() : null;
            // console.log(sel);
        }

        //判断 IE11 的办法 啊 NOOOOO!!! chrome 也有着属性 挺萌的
        // if(navigator.product == 'Gecko'){
        //     console.log('i am IE11');
        // }else{
        //     // console.log('i am not IE11');
        // }

        // if(window.getSelection){
        //     console.log('i have getSelection');
        //     var textRange = this.iframeDocument.getSelection();
        //     // var textRange = this.iframeDocument.selection.createRange();
        //     // var textRange = this.iframeDocument.body.createTextRange();
        //     console.log(textRange.htmlText);
        //     // console.log('start: '+textRange.execCommand('bold'));
        //     // console.log('end: '+textRange.execCommand('bold'));
        //     return textRange;
        // }else{      // < IE9
        //     console.log('i dont have getSelection');
        // }


        if(document.all){

            var textRange = this.iframeDocument.selection.createRange();        //stander  对老IE
            // console.log(textRange);
            return textRange;
        }
    },
    restoreRange: function(){
        var This = this;
        if(window.getSelection){
            var sel = this.iframeDocument.getSelection();
            sel.removeAllRanges();
            for(var i=0,l= This.ranges.length;i<l;i++){
                sel.addRange(This.ranges[i]);
            }
        }else{
            if(this.saveSlection){
                This.ranges.select();
            }
        }
    },
    changeStyle: function () {
        var i,This = this;
        for (i = 0, l = this.buttons.length; i < l; i++) {        //按钮

            var This = this;      //转换对象

            this.buttons[i].onclick = function () {

                //This.buttons[i].index = i;
                var command = this.getAttribute("name");
                var commandRes = This.iframeDocument.queryCommandValue(command);
                // console.log('fds');
                // This.selectedText = This.selectedText;
                if (command == 'insertImage' || command == 'createLink') {
                    return function () {
                        var link = window.prompt('请输入链接');
                        if(link=="" || link==null){
                            return;
                        }
                        This.iframeDocument.execCommand(command, false, link);
                        // This.historyIe.push(This.iframe.contentDocument.body.innerHTML);
                        This.historyIe.push(This.getData());
                        This.historyKey += 1;
                        This.checkStyle();
                        This.callback();
                        This.refresh();      //刷新
                    }();
                }
                if (window.ActiveXObject && command == 'undo') {
                    return function () {
                        This.historyKey = (This.historyKey - 1) > 0 ? (This.historyKey - 1) : 1;
                        This.iframe.contentDocument.body.innerHTML = This.historyIe[This.historyKey - 1];
                        This.checkStyle();
                        This.callback();
                        This.refresh();      //刷新
                    }();
                } else if (window.ActiveXObject && command == 'redo') {

                    return function () {
                        This.historyKey = (This.historyKey + 1) >= This.historyIe.length ? This.historyKey : (This.historyKey + 1);
                        This.iframe.contentDocument.body.innerHTML = This.historyIe[This.historyKey - 1];
                        //console.log('key:  '+This.historyKey);
                        This.checkStyle();
                        This.callback();
                        This.refresh();      //刷新
                    }();
                }
                //如果文本已经居中，再次点击居中，则视为取消并回到居左(PS: ck就这么做的)
                if( command.indexOf('justify') != -1 && commandRes == 'true' ){
                    return function(){
                        This.iframeDocument.execCommand('justifyLeft');
                        This.historyIe.push(This.getData());
                        This.historyKey += 1;
                        This.checkStyle();
                        This.callback();
                        This.refresh();      //刷新
                    }();
                }
                // console.log(command+'  res: '+commandRes+'  try:'+This.iframeDocument.queryCommandValue('insertorderedlist'));
                //阻止在选择列表之后再缩进(PS: 参照于CK)    啊啊啊~~~我错了，这!不!是!BUG!
                // if(command.toLowerCase() == 'indent' && This.iframeDocument.queryCommandValue('insertorderedlist')!='false'){
                //     console.log(This.iframeDocument.queryCommandValue('insertorderedlist')=='false');
                //     return false;
                // }
                // if(command.toLowerCase() == 'indent' && This.iframeDocument.queryCommandValue('insertunderedlist')!='false'){
                //     return false;
                // }

                return function () {
  
                    This.iframeDocument.execCommand(command);
                    // console.log('finally done');
                    This.historyIe.push(This.getData());
                    This.historyKey += 1;
                    This.checkStyle();
                    This.callback();
                    This.refresh();      //刷新

                    //在这里呢，必须解释一下：这里是重置IE下的选择对象，不然IE11默认文档模式下的BUG为：第一次加粗/斜体/下划线 无法取消（哈哈哈哈哈哈哈哈，挺萌的，好神奇的bug） of cause!!  目前只对IE11
                    //PS: 我怀疑是IE11 删除了document.selection  的缘故吧
                    if($.browser.version == '11.0'){
                        // console.log($.browser.version);
                        // This.selectedText = null;
                        This.restoreRange();
                        This.selectedText = This.saveSlection();    
                    }
                }();        //要自运行
            };
        };

        for (i = 0, l = this.selects.length; i < l; i++) {         //下拉框
            var This = this;
 
            this.selects[i].onclick = function(){
                var command = this.parentNode.parentNode.getAttribute('name');
                var value = this.getAttribute('name');
                // alert(this.getAttribute('name'));
                return function(e){
                    // alert(command+'   '+value);
                    // console.log(This.selectedText);
                    if(This.selectedText){
                        // console.log(This.selectedText.toString());
                        This.selectedText.execCommand(command, false, value);
                    }else{
                        This.iframeDocument.execCommand(command, false, value);
                    }
                    // This.selectedText = null;
                    // This.iframeDocument.execCommand(command, false, value);
                    This.historyIe.push(This.getData());
                    This.historyKey += 1;
                    function hex(x) {
                        return ("0" + parseInt(x).toString(16)).slice(-2);
                    }
                    if(command=='fontsize'){
                        This.fontsize = value;
                        var commandRes = This.iframe.contentWindow.document.queryCommandValue('backcolor').toString().toLowerCase();
                        // console.log(commandRes);
                        if (window.attachEvent && typeof(commandRes) == 'number') {   //IE
                            //alert('ie');
                            commandRes = parseInt(commandRes).toString(16);
                            //console.log('#'+commandRes+'   --2   IE');
                        } else {
                            if (commandRes.indexOf("rgb") != -1 && commandRes.indexOf("rgba") == -1) {
                                // console.log(commandRes+'   --1  Chrome rgb');
                                commandRes = commandRes.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                                if (commandRes) {
                                    commandRes = "#" + hex(commandRes[1]) + hex(commandRes[2]) + hex(commandRes[3]);
                                }
                                // console.log(commandRes+'   --2  Chrome rgb');
                            } else if (commandRes.indexOf("rgba") != -1) {
                                // console.log(commandRes+'   --1  Chrome rgba');
                                commandRes = commandRes.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
                                if (commandRes) {
                                    commandRes = "#" + hex(commandRes[1]) + hex(commandRes[2]) + hex(commandRes[3]);
                                }
                                commandRes = '#ffffff';             //这里很极端，搞不好出BUG
                                // console.log(commandRes+'   --2  Chrome rgba');
                            }
                        }
                        // console.log(commandRes);
                        if(window.navigator.userAgent.indexOf("Chrome") !== -1){
                            //chrome 下的先改背景色再改大小时，背景色无法变高，所以这个做个兼容
                            //就是改背景再改大小时，重刷一次背景(背景值来源于回显)
                            This.iframeDocument.execCommand('backcolor', false, commandRes);
                            // console.log(commandRes);
                        }

                    }
                    This.refresh();      //刷新
                    for( i=0;i<This.selectUl.length;i++){
                        $(This.selectUl[i]).fadeOut();
                    }
                    // return false;
                    // console.log('start---');
                    if(window.attachEvent){
                        This.restoreRange();
                    }
                    // var e = e || window.event;
                    // if(e.stopPropagation){
                    //     e.stopPropagation();
                    //     e.preventDefault();
                    // }else{
                    //     e.cancelBubble = true;
                    //     e.returnValue = false;
                    // }
                    // console.log(This.selectedText);
                }();
            }
        };
    },
    refresh: function () {
        var html, i, l;

        html = this.iframeDocument.body.innerHTML;

        // console.log(html);
        if (this.show) {
            //this.show.innerHTML = html;
            this.show.innerHTML = this.changeTag(html);

            // 由于在IE下的 blockquote 标签不会自动缩进，SO，要兼容，顺便把主流的也统一了
            // var blockquote = this.show.getElementsByTagName('blockquote');
            // if(blockquote){
            //     for(i=0,l=blockquote.length;i<l;i++){
            //         blockquote[i].style.padding = '0px 18px';
            //         blockquote[i].style.margin = '0px 18px';
            //     }
            // }
            
            //让显示区的列表有样式（序号）        就这一个功能来说，FF的做法是最好的
            var ul = this.show.getElementsByTagName('ul');          
            var ol = this.show.getElementsByTagName('ol');
            for (i = 0; i < ul.length; i++) {
                ul[i].style.listStyle = 'inside disc';
                ul[i].style.paddingLeft = '20px';
            }
            for (i = 0; i < ol.length; i++) {
                ol[i].style.listStyle = 'inside decimal';
                ol[i].style.paddingLeft = '20px';
            }
            
        }

    },
    changeTag: function(html){              //把<font>标签用<span>替代
        var This = this,
            html = html,
            // fontArr = ['10px','12px','16px','18px','24px','32px','48px'],
            fontArr = { 1:'10px', 2:'12px', 3:'16px', 4:'18px', 5:'24px', 6:'32px', 7:'48px'},
            size,
            fontsize,
            result,
            patt = /font-size:\d/g;
        // console.log('before: '+html);
        if(/<\/font>/.test(html)){
            html = html.replace(/<\/font>/igm,'</span>');
            html = html.replace(/<font/igm,'<span');

            html = html.replace(/face="/igm,'style="font-family:');
            html = html.replace(/size="/igm,'style="font-size:');
            html = html.replace(/color="/igm,'style="color:');

            html = html.replace(/" style="/igm,';');
            html = html.replace(/" color="/igm,';color:');
            html = html.replace(/" font-size="/igm,';font-size:');
            html = html.replace(/" font-family="/igm,';font-family:');

            // var result, patt = /font-size:\d/g, size;
            while((result = patt.exec(html)) != null){
                //alert(result);
                size = result.toString().substring(result.toString().length-1);
                // console.log('size: '+size);
                fontSize = fontArr[size];
                // console.log('fontsize: '+fontSize);
                html = html.replace('font-size:'+size,'font-size:'+fontSize);
            }
        }
        //ie 下斜体<em></em> 无法正常显示
        html = html.replace(/<em>/igm,'<i>');
        html = html.replace(/<\/em>/igm,'</i>');

        // console.log('after: '+html);
        return html;
    },
    restoreTag: function(html){
        
    },
    keyupToRefresh: function () {
        var This = this;
        this.addEvent(this.iframeDocument, 'keyup', function () {
            This.refresh();
            This.historyIe.push(This.getData());
            This.historyKey += 1;
            This.checkStyle();
        });
        this.addEvent(this.iframeDocument, 'mouseup', function () {
            This.refresh();
            This.historyIe.push(This.getData());
            This.historyKey += 1; 
            // This.checkStyle();
            // This.saveSlection().execCommand('backcolor',false,'#000');
            This.selectedText = This.saveSlection();

            if(document.createRange && window.getSelection){
                var range = This.iframe.contentWindow.document.getSelection();
            }else if(document.selection && document.body.createTextRange){
                var range = This.iframe.contentWindow.document.selection.createRange().text;
            }
            // console.log(range.getRangeAt(0));
            // if(range.getRangeAt(0)==""){
            if(window.navigator.userAgent.indexOf("Chrome") !== -1){
                if(!range.getRangeAt(0).collapsed){             //chrome 下防止选择空行也回显，IE不用，因为IE选不上空的
                    // console.log('kong');
                    return false;
                }                
            }
            
            This.checkStyle();
        
        });
        //console.log(this.historyIe);
    },
    //初始化
    init: function (content) {
        this.setToolbar();

        this.config();

        this.changeStyle();

        this.keyupToRefresh();

        var This = this;
        // var win = this.iframe.contentWindow.document || this.iframe.contentDocument;
        // this.addEvent(win, 'mouseup', function () {
        //     for (var i = 0; i < This.buttons.length; i++) {
        //         var command = This.buttons[i].getAttribute('name');
        //         if (This.iframe.contentWindow.document.queryCommandState(command)) {
        //             This.buttons[i].style.backgroundImage = 'url(Meditor/icon/active2.png)';
        //         } else {
        //             This.buttons[i].style.backgroundImage = 'none';
        //         }
        //     }
        // });
        this.setToobarStyle();
        this.setData(content);
        this.historyIe.push(content);
        this.controlSelect();

    },
    controlSelect: function(){
        var This = this;
        var s = this.toolBar.getElementsByTagName('ul');
        var i;
        this.addEvent(This.iframeDocument, 'click',function(){
            for(i=0;i<s.length;i++){
                $(s[i]).fadeOut(100);
                $(s[i]).prev().css('background', 'url(Meditor/icon/selectBtn.png)');
            }
            // alert();
            var colorPicker = $('.colorpicker');
            if(typeof(colorPicker) == 'object'){
                $(colorPicker).fadeOut(100);
            }
        });
        this.addEvent(document, 'click', function(){
            for(i=0;i<s.length;i++){
                $(s[i]).fadeOut(100);
                $(s[i]).prev().css('background', 'url(Meditor/icon/selectBtn.png)');
            }
        });
    },
    config: function () {
        var btn = document.createElement('a');
        var newBtn;
        var This = this;
        var json = this.setting;

        function createSelect(title){
            var s = document.createElement('span');
            var i;
            // s.style.border = '1px solid blue';
            s.style.position = 'relative';
            s.style.fontSize = '14px';
            s.style.top = '-10px';
            s.style.cursor = 'pointer';
            s.style.zIndex = '1';
            s.setAttribute('name',title);
            // s.style.top = '4px';

            var ul = document.createElement('ul');
            
            ul.setAttribute('name', title);
            var p = document.createElement('span');
            p.setAttribute('class','showAttr')

            p.style.display = 'inline-block';
            p.style.lineHeight = '24px';
            p.style.padding = '0px 4px';
            p.style.overflow = 'hidden';
            p.style.color = '#353538';

            p.style.marginTop = '10px';
            p.style.height = '24px';
            p.style.width = '62px';
            p.style.backgroundImage = 'url(Meditor/icon/selectBtn.png)';

            p.onmouseover = function(){
                if($(this).siblings().css('display') == 'none'){
                    this.style.backgroundImage = 'url(Meditor/icon/selectHover.png)';
                }else{
                    this.style.backgroundImage = 'url(Meditor/icon/selectActive.png)';
                }
            }
            p.onmouseout = function(){
                if($(this).siblings().css('display') == 'none'){
                    this.style.backgroundImage = 'url(Meditor/icon/selectBtn.png)';
                }else{
                    this.style.backgroundImage = 'url(Meditor/icon/selectActive.png)';
                }
            }
            
            if(title == 'fontsize'){
                p.innerHTML = '大小';
                s.setAttribute('title','字体大小');
                ul.style.width = '140px';
            }else if(title == 'fontname'){
                p.innerHTML = '字体';
                s.setAttribute('title','字体样式');
                ul.style.width = '140px';
            }
            // p.style.marginTop = '10px';
            s.appendChild(p);

            ul.style.listStyle = 'none';
            ul.style.border = '1px solid #aaa';
            ul.style.padding = '4px';
            ul.style.overflow = 'auto';
            ul.style.maxHeight = '120px';
            ul.style.position = 'absolute';
            ul.style.background = '#fff';
            ul.style.top = '20px';
            ul.style.left = '0px';
            ul.style.borderRadius = '4px';
            ul.style.boxShadow = '1px 2px 2px #eee';
            for(var name in json[type]){
                var li = document.createElement('li');
                li.style.width = '100%';
                // var a = document.createElement('a');
                // a.href = 'javascript:void(0)';
                li.innerHTML = json[type][name];
                // a.innerHTML = json[type][name];
                // a.style.width = '110px';
                // a.style.height = '24px';
                // a.style.display = 'inline-block';
                li.setAttribute('name',name);
                li.setAttribute('title',json[type][name]);
                li.style.borderRadius = '3px';
                li.style.cursor = 'pointer';
                li.style.width = '100%';
                li.style.lineHeight = '130%';
                
                if(title == 'fontsize'){
                    li.style.fontSize = json[type][name];
                }else if(title == 'fontname'){
                    li.style.fontFamily = name;
                }
                li.onmouseover = function(){
                    this.style.background = '#eee';
                }
                li.onmouseout = function(){
                    this.style.background = '#fff';
                }
                // li.appendChild(a);
                ul.appendChild(li);
            }
            s.appendChild(ul);
            This.toolBar.appendChild(s);
            var img = document.createElement('img');
            img.src = "Meditor/icon/breakline.png";
            This.toolBar.appendChild(img);
            ul.style.display = 'none';
            s.onmousedown = function(e){
                var e = e || window.event;
                if(e.stopPropagation){
                    e.stopPropagation();
                    e.preventDefault();
                }else{
                    e.cancelBubble = true;
                    e.returnValue = false;
                }
            }
            s.onclick = function(e){
                for(i=0;i<This.selectUl.length;i++){
                    $(This.selectUl[i]).fadeOut(100);
                    $(This.selectUl[i]).prev().css('backgroundImage','url(Meditor/icon/selectBtn.png)');
                }
                if(This.getStyle(this.getElementsByTagName('ul')[0],'display') == 'none'){
                    $(this.getElementsByTagName('ul')[0]).fadeIn(100);
                    $(this.getElementsByTagName('span')[0]).css('backgroundImage','url(Meditor/icon/selectActive.png)');
                }else{
                    $(this.getElementsByTagName('ul')[0]).fadeOut(100);
                    $(this.getElementsByTagName('span')[0]).css('backgroundImage','url(Meditor/icon/selectBtn.png)');
                }
                // console.log('start---');
                $('.colorpicker').fadeOut(100);
                var e = e || window.event;
                if(e.stopPropagation){
                    e.stopPropagation();
                    e.preventDefault();
                }else{
                    e.cancelBubble = true;
                    e.returnValue = false;
                }
                if(window.attachEvent){     
                    This.restoreRange();            //IE 回显编辑区的选择区
                }
                              
                // console.log(This.iframeDocument.getSelection());
            }
            
        }
        function create() {
            var block = document.createElement('span');
            //block.setAttribute('class','block');
            for (var name in json[type]) {
                for (var html in json[type][name]) {
                    newButton = btn.cloneNode(true);
                    newButton.setAttribute('name', name);
                    newButton.setAttribute('title', json[type][name][html]);
                    newButton.setAttribute('href', 'javascript:void(0);');
                    newButton.innerHTML = '<img src="Meditor/icon/' + name + '.png" />';
                    block.appendChild(newButton);
                    This.toolBar.appendChild(block);
                }
            }
            This.toolBar.appendChild(block);
            var img = document.createElement('img');
            img.src = "Meditor/icon/breakline.png";
            This.toolBar.appendChild(img);
        }
        for (var type in json) {
            switch (type) {
                case 'block1' :
                    create();
                    break;
                case 'block2' :
                    create();
                    break;
                case 'block3' :
                    create();
                    break;
                case 'block4' :
                    create();
                    break;
                case 'block5' :
                    create();
                    break;
                case 'block6' :
                    create();
                    break;
                case 'block7' :
                    create();
                    break;
                case 'fontname':
                    createSelect('fontname');
                    break;
                case 'fontsize':
                    createSelect('fontsize');
                    break;
            }
        }

        var colorSpan = document.createElement('span');

        var fontColor = document.createElement('img');
        fontColor.title = '字体颜色';
        fontColor.style.width = '24px';
        fontColor.style.height = '24px';
        fontColor.style.position = 'relative';
        fontColor.style.top = '-10px';
        fontColor.src = 'Meditor/icon/font-color.png';
        fontColor.onmouseover = function(){
            this.style.backgroundImage = 'url(Meditor/icon/icon-hoverbg.png)';
        }
        fontColor.onmouseout = function(){
            this.style.backgroundImage = 'none';
        }
        $(fontColor).ColorPicker({
            color: '#0000ff',
            onShow: function (colpkr) {
                for(var i=0;i<This.selectUl.length;i++){
                    $(This.selectUl[i]).fadeOut(100);
                    $(This.selectUl[i]).prev().css('background', 'url(Meditor/icon/selectBtn.png)');
                }
                $(colpkr).fadeIn(100);
                $(colpkr).mousedown(function(e){
                    var e = e || window.event;
                    if(e.stopPropagation){
                        e.stopPropagation();
                        e.preventDefault();
                    }else{
                        e.cancelBubble = true;
                        e.returnValue = false;
                    }
                });
                return false;
            },
            onHide: function (colpkr) {
                $(colpkr).fadeOut(100);
                return false;
            },
            onChange: function (hsb, hex, rgb) {
                return function () {
                    if(This.selectedText){
                        This.selectedText.execCommand("forecolor", false, "#"+hex);
                    }else{
                        This.iframeDocument.execCommand("forecolor", false, "#"+hex);
                    }
                    // This.iframeDocument.execCommand("forecolor", false, "#"+hex);
                    // This.selectedText = null;
                    This.historyIe.push(This.getData());
                    This.historyKey += 1;
                    This.refresh();      //刷新
                    if(window.attachEvent){
                        This.restoreRange();
                    }
                }();
            }
        });
        colorSpan.appendChild(fontColor);

        var backColor = document.createElement('img');
        backColor.title = '背景颜色';
        backColor.style.width = '24px';
        backColor.style.height = '24px';
        // backColor.innerHTML = 'back';
        backColor.style.position = 'relative';
        backColor.style.top = '-10px';
        backColor.src = 'Meditor/icon/font-bgcolor.png';
        backColor.onmouseover = function(){
            this.style.backgroundImage = 'url(Meditor/icon/icon-hoverbg.png)';
        }
        backColor.onmouseout = function(){
            this.style.backgroundImage = 'none';
        }
        $(backColor).ColorPicker({
            color: '#0000ff',
            onShow: function (colpkr) {
                $(colpkr).fadeIn(100);
                for(var i=0;i<This.selectUl.length;i++){
                    $(This.selectUl[i]).fadeOut(100);
                    $(This.selectUl[i]).prev().css('background', 'url(Meditor/icon/selectBtn.png)');
                }
                $(colpkr).mousedown(function(e){
                    var e = e || window.event;
                    if(e.stopPropagation){
                        e.stopPropagation();
                        e.preventDefault();
                    }else{
                        e.cancelBubble = true;
                        e.returnValue = false;
                    }
                });
                return false;
            },
            onHide: function (colpkr) {
                $(colpkr).fadeOut(100);
                return false;
            },
            onChange: function (hsb, hex, rgb) {
                return function () {
                    if(This.selectedText){
                        This.selectedText.execCommand("backcolor", false, "#"+hex);
                    }else{
                        This.iframeDocument.execCommand("backcolor", false, "#"+hex);
                    }
                    // This.iframeDocument.execCommand("backcolor", false, "#"+hex);
                    This.historyIe.push(This.getData());
                    This.historyKey += 1;
                    This.refresh();      //刷新
                    if(window.attachEvent){
                        This.restoreRange();
                    }
                }();
            }
        });
        colorSpan.appendChild(backColor);
        this.toolBar.appendChild(colorSpan);

    },
    checkStyle: function () {
        var This = this;
        var i;
        // var fontArr = ['', '宋体', 'KaiTi_GB2312', '黑体', '微软雅黑', 'Comic Sans MS'];
        var fontSizeArr = {1: '10px',2: '12px',3: '16px',4: '18px',5: '24px',6: '32px',7: '48px'};
        for (i = 0; i < This.buttons.length; i++) {
            var command = This.buttons[i].getAttribute('name');
            // if (This.iframe.contentWindow.document.queryCommandState(command)) {
            if (This.iframeDocument.queryCommandState(command)) {
                //This.buttons[i].setAttribute('class','active');
                This.buttons[i].style.backgroundImage = 'url(Meditor/icon/active2.png)';
            } else {
                //This.buttons[i].setAttribute('class','notActive');
                This.buttons[i].style.backgroundImage = 'none';
            }
        }
    
        // function hex(x) {
        //     return ("0" + parseInt(x).toString(16)).slice(-2);
        // }

        for (i = 0; i < This.selectUl.length; i++) {
            //console.log('i=  '+i);
        
            var command = This.selectUl[i].getAttribute('name');
            // var commandRes = This.iframe.contentWindow.document.queryCommandValue(command).toString().toLowerCase();
            var commandRes = This.iframeDocument.queryCommandValue(command);
            if(commandRes){
                commandRes = This.iframeDocument.queryCommandValue(command).toString().toLowerCase();
            }
            // var commandRes = This.iframeDocument.queryCommandValue(command).toString().toLowerCase();

            // console.log(commandRes+'  --   '+command);
        /*
            //颜色的回显匹配
            if (window.attachEvent && typeof(commandRes) == 'number') {   //IE
                //alert('ie');
                commandRes = parseInt(commandRes).toString(16);
                //console.log('#'+commandRes+'   --2   IE');
            } else {
                if (commandRes.indexOf("rgb") != -1 && commandRes.indexOf("rgba") == -1) {
                    commandRes = commandRes.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                    if (commandRes) {
                        commandRes = "#" + hex(commandRes[1]) + hex(commandRes[2]) + hex(commandRes[3]);
                    }
                    //console.log(commandRes+'   --2  Chrome rgb');
                } else if (commandRes.indexOf("rgba") != -1) {
                    commandRes = commandRes.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
                    if (commandRes) {
                        commandRes = "#" + hex(commandRes[1]) + hex(commandRes[2]) + hex(commandRes[3]);
                    }
                    //console.log(commandRes+'   --2  Chrome rgba');
                }
            }
        */
            var selects = This.selectUl[i].getElementsByTagName('li');

            for (var j = 0; j < selects.length; j++) {
                // console.log('检查结果：'+commandRes+ '   取得结果：'+ selects[j].getAttribute('name'));
                var commandMatch = selects[j].getAttribute('name').toLowerCase();
                var commandHtml = selects[j].innerHTML;
                // console.log('target: '+commandMatch+'   get:  '+commandRes);
                if(commandRes){
                    if (commandRes == commandMatch || commandHtml ==  commandRes) {
                        if(!isNaN(commandMatch)){                               //判断为字体
                            This.selectUl[i].parentNode.getElementsByTagName('span')[0].innerHTML = fontSizeArr[''+commandMatch+''];
                        }else{
                            This.selectUl[i].parentNode.getElementsByTagName('span')[0].innerHTML = commandHtml;
                        }
                        break;                //必须要break掉，不然最后一个else会将回显重置
                    } else if (commandRes == selects[j].innerHTML) {         
                        This.selectUl[i].parentNode.getElementsByTagName('span')[0].innerHTML = selects[j].innerHTML;
                        break;
                     } else if (commandRes.substring(1, commandRes.length - 1) == commandMatch) {  
                        //chrome 下会返回带引号的字段，所以要去掉
                        This.selectUl[i].parentNode.getElementsByTagName('span')[0].innerHTML = commandRes.substring(1, commandRes.length - 1);
                        break;
                    } else if(commandRes==''){
                        This.selectUl[i].parentNode.getElementsByTagName('span')[0].innerHTML = '大小';
                    }else{
                        This.selectUl[i].parentNode.getElementsByTagName('span')[0].innerHTML = '字体';
                    }
                }
                // if (commandRes == commandMatch || commandHtml ==  commandRes) {
                //     if(!isNaN(commandMatch)){                               //判断为字体
                //         This.selectUl[i].parentNode.getElementsByTagName('span')[0].innerHTML = fontSizeArr[''+commandMatch+''];
                //     }else{
                //         This.selectUl[i].parentNode.getElementsByTagName('span')[0].innerHTML = commandHtml;
                //     }
                //     break;                //必须要break掉，不然最后一个else会将回显重置
                // } else if (commandRes == selects[j].innerHTML) {         
                //     This.selectUl[i].parentNode.getElementsByTagName('span')[0].innerHTML = selects[j].innerHTML;
                //     break;
                //  } else if (commandRes.substring(1, commandRes.length - 1) == commandMatch) {  
                //     //chrome 下会返回带引号的字段，所以要去掉
                //     This.selectUl[i].parentNode.getElementsByTagName('span')[0].innerHTML = commandRes.substring(1, commandRes.length - 1);
                //     break;
                // } else if(commandRes==''){
                //     This.selectUl[i].parentNode.getElementsByTagName('span')[0].innerHTML = '大小';
                // }else{
                //     This.selectUl[i].parentNode.getElementsByTagName('span')[0].innerHTML = '字体';
                // }

            }
        }
    
    },
    getData: function () {
        if (document.all) {//IE
            var html = this.iframe.contentWindow.document.body.innerHTML;
        } else {//Firefox
            var html = this.iframe.contentDocument.body.innerHTML;
        }
        return html;
    },
    setData: function (c) {
        if (document.all) {//IE
            this.iframe.contentWindow.document.body.innerHTML = c;
        } else {//Firefox
            this.iframe.contentDocument.body.innerHTML = c;
        }
    },
    listener: function (fn) {
        var This = this;
        this.callback = fn;
        this.addEvent(This.iframe.contentWindow.document, 'keyup', function () {
            var newContent = This.getData();
            if (newContent !== This.oldContent) {
                This.oldContent = newContent;
                fn();
            }
        });
    },
    bindShowBoard: function (obj) {
        var This = this;
        this.show = obj;
        this.show.className = 'editorShowBoard';                //给预览板设置样式时用到的class，避免影响整个页面的样式
        This.insertCss('.editorShowBoard{line-height:200%;color:#000;font-size:16px;font-family:"宋体";} .editorShowBoard ul li{list-style: inside disc;padding-left:20px;padding-top:20px;} .editorShowBoard ol li{list-style: inside decimal;padding-left:20px;padding-top:20px;} .editorShowBoard blockquote{margin:0px 18px;padding:0px 18px;}');
        this.addEvent(this.iframe.contentWindow.document, 'keyup', function () {
            This.refresh();
            //由于在IE下的 blockquote 标签不会自动缩进，SO，要兼容，顺便把主流的也统一了
            // var blockquote = This.show.getElementsByTagName('blockquote');
            // if(blockquote){
            //     for(i=0,l=blockquote.length;i<l;i++){
            //         blockquote[i].style.padding = '0px 18px';
            //         blockquote[i].style.margin = '0px 18px';
            //     }
            // }

            //让显示区的列表有样式（序号）        就这一个功能来说，FF的做法是最好的
            // var ul = This.show.getElementsByTagName('ul');          
            // var ol = This.show.getElementsByTagName('ol');
            // for (var i = 0; i < ul.length; i++) {
            //     // ul[i].style.listStyle = 'inside disc';
            //     ul[i].style.listStyleType = 'decimal';
            //     ul[i].style.marginLeft = '20px';
            //     ul[i].style.paddingLeft = '20px';
            // }
            // for (var i = 0; i < ol.length; i++) {
            //     // ol[i].style.listStyle = 'inside decimal';
            //     ol[i].style.listStyleType = 'disc';
            //     ol[i].style.marginLeft = '20px';
            //     ol[i].style.paddingLeft = '20px';
            // }

            // This.insertCss('.editorShowBoard{line-height:200%;color:#000;font-size:16px;font-family:"宋体";} .editorShowBoard ul li{list-style: inside disc;padding-left:20px;padding-top:20px;} .editorShowBoard ol li{list-style: inside decimal;padding-left:20px;padding-top:20px;} .editorShowBoard blockquote{margin:0px 18px;padding:0px 18px;}');
        });
    }
};
